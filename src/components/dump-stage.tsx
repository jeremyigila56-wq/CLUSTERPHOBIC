import { useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMind } from "@/lib/store";
import { nowIso } from "@/lib/time";
import { unclusterDump } from "@/lib/uncluster";

const SAMPLE = `Finish the deck before 2
Call mom tonight
Groceries — milk, eggs, greens
Dentist Thursday morning
Worried I'm behind on taxes
Reply to Priya
That idea from the shower about the quiet desk
Book flights
Walk 20 minutes today`;

export function DumpStage() {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const dumps = useMind((s) => s.dumps);
  const beginTheater = useMind((s) => s.beginTheater);

  async function uncluster() {
    const text = value.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      const res = await unclusterDump({ data: { dump: text, nowIso: nowIso() } });
      beginTheater(text, res.result, res.ok ? res.source : "local");
      setValue("");
    } catch {
      toast("Couldn't reach the uncluster. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field-canvas relative flex h-full min-h-0 flex-col">
      <div className="field-grain absolute inset-0" />
      <div className="desk-lamp absolute inset-0" />
      <div className="desk-vignette absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-4 py-6 sm:px-8">
        <div className="paper-surface paper-page relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm px-8 pt-8 pb-5 sm:px-14 sm:pt-10">
          <div className="paper-fiber absolute inset-0" />
          <p className="relative text-[11px] tracking-[0.22em] text-paper-muted uppercase">Dump</p>
          <h1 className="font-display relative mt-2 text-3xl tracking-tight text-paper-ink sm:text-4xl">
            Don’t sort it. Get it out.
          </h1>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Don’t organize. Just empty it."
            className="font-display relative mt-6 min-h-0 flex-1 resize-none bg-transparent text-xl leading-8 text-paper-ink placeholder:text-paper-muted/70 sm:text-2xl"
            disabled={busy}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void uncluster();
              }
            }}
          />
          <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-paper-ink/10 pt-4">
            <Button onClick={() => void uncluster()} disabled={busy || value.trim().length < 3}>
              {busy ? "Listening…" : "Uncluster this"}
            </Button>
            <Button variant="ghost" type="button" onClick={() => setValue(SAMPLE)} disabled={busy}>
              Try a sample dump
            </Button>
            <p className="text-xs text-paper-muted">The page tears. Notes land on the desk.</p>
          </div>
        </div>

        {dumps.length > 0 ? (
          <div className="relative mt-4 pb-2">
            <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Earlier dumps</p>
            <ul className="mt-2 space-y-1.5">
              {dumps.slice(0, 3).map((d) => (
                <li key={d.id} className="text-sm text-muted-foreground">
                  <span className="tabular-nums text-foreground/70">
                    {format(parseISO(d.createdAt), "MMM d, h:mm a")}
                  </span>
                  {" · "}
                  {d.thoughtCount} pieces
                  {d.briefing ? ` — ${d.briefing}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
