import { addDays, format, isSameDay, isToday, parseISO, startOfDay } from "date-fns";
import type { Horizon, Thought } from "./types";

export function nowIso(): string {
  return new Date().toISOString();
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function atHour(hour: number, minute = 0, dayOffset = 0): Date {
  const d = addDays(new Date(), dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function isoAtHour(hour: number, minute = 0, dayOffset = 0): string {
  return atHour(hour, minute, dayOffset).toISOString();
}

export function weekdayOffset(target: number, now = new Date()): number {
  const current = now.getDay();
  let delta = target - current;
  if (delta <= 0) delta += 7;
  return delta;
}

export function formatTime(iso: string | null): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return "";
  }
}

export function formatDay(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = parseISO(iso);
    if (isToday(d)) return "Today";
    return format(d, "EEE d MMM");
  } catch {
    return "";
  }
}

export function formatDayTime(iso: string | null): string {
  if (!iso) return "";
  const day = formatDay(iso);
  const time = formatTime(iso);
  return time ? `${day} · ${time}` : day;
}

export function isIsoToday(iso: string | null): boolean {
  if (!iso) return false;
  try {
    return isToday(parseISO(iso));
  } catch {
    return false;
  }
}

export function isIsoSameDay(iso: string | null, day: Date): boolean {
  if (!iso) return false;
  try {
    return isSameDay(parseISO(iso), day);
  } catch {
    return false;
  }
}

export function thoughtWhen(t: Thought): Date | null {
  const iso = t.scheduledAt ?? t.dueAt;
  if (!iso) return null;
  try {
    return parseISO(iso);
  } catch {
    return null;
  }
}

export function isDueToday(t: Thought): boolean {
  if (t.horizon === "now" || t.horizon === "today") return true;
  return isIsoToday(t.scheduledAt) || isIsoToday(t.dueAt);
}

export function horizonWeight(h: Horizon): number {
  switch (h) {
    case "now":
      return 4;
    case "today":
      return 3;
    case "week":
      return 2;
    default:
      return 1;
  }
}

export function mindLoad(thoughts: Thought[]): {
  open: number;
  weight: number;
  score: number;
  label: "quiet" | "crowded" | "clustered";
} {
  const openThoughts = thoughts.filter((t) => !t.done);
  const weight = openThoughts.reduce((sum, t) => {
    const dur = Math.min(t.durationMin || 30, 180) / 30;
    return sum + horizonWeight(t.horizon) * (0.6 + dur * 0.4);
  }, 0);
  const score = Math.min(1, weight / 42);
  const label = score > 0.68 ? "clustered" : score > 0.34 ? "crowded" : "quiet";
  return { open: openThoughts.length, weight, score, label };
}

export function durationLabel(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function hourMarks(start: number, end: number): number[] {
  const marks: number[] = [];
  for (let h = start; h <= end; h++) marks.push(h);
  return marks;
}
