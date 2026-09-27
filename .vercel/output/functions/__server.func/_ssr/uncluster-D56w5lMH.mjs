import { d as parseDump, n as HORIZONS, r as KINDS, t as ENERGIES } from "./types-DmzTiNOd.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/uncluster-D56w5lMH.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM = `You are Clusterphobic, a calm editor for an overcrowded mind.
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
function extractJson(text) {
	const raw = text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("No JSON object");
	return JSON.parse(raw.slice(start, end + 1));
}
function asString(v, fallback = "") {
	return typeof v === "string" ? v : fallback;
}
function asNum(v, fallback) {
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function coerceResult(raw, fallback) {
	if (!raw || typeof raw !== "object") return fallback;
	const obj = raw;
	const clustersIn = Array.isArray(obj.clusters) ? obj.clusters : [];
	const thoughtsIn = Array.isArray(obj.thoughts) ? obj.thoughts : [];
	const clusters = clustersIn.map((c) => {
		if (!c || typeof c !== "object") return null;
		const name = asString(c.name).trim();
		if (!name) return null;
		return {
			name,
			summary: asString(c.summary)
		};
	}).filter((c) => Boolean(c));
	const thoughts = [];
	for (const item of thoughtsIn) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const title = asString(rec.title).trim();
		if (!title) continue;
		const kind = KINDS.includes(rec.kind) ? rec.kind : "task";
		const horizon = HORIZONS.includes(rec.horizon) ? rec.horizon : "today";
		const energy = ENERGIES.includes(rec.energy) ? rec.energy : "medium";
		thoughts.push({
			title,
			body: asString(rec.body),
			kind,
			cluster: asString(rec.cluster, clusters[0]?.name ?? "Inbox"),
			horizon,
			energy,
			durationMin: Math.max(5, Math.min(asNum(rec.durationMin, 25), 240)),
			dueAt: typeof rec.dueAt === "string" && rec.dueAt ? rec.dueAt : null,
			scheduledAt: typeof rec.scheduledAt === "string" && rec.scheduledAt ? rec.scheduledAt : null
		});
	}
	if (thoughts.length === 0) return fallback;
	const names = new Set(clusters.map((c) => c.name));
	for (const t of thoughts) if (!names.has(t.cluster)) {
		clusters.push({
			name: t.cluster,
			summary: ""
		});
		names.add(t.cluster);
	}
	return {
		clusters,
		thoughts,
		briefing: asString(obj.briefing) || fallback.briefing
	};
}
var unclusterDump_createServerFn_handler = createServerRpc({
	id: "ee0d33118314e4fce8ff78c397c37c2fab18f3eb51e1b86fc6344ed6dc0d750e",
	name: "unclusterDump",
	filename: "src/lib/uncluster.ts"
}, (opts) => unclusterDump.__executeServer(opts));
var unclusterDump = createServerFn({ method: "POST" }).validator((input) => input).handler(unclusterDump_createServerFn_handler, async ({ data }) => {
	const local = parseDump(data.dump, new Date(data.nowIso));
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		result: local,
		source: "local"
	};
	if (data.dump.trim().length < 8) return {
		ok: true,
		result: local,
		source: "local"
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .2,
				max_tokens: 1800,
				messages: [{
					role: "system",
					content: SYSTEM
				}, {
					role: "user",
					content: `Current time: ${data.nowIso}\n\nDump:\n${data.dump.slice(0, 6e3)}`
				}]
			})
		});
		if (!res.ok) return {
			ok: false,
			result: local,
			error: `xAI API error ${res.status}`
		};
		return {
			ok: true,
			result: coerceResult(extractJson((await res.json()).choices?.[0]?.message?.content ?? ""), local),
			source: "ai"
		};
	} catch (err) {
		return {
			ok: false,
			result: local,
			error: err instanceof Error ? err.message : "Uncluster failed"
		};
	}
});
//#endregion
export { unclusterDump_createServerFn_handler };
