import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ENERGY_LABEL, HORIZON_LABEL, pickNextFocus, useMind } from "@/lib/store";
import { durationLabel } from "@/lib/time";

export function FocusStage() {
  const thoughts = useMind((s) => s.thoughts);
  const clusters = useMind((s) => s.clusters);
  const focusId = useMind((s) => s.focusId);
  const elapsed = useMind((s) => s.focusElapsedSec);
  const setFocus = useMind((s) => s.setFocus);
  const tickFocus = useMind((s) => s.tickFocus);
  const completeThought = useMind((s) => s.completeThought);
  const updateThought = useMind((s) => s.updateThought);
  const navigate = useNavigate();

  const current = thoughts.find((t) => t.id === focusId && !t.done) ?? pickNextFocus(thoughts);

  useEffect(() => {
    if (current && current.id !== focusId) setFocus(current.id);
  }, [current, focusId, setFocus]);

  useEffect(() => {
    if (!current) return;
    const started = Date.now() - elapsed * 1000;
    const id = window.setInterval(() => {
      tickFocus(Math.floor((Date.now() - started) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="focus-cone absolute inset-0" />
        <p className="relative text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Focus</p>
        <h1 className="font-display relative mt-3 max-w-md text-4xl tracking-tight">Nothing is crowding you.</h1>
        <p className="relative mt-3 max-w-sm text-sm text-muted-foreground">
          Dump something, or go back to the desk.
        </p>
        <Button className="relative mt-6" onClick={() => void navigate({ to: "/dump" })}>
          Empty your head
        </Button>
      </div>
    );
  }

  const cluster = clusters.find((c) => c.id === current.clusterId);
  const remaining = Math.max(0, current.durationMin * 60 - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = Math.min(1, elapsed / Math.max(current.durationMin * 60, 1));

  return (
    <div className="relative flex h-full flex-col">
      <div className="field-grain absolute inset-0 opacity-40" />
      <div className="focus-cone absolute inset-0" />
      <div className="relative mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-6 py-10">
        <p className="text-[11px] tracking-[0.22em] text-ember uppercase">This, only this</p>
        <h1 className="font-display mt-5 text-4xl leading-[1.15] tracking-tight text-foreground sm:text-6xl">
          {current.title}
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {cluster?.name} · {HORIZON_LABEL[current.horizon]} · {ENERGY_LABEL[current.energy]} ·{" "}
          {durationLabel(current.durationMin)}
        </p>
        {current.body ? <p className="mt-4 max-w-lg text-base text-foreground/70">{current.body}</p> : null}

        <div className="mt-14">
          <p className="font-display text-6xl tabular-nums tracking-tight text-foreground/90">
            {mm}:{ss}
          </p>
          <div className="mt-5 h-px w-full bg-border">
            <div className="now-line h-px" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              completeThought(current.id);
              const next = pickNextFocus(useMind.getState().thoughts);
              setFocus(next?.id ?? null);
            }}
          >
            Clear it
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              updateThought(current.id, { horizon: "week" });
              const rest = useMind.getState().thoughts.filter((t) => t.id !== current.id);
              const next = pickNextFocus(rest);
              setFocus(next?.id ?? null);
            }}
          >
            Not now
          </Button>
          <Button variant="ghost" onClick={() => void navigate({ to: "/" })}>
            Back to the desk
          </Button>
        </div>
      </div>
    </div>
  );
}
