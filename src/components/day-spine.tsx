import { format, parseISO } from "date-fns";
import { useMind } from "@/lib/store";
import { durationLabel, hourMarks, isDueToday, isIsoToday } from "@/lib/time";
import type { Thought } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DaySpine() {
  const thoughts = useMind((s) => s.thoughts);
  const clusters = useMind((s) => s.clusters);
  const workStartHour = useMind((s) => s.workStartHour);
  const workEndHour = useMind((s) => s.workEndHour);
  const select = useMind((s) => s.select);
  const selectedId = useMind((s) => s.selectedId);
  const updateThought = useMind((s) => s.updateThought);
  const lastBriefing = useMind((s) => s.lastBriefing);

  const open = thoughts.filter((t) => !t.done);
  const today = open.filter(isDueToday);
  const scheduled = today.filter((t) => t.scheduledAt && isIsoToday(t.scheduledAt));
  const unscheduled = today.filter((t) => !(t.scheduledAt && isIsoToday(t.scheduledAt)));
  const hours = hourMarks(workStartHour, workEndHour);
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const hourH = 72;

  function placeOnHour(thought: Thought, hour: number) {
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    updateThought(thought.id, {
      scheduledAt: d.toISOString(),
      horizon: thought.horizon === "someday" ? "today" : thought.horizon,
      dueAt: thought.dueAt ?? d.toISOString(),
    });
  }

  return (
    <div className="field-canvas relative mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:px-6">
      <div className="field-grain pointer-events-none absolute inset-0" />
      <div className="desk-lamp pointer-events-none absolute inset-0" />
      <aside className="relative z-10 flex w-full shrink-0 flex-col gap-3 sm:w-64">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">Today</p>
          <h1 className="font-display mt-1 text-3xl tracking-tight">{format(now, "EEEE d")}</h1>
          {lastBriefing ? (
            <p className="mt-2 text-sm text-muted-foreground">{lastBriefing}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Drop unscheduled notes onto an hour. One pile at a time.
            </p>
          )}
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-4">
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Unplaced · {unscheduled.length}
          </p>
          {unscheduled.length === 0 ? (
            <p className="text-sm text-muted-foreground">Everything for today has a time.</p>
          ) : (
            unscheduled.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  "note-card w-full rounded-sm p-3 text-left",
                  selectedId === t.id && "ring-1 ring-ember",
                )}
              >
                <p className="font-display text-[15px] leading-snug">{t.title}</p>
                <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                  {clusters.find((c) => c.id === t.clusterId)?.name} · {durationLabel(t.durationMin)}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="relative" style={{ height: hours.length * hourH }}>
          {hours.map((h, i) => (
            <div
              key={h}
              className="spine-hour absolute right-0 left-0 flex"
              style={{ top: i * hourH, height: hourH }}
              onClick={() => {
                if (!selectedId) return;
                const t = thoughts.find((x) => x.id === selectedId);
                if (t) placeOnHour(t, h);
              }}
            >
              <span className="w-14 shrink-0 pt-2 text-xs tabular-nums text-muted-foreground">
                {format(new Date().setHours(h, 0, 0, 0), "h a")}
              </span>
              <div className="flex-1" />
            </div>
          ))}

          {nowH >= workStartHour && nowH <= workEndHour ? (
            <div
              className="pointer-events-none absolute right-0 left-0 z-10 flex items-center"
              style={{ top: (nowH - workStartHour) * hourH }}
            >
              <span className="w-14" />
              <span className="now-line h-px flex-1" />
              <span className="now-line ml-2 size-1.5 rounded-full" />
            </div>
          ) : null}

          {scheduled.map((t) => {
            const d = parseISO(t.scheduledAt!);
            const stamp = d.getHours() + d.getMinutes() / 60;
            const top = (stamp - workStartHour) * hourH + 8;
            const height = Math.max(48, (t.durationMin / 60) * hourH - 8);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  "note-card absolute right-2 left-16 z-[2] overflow-hidden rounded-sm p-2.5 text-left",
                  selectedId === t.id && "ring-1 ring-ember",
                )}
                style={{ top, height }}
              >
                <p className="line-clamp-2 font-display text-sm leading-snug">{t.title}</p>
                <p className="mt-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  {format(d, "h:mm a")} · {durationLabel(t.durationMin)}
                </p>
              </button>
            );
          })}
        </div>
        {selectedId && unscheduled.some((t) => t.id === selectedId) ? (
          <p className="sticky bottom-2 mt-3 text-center text-xs text-muted-foreground">
            Tap an hour to place it.
          </p>
        ) : null}
      </div>
    </div>
  );
}
