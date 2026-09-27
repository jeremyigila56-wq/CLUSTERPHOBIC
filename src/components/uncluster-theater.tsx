import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMind } from "@/lib/store";
import { unit } from "@/lib/utils";

function sourceLine(raw: string, title: string): string {
  const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const words = title.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  let best = lines[0] ?? title;
  let score = 0;
  for (const line of lines) {
    const l = line.toLowerCase();
    const s = words.filter((w) => l.includes(w)).length;
    if (s > score) {
      score = s;
      best = line;
    }
  }
  return best;
}

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function UnclusterTheater() {
  const theater = useMind((s) => s.theater);
  const commitTheater = useMind((s) => s.commitTheater);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const [showBrief, setShowBrief] = useState(false);
  const done = useRef(false);

  const pieces = useMemo(() => {
    if (!theater) return [];
    return theater.result.thoughts.slice(0, 8).map((t, i) => ({
      title: t.title,
      cluster: t.cluster,
      kind: t.kind,
      line: sourceLine(theater.raw, t.title),
      rot: (unit(`${t.title}:${i}`, "rot") - 0.5) * 10,
      x: 22 + (i % 4) * 19 + unit(`${t.title}`, "x") * 6,
      y: 38 + Math.floor(i / 4) * 28 + unit(`${t.title}`, "y") * 8,
    }));
  }, [theater]);

  function finish() {
    if (done.current) return;
    done.current = true;
    commitTheater();
    void navigate({ to: "/" });
  }

  useEffect(() => {
    done.current = false;
    setVisible(0);
    setShowBrief(false);
    if (!theater) return;
    if (reducedMotion() || theater.result.thoughts.length === 0) {
      finish();
      return;
    }

    const timers: number[] = [];
    pieces.forEach((_, i) => {
      timers.push(window.setTimeout(() => setVisible(i + 1), 280 + i * 210));
    });
    const briefAt = 280 + pieces.length * 210 + 420;
    timers.push(window.setTimeout(() => setShowBrief(true), briefAt));
    timers.push(window.setTimeout(finish, briefAt + 1100));
    return () => timers.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theater]);

  useEffect(() => {
    if (!theater) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        finish();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theater]);

  if (!theater) return null;

  const extra = Math.max(0, theater.result.thoughts.length - pieces.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-background/92"
      role="dialog"
      aria-label="Unclustering"
      aria-live="polite"
    >
      <div className="field-grain absolute inset-0" />
      <div className="desk-lamp absolute inset-0" />
      <div className="desk-vignette absolute inset-0" />

      <div className="relative z-10 flex items-center justify-between px-5 py-4">
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">The page is tearing</p>
        <button
          type="button"
          onClick={finish}
          className="h-9 rounded-full px-3 text-xs tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
        >
          Skip
        </button>
      </div>

      <div className="relative z-10 mx-auto min-h-0 w-full max-w-3xl flex-1 px-4 pb-10">
        <div className="paper-surface paper-page relative h-full min-h-80 overflow-hidden rounded-sm p-8 pt-10 sm:p-12">
          <div className="paper-fiber absolute inset-0" />
          <p className="relative text-[11px] tracking-[0.2em] text-paper-muted uppercase">Dump</p>
          <div className="relative mt-6 font-display text-xl leading-8 text-paper-ink/55 sm:text-2xl">
            {theater.raw.split("\n").slice(0, 12).map((line, i) => {
              const torn = pieces.some((p, idx) => idx < visible && p.line === line.trim());
              return (
                <p
                  key={i}
                  className="transition-all duration-500"
                  style={{
                    opacity: torn ? 0.18 : 1,
                    filter: torn ? "blur(2px)" : "none",
                    transform: torn ? "translateY(-4px)" : "none",
                  }}
                >
                  {line || "\u00a0"}
                </p>
              );
            })}
          </div>
        </div>

        {pieces.map((p, i) =>
          i < visible ? (
            <div
              key={`${p.title}-${i}`}
              className="note-card scrap-fly absolute z-20 w-44 rounded-sm p-3"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                ["--rot" as string]: `${p.rot}deg`,
                rotate: `${p.rot}deg`,
                animation: `scrap-fly 520ms var(--ease-smooth-out) both`,
              }}
            >
              <p className="paper-stamp">{p.kind}</p>
              <p className="font-display mt-1 line-clamp-2 text-sm leading-snug text-paper-ink">{p.title}</p>
              <p className="mt-2 text-[10px] tracking-[0.14em] text-paper-muted uppercase">{p.cluster}</p>
            </div>
          ) : null,
        )}

        {showBrief ? (
          <p className="type-in font-display absolute bottom-4 left-1/2 z-30 w-[min(36rem,90%)] -translate-x-1/2 text-center text-lg text-foreground/90 italic">
            {theater.result.briefing}
            {extra > 0 ? ` · +${extra} more on the desk` : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
