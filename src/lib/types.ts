export const KINDS = ["task", "note", "worry", "appointment", "idea"] as const;
export type Kind = (typeof KINDS)[number];

export const HORIZONS = ["now", "today", "week", "someday"] as const;
export type Horizon = (typeof HORIZONS)[number];

export const ENERGIES = ["low", "medium", "high"] as const;
export type Energy = (typeof ENERGIES)[number];

export interface Cluster {
  id: string;
  name: string;
  createdAt: string;
}

export interface Thought {
  id: string;
  title: string;
  body: string;
  kind: Kind;
  clusterId: string;
  horizon: Horizon;
  energy: Energy;
  durationMin: number;
  dueAt: string | null;
  scheduledAt: string | null;
  done: boolean;
  createdAt: string;
  completedAt: string | null;
  dumpId: string | null;
  x: number | null;
  y: number | null;
}

export interface DumpRecord {
  id: string;
  raw: string;
  createdAt: string;
  thoughtCount: number;
  briefing: string;
  source: "local" | "ai";
}

export interface UnclusterThought {
  title: string;
  body: string;
  kind: Kind;
  cluster: string;
  horizon: Horizon;
  energy: Energy;
  durationMin: number;
  dueAt: string | null;
  scheduledAt: string | null;
}

export interface UnclusterResult {
  clusters: { name: string; summary: string }[];
  thoughts: UnclusterThought[];
  briefing: string;
}

export interface MindSnapshot {
  thoughts: Thought[];
  clusters: Cluster[];
  dumps: DumpRecord[];
  selectedId: string | null;
  focusId: string | null;
  focusStartedAt: string | null;
  focusElapsedSec: number;
  lastBriefing: string;
  userCleared: boolean;
  isSample: boolean;
  workStartHour: number;
  workEndHour: number;
}
