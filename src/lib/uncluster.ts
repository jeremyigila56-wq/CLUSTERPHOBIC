import { createServerFn } from "@tanstack/react-start";
import { parseDump } from "./parser";
import { ENERGIES, HORIZONS, KINDS, type UnclusterResult } from "./types";

const SYSTEM = `You are Clusterphobic, a calm editor for an overcrowded mind.
The user dumped unstructured thoughts. Split them into atomic items.
Return ONLY JSON with this shape:
{
  "clusters": [{"name": "short pile name", "summary": "one line"}],
  "thoughts": [{
    "title": "short verb-led title",
    "body": "optional extra context or empty string",
    "kind": "task" | "note" | "worry" | "appointment" | "idea",
    "cluster": "must match a cluster name",
    "horizon": "now" | "today" | "week" | "someday",
    "energy": "low" | "medium" | "high",
    "durationMin": 15,
    "dueAt": "ISO-8601 or null",
    "scheduledAt": "ISO-8601 or null"
  }],
  "briefing": "one quiet sentence about their load, no pep talk, no emoji"
}
Rules:
- Each thought is one action or one worry. Split lists.
- Prefer 4–12 thoughts. Never invent obligations they did not mention.
- Use the provided current time for relative dates (today, Friday, 3pm).
- Keep cluster names short: Work, Home, Health, People, Money, or a fitting noun.
- Titles under 70 characters. No emoji. No hashtags.`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNum(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function coerceResult(raw: unknown, fallback: UnclusterResult): UnclusterResult {
  if (!raw || typeof raw !== "object") return fallback;
  const obj = raw as Record<string, unknown>;
  const clustersIn = Array.isArray(obj.clusters) ? obj.clusters : [];
  const thoughtsIn = Array.isArray(obj.thoughts) ? obj.thoughts : [];
  const clusters = clustersIn
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const name = asString((c as { name?: unknown }).name).trim();
      if (!name) return null;
      return { name, summary: asString((c as { summary?: unknown }).summary) };
    })
    .filter((c): c is { name: string; summary: string } => Boolean(c));

  const thoughts: UnclusterResult["thoughts"] = [];
  for (const item of thoughtsIn) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const title = asString(rec.title).trim();
    if (!title) continue;
    const kind = KINDS.includes(rec.kind as never) ? (rec.kind as UnclusterResult["thoughts"][number]["kind"]) : "task";
    const horizon = HORIZONS.includes(rec.horizon as never)
      ? (rec.horizon as UnclusterResult["thoughts"][number]["horizon"])
      : "today";
    const energy = ENERGIES.includes(rec.energy as never)
      ? (rec.energy as UnclusterResult["thoughts"][number]["energy"])
      : "medium";
    thoughts.push({
      title,
      body: asString(rec.body),
      kind,
      cluster: asString(rec.cluster, clusters[0]?.name ?? "Inbox"),
      horizon,
      energy,
      durationMin: Math.max(5, Math.min(asNum(rec.durationMin, 25), 240)),
      dueAt: typeof rec.dueAt === "string" && rec.dueAt ? rec.dueAt : null,
      scheduledAt: typeof rec.scheduledAt === "string" && rec.scheduledAt ? rec.scheduledAt : null,
    });
  }

  if (thoughts.length === 0) return fallback;
  const names = new Set(clusters.map((c) => c.name));
  for (const t of thoughts) {
    if (!names.has(t.cluster)) {
      clusters.push({ name: t.cluster, summary: "" });
      names.add(t.cluster);
    }
  }
  return {
    clusters,
    thoughts,
    briefing: asString(obj.briefing) || fallback.briefing,
  };
}

export const unclusterDump = createServerFn({ method: "POST" })
  .validator((input: { dump: string; nowIso: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; result: UnclusterResult; source: "ai" | "local" } | { ok: false; result: UnclusterResult; error: string }> => {
    const local = parseDump(data.dump, new Date(data.nowIso));
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, result: local, source: "local" };
    }
    if (data.dump.trim().length < 8) {
      return { ok: true, result: local, source: "local" };
    }

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.2,
          max_tokens: 1800,
          messages: [
            { role: "system", content: SYSTEM },
            {
              role: "user",
              content: `Current time: ${data.nowIso}\n\nDump:\n${data.dump.slice(0, 6000)}`,
            },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: false, result: local, error: `xAI API error ${res.status}` };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = coerceResult(extractJson(text), local);
      return { ok: true, result: parsed, source: "ai" };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Uncluster failed";
      return { ok: false, result: local, error: message };
    }
  });
