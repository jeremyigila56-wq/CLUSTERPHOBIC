import { isToday, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMind } from "@/lib/store";
import { mindLoad } from "@/lib/time";

export function ReviewStage() {
  const thoughts = useMind((s) => s.thoughts);
  const lastBriefing = useMind((s) => s.lastBriefing);
  const clearMind = useMind((s) => s.clearMind);
  const loadSample = useMind((s) => s.loadSample);
  const isSample = useMind((s) => s.isSample);
  const completeThought = useMind((s) => s.completeThought);
  const dumps = useMind((s) => s.dumps);
  const select = useMind((s) => s.select);

  const load = mindLoad(thoughts);
  const clearedToday = thoughts.filter(
    (t) => t.done && t.completedAt && isToday(parseISO(t.completedAt)),
  );
  const stillOpen = thoughts.filter((t) => !t.done);
  const lingering = stillOpen.filter((t) => t.kind === "worry" || t.horizon === "now");

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col overflow-y-auto px-4 py-8 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Review</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">What left, what stayed.</h1>
      {lastBriefing ? <p className="mt-3 text-sm text-muted-foreground">{lastBriefing}</p> : null}

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Stat label="Cleared today" value={String(clearedToday.length)} />
        <Stat label="Still open" value={String(stillOpen.length)} />
        <Stat label="Load" value={load.label} />
      </div>

      <section className="mt-10">
        <h2 className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Still nags</h2>
        <ul className="mt-3 space-y-2">
          {lingering.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nothing is shouting.</li>
          ) : (
            lingering.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="note-card w-full rounded-sm p-3 text-left"
                  onClick={() => select(t.id)}
                >
                  <p className="font-display text-[15px]">{t.title}</p>
                  <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {t.kind} · {t.horizon}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Cleared</h2>
        <ul className="mt-3 space-y-1.5">
          {clearedToday.length === 0 ? (
            <li className="text-sm text-muted-foreground">None yet. Clearing one changes the room.</li>
          ) : (
            clearedToday.map((t) => (
              <li key={t.id} className="text-sm text-muted-foreground line-through">
                {t.title}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">The desk</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {dumps.length} dump{dumps.length === 1 ? "" : "s"} recorded.
          {isSample ? " You’re looking at a sample mind." : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {lingering[0] ? (
            <Button onClick={() => completeThought(lingering[0].id)}>Clear the loudest one</Button>
          ) : null}
          <Button variant="secondary" onClick={() => loadSample()}>
            Load sample mind
          </Button>
          <Button variant="ghost" onClick={() => clearMind()}>
            Empty the desk
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className="font-display mt-2 text-2xl tabular-nums tracking-tight capitalize">{value}</p>
    </div>
  );
}
