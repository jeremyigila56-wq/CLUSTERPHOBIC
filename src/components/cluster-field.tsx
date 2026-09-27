import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Check } from "lucide-react";
import { HORIZON_LABEL, KIND_LABEL, useMind } from "@/lib/store";
import { mindLoad } from "@/lib/time";
import type { Cluster, Thought } from "@/lib/types";
import { clamp, cn, unit } from "@/lib/utils";

const CARD_W = 188;
const CARD_H = 104;

type Pos = { x: number; y: number };

function autoLayout(
  clusters: Cluster[],
  thoughts: Thought[],
  width: number,
  height: number,
  spread = 1,
): Map<string, Pos> {
  const map = new Map<string, Pos>();
  const grouped = clusters
    .map((c) => ({ cluster: c, items: thoughts.filter((t) => t.clusterId === c.id) }))
    .filter((g) => g.items.length > 0);

  const n = Math.max(grouped.length, 1);
  const cx0 = width / 2;
  const cy0 = height / 2;
  const rx = Math.max(width * 0.32, 140) * spread;
  const ry = Math.max(height * 0.3, 110) * spread;

  grouped.forEach((g, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const ccx = n === 1 ? cx0 : cx0 + Math.cos(angle) * rx;
    const ccy = n === 1 ? cy0 : cy0 + Math.sin(angle) * ry;
    g.items.forEach((t, j) => {
      if (t.x != null && t.y != null && spread === 1) {
        map.set(t.id, { x: t.x, y: t.y });
        return;
      }
      const count = g.items.length;
      const a = (j / Math.max(count, 1)) * Math.PI * 2 + unit(t.id, "a") * 0.7;
      const ring = (72 + (j % 3) * 36 + unit(t.id, "r") * 22) * spread;
      const s = count === 1 ? 0 : ring;
      map.set(t.id, {
        x: clamp(ccx + Math.cos(a) * s - CARD_W / 2, 12, width - CARD_W - 12),
        y: clamp(ccy + Math.sin(a) * s - CARD_H / 2, 56, height - CARD_H - 16),
      });
    });
  });
  return map;
}

export function ClusterField() {
  const thoughts = useMind((s) => s.thoughts);
  const clusters = useMind((s) => s.clusters);
  const selectedId = useMind((s) => s.selectedId);
  const landingIds = useMind((s) => s.landingIds);
  const lastBriefing = useMind((s) => s.lastBriefing);
  const select = useMind((s) => s.select);
  const completeThought = useMind((s) => s.completeThought);
  const placeThought = useMind((s) => s.placeThought);
  const moveToCluster = useMind((s) => s.moveToCluster);
  const resetLayout = useMind((s) => s.resetLayout);
  const clearLanding = useMind((s) => s.clearLanding);
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [exhale, setExhale] = useState(false);
  const [folding, setFolding] = useState<Record<string, true>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const drag = useRef<{
    id: string;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);
  const [live, setLive] = useState<Record<string, Pos>>({});
  const load = mindLoad(thoughts);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (landingIds.length === 0) return;
    const id = window.setTimeout(() => clearLanding(), 1400);
    return () => window.clearTimeout(id);
  }, [landingIds, clearLanding]);

  useEffect(() => {
    function down(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing || e.repeat || e.metaKey || e.ctrlKey) return;
      if (e.code === "Space") {
        e.preventDefault();
        setExhale(true);
      }
    }
    function up(e: KeyboardEvent) {
      if (e.code === "Space") setExhale(false);
    }
    function blur() {
      setExhale(false);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  const visible = thoughts.filter((t) => (filter === "all" ? true : !t.done));
  const layout = useMemo(
    () => autoLayout(clusters, visible, size.w, size.h, exhale ? 1.38 : 1),
    [clusters, visible, size.w, size.h, exhale],
  );

  const clusterCenters = useMemo(() => {
    const acc = new Map<string, { x: number; y: number; n: number; name: string }>();
    for (const t of visible) {
      const p = live[t.id] ?? layout.get(t.id);
      if (!p) continue;
      const cur = acc.get(t.clusterId) ?? { x: 0, y: 0, n: 0, name: "" };
      cur.x += p.x + CARD_W / 2;
      cur.y += p.y + CARD_H / 2;
      cur.n += 1;
      cur.name = clusters.find((c) => c.id === t.clusterId)?.name ?? "";
      acc.set(t.clusterId, cur);
    }
    const out = new Map<string, { x: number; y: number; name: string; n: number }>();
    for (const [id, v] of acc) {
      out.set(id, { x: v.x / v.n, y: v.y / v.n, name: v.name, n: v.n });
    }
    return out;
  }, [visible, layout, live, clusters]);

  function onPointerDown(e: PointerEvent, id: string) {
    const p = live[id] ?? layout.get(id);
    if (!p) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      id,
      dx: e.clientX - rect.left - p.x,
      dy: e.clientY - rect.top - p.y,
      moved: false,
    };
  }

  function onPointerMove(e: PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clamp(e.clientX - rect.left - d.dx, 8, size.w - CARD_W - 8);
    const y = clamp(e.clientY - rect.top - d.dy, 8, size.h - CARD_H - 8);
    if (Math.abs(x - (live[d.id]?.x ?? layout.get(d.id)?.x ?? 0)) > 3) d.moved = true;
    setLive((prev) => ({ ...prev, [d.id]: { x, y } }));
  }

  function onPointerUp() {
    const d = drag.current;
    if (!d) return;
    const pos = live[d.id];
    if (d.moved && pos) {
      placeThought(d.id, pos.x, pos.y);
      let nearest: { id: string; dist: number } | null = null;
      for (const [cid, c] of clusterCenters) {
        const dist = Math.hypot(c.x - (pos.x + CARD_W / 2), c.y - (pos.y + CARD_H / 2));
        if (!nearest || dist < nearest.dist) nearest = { id: cid, dist };
      }
      if (nearest && nearest.dist < 140) {
        moveToCluster(d.id, nearest.id);
      }
    } else if (!d.moved) {
      select(d.id);
    }
    drag.current = null;
  }

  function foldAway(id: string) {
    setFolding((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => {
      completeThought(id);
      setFolding((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 480);
  }

  const caption =
    exhale
      ? "Step back. The whole mind."
      : landingIds.length > 0 && lastBriefing
        ? lastBriefing
        : visible.length === 0
          ? "The desk is clear."
          : "Everything on the desk, in piles.";

  return (
    <div className="relative flex h-full min-h-0 flex-col" data-load={load.label} data-exhale={exhale}>
      <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display max-w-xl text-lg text-foreground/90 italic sm:text-xl">{caption}</p>
        <div className="flex items-center gap-1 rounded-full bg-card/80 p-1 shadow-[var(--shadow-border)] backdrop-blur-sm">
          {(["open", "all"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "h-8 rounded-full px-3 text-xs tracking-wide uppercase",
                filter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onPointerDown={() => setExhale(true)}
            onPointerUp={() => setExhale(false)}
            onPointerLeave={() => setExhale(false)}
            className={cn(
              "hidden h-8 rounded-full px-3 text-xs tracking-wide uppercase md:inline",
              exhale ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            Exhale
          </button>
          <button
            type="button"
            onClick={() => {
              setLive({});
              resetLayout();
            }}
            className="hidden h-8 rounded-full px-3 text-xs tracking-wide text-muted-foreground uppercase hover:text-foreground md:inline"
          >
            Spread
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="field-canvas relative hidden min-h-0 flex-1 overflow-hidden md:block"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="field-grain absolute inset-0" />
        <div className="desk-lamp absolute inset-0" />
        <div className="desk-vignette absolute inset-0" />

        <div className={cn("field-stage absolute inset-0", exhale && "is-exhale")}>
          {[...clusterCenters.entries()].map(([id, c]) => (
            <div
              key={`h-${id}`}
              className="cluster-heat absolute"
              style={{
                left: c.x,
                top: c.y,
                width: 140 + c.n * 28,
                height: 140 + c.n * 28,
                opacity: 0.35 + Math.min(c.n, 6) * 0.08,
              }}
            />
          ))}

          <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            {visible.map((t) => {
              const p = live[t.id] ?? layout.get(t.id);
              const c = clusterCenters.get(t.clusterId);
              if (!p || !c) return null;
              return (
                <line
                  key={`l-${t.id}`}
                  x1={p.x + CARD_W / 2}
                  y1={p.y + CARD_H / 2}
                  x2={c.x}
                  y2={c.y}
                  stroke="currentColor"
                  className="text-foreground/10"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {[...clusterCenters.entries()].map(([id, c]) => (
            <div
              key={id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: c.x, top: c.y - 62 }}
            >
              <p className="font-display text-sm tracking-[0.14em] text-muted-foreground uppercase">
                {c.name}
              </p>
            </div>
          ))}

          {visible.map((t) => {
            const p = live[t.id] ?? layout.get(t.id);
            if (!p) return null;
            const rot = (unit(t.id, "rot") - 0.5) * 5.4;
            const delay = unit(t.id, "d") * 2;
            return (
              <NoteCard
                key={t.id}
                thought={t}
                clusterName={clusters.find((c) => c.id === t.clusterId)?.name ?? ""}
                x={p.x}
                y={p.y}
                rot={rot}
                delay={delay}
                selected={selectedId === t.id}
                landing={landingIds.includes(t.id)}
                folding={Boolean(folding[t.id])}
                onPointerDown={(e) => onPointerDown(e, t.id)}
                onSelect={() => select(t.id)}
                onComplete={() => foldAway(t.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-16 pb-4 md:hidden">
        {clusters
          .map((c) => ({ cluster: c, items: visible.filter((t) => t.clusterId === c.id) }))
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.cluster.id}>
              <h2 className="font-display text-sm tracking-[0.14em] text-muted-foreground uppercase">
                {g.cluster.name}
              </h2>
              <ul className="mt-2 space-y-2">
                {g.items.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => select(t.id)}
                      className={cn(
                        "note-card relative w-full rounded-sm p-3 text-left",
                        selectedId === t.id && "ring-1 ring-ember",
                        t.done && "opacity-40",
                      )}
                    >
                      <p className="font-display text-base leading-snug text-paper-ink">{t.title}</p>
                      <p className="mt-1 text-xs tracking-[0.12em] text-paper-muted uppercase">
                        {HORIZON_LABEL[t.horizon]} · {KIND_LABEL[t.kind]}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}

function NoteCard({
  thought,
  clusterName,
  x,
  y,
  rot,
  delay,
  selected,
  landing,
  folding,
  onPointerDown,
  onSelect,
  onComplete,
}: {
  thought: Thought;
  clusterName: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  selected: boolean;
  landing: boolean;
  folding: boolean;
  onPointerDown: (e: PointerEvent) => void;
  onSelect: () => void;
  onComplete: () => void;
}) {
  const ear = unit(thought.id, "ear") > 0.74;
  const stain = unit(thought.id, "stain") > 0.9;
  const warm = unit(thought.id, "warm");
  const tremor = thought.kind === "worry";
  const pulse = thought.horizon === "now";

  return (
    <div
      className={cn(
        "note-card absolute z-[1] cursor-grab touch-none overflow-hidden rounded-sm active:cursor-grabbing",
        selected && "z-20 ring-1 ring-ember",
        folding && "z-30",
        thought.done && "opacity-40",
        thought.horizon === "someday" && "opacity-75",
      )}
      style={{
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        ["--rot" as string]: `${rot}deg`,
        rotate: `${rot}deg`,
        animation: folding
          ? `paper-fold 480ms var(--ease-out) forwards`
          : landing
            ? `paper-land 700ms var(--ease-smooth-out) both`
            : tremor
              ? `paper-tremor 2.8s ease-in-out ${delay}s infinite`
              : pulse
                ? `paper-pulse 3.6s ease-in-out ${delay}s infinite`
                : `float-note 8s ease-in-out ${delay}s infinite`,
        background: `linear-gradient(180deg, color-mix(in oklab, var(--color-paper) ${92 - warm * 8}%, white), color-mix(in oklab, var(--color-paper) ${94 - warm * 6}%, var(--color-ember)))`,
      }}
      onPointerDown={onPointerDown}
    >
      {thought.horizon === "now" ? <span className="ember-edge" /> : null}
      {ear ? <span className="paper-ear" /> : null}
      {stain ? (
        <span className="paper-stain" style={{ right: 18, bottom: 10 }} />
      ) : null}
      <div className="paper-fiber absolute inset-0" />
      <button
        type="button"
        className="absolute inset-0 rounded-sm p-3 pr-10 text-left"
        onClick={onSelect}
      >
        <p className="paper-stamp">
          {KIND_LABEL[thought.kind]}
          {clusterName ? ` · ${clusterName}` : ""}
        </p>
        <p className="font-display mt-1 line-clamp-2 text-[15px] leading-snug text-paper-ink">
          {thought.title}
        </p>
        <p className="mt-2 text-[10px] tracking-[0.14em] text-paper-muted uppercase">
          {HORIZON_LABEL[thought.horizon]}
        </p>
      </button>
      <button
        type="button"
        aria-label={`Clear ${thought.title}`}
        className="absolute top-2.5 right-2 z-10 size-7 rounded-full text-paper-muted hover:bg-accent hover:text-paper-ink"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
      >
        <Check className="mx-auto size-3.5" />
      </button>
    </div>
  );
}
