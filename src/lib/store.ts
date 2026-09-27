import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseDump } from "./parser";
import { makeSampleMind } from "./seed";
import { isDueToday, nowIso } from "./time";
import type {
  Cluster,
  DumpRecord,
  Energy,
  Horizon,
  Kind,
  MindSnapshot,
  Thought,
  UnclusterResult,
} from "./types";
import { uid } from "./utils";

const INBOX = "Inbox";

export interface TheaterPayload {
  raw: string;
  result: UnclusterResult;
  source: "local" | "ai";
}

export interface MindState extends MindSnapshot {
  theater: TheaterPayload | null;
  landingIds: string[];
  capture: (text: string) => string;
  ingestUncluster: (raw: string, result: UnclusterResult, source: "local" | "ai") => string;
  beginTheater: (raw: string, result: UnclusterResult, source: "local" | "ai") => void;
  commitTheater: () => void;
  updateThought: (id: string, patch: Partial<Thought>) => void;
  completeThought: (id: string) => void;
  reopenThought: (id: string) => void;
  deleteThought: (id: string) => void;
  select: (id: string | null) => void;
  setFocus: (id: string | null) => void;
  tickFocus: (sec: number) => void;
  addCluster: (name: string) => string;
  renameCluster: (id: string, name: string) => void;
  moveToCluster: (thoughtId: string, clusterId: string) => void;
  placeThought: (id: string, x: number, y: number) => void;
  resetLayout: () => void;
  loadSample: () => void;
  clearMind: () => void;
  setWorkHours: (start: number, end: number) => void;
  clearLanding: () => void;
}

function ensureInbox(clusters: Cluster[]): Cluster[] {
  if (clusters.some((c) => c.name.toLowerCase() === INBOX.toLowerCase())) return clusters;
  return [{ id: uid(), name: INBOX, createdAt: nowIso() }, ...clusters];
}

function findOrCreateCluster(clusters: Cluster[], name: string): { clusters: Cluster[]; id: string } {
  const trimmed = name.trim() || INBOX;
  const existing = clusters.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return { clusters, id: existing.id };
  const created: Cluster = { id: uid(), name: trimmed, createdAt: nowIso() };
  return { clusters: [...clusters, created], id: created.id };
}

function thoughtFromParsed(
  item: UnclusterResult["thoughts"][number],
  clusterId: string,
  dumpId: string,
): Thought {
  return {
    id: uid(),
    title: item.title.trim() || "Untitled",
    body: item.body ?? "",
    kind: item.kind,
    clusterId,
    horizon: item.horizon,
    energy: item.energy,
    durationMin: Math.max(5, Math.min(item.durationMin || 25, 240)),
    dueAt: item.dueAt,
    scheduledAt: item.scheduledAt,
    done: false,
    createdAt: nowIso(),
    completedAt: null,
    dumpId,
    x: null,
    y: null,
  };
}

const empty: MindSnapshot = {
  thoughts: [],
  clusters: [],
  dumps: [],
  selectedId: null,
  focusId: null,
  focusStartedAt: null,
  focusElapsedSec: 0,
  lastBriefing: "",
  userCleared: false,
  isSample: false,
  workStartHour: 7,
  workEndHour: 21,
};

function sampleSnapshot(): MindSnapshot {
  const sample = makeSampleMind();
  return {
    ...empty,
    clusters: sample.clusters,
    thoughts: sample.thoughts,
    isSample: true,
    lastBriefing: "A crowded Tuesday. Uncluster what you can, then take the 2pm deck.",
  };
}

export const useMind = create<MindState>()(
  persist(
    (set, get) => ({
      ...sampleSnapshot(),
      theater: null,
      landingIds: [],

      capture: (text) => {
        const raw = text.trim();
        if (!raw) return "";
        if (raw.length > 140 || raw.includes("\n")) {
          const parsed = parseDump(raw);
          get().beginTheater(raw, parsed, "local");
          return "";
        }
        let clusters = ensureInbox(get().clusters);
        const found = findOrCreateCluster(clusters, INBOX);
        clusters = found.clusters;
        const thought: Thought = {
          id: uid(),
          title: raw.charAt(0).toUpperCase() + raw.slice(1),
          body: "",
          kind: "task",
          clusterId: found.id,
          horizon: "today",
          energy: "medium",
          durationMin: 25,
          dueAt: null,
          scheduledAt: null,
          done: false,
          createdAt: nowIso(),
          completedAt: null,
          dumpId: null,
          x: null,
          y: null,
        };
        set({
          clusters,
          thoughts: [thought, ...get().thoughts],
          landingIds: [thought.id],
          isSample: false,
        });
        return thought.id;
      },

      ingestUncluster: (raw, result, source) => {
        const dumpId = uid();
        const replacing = get().isSample;
        let clusters = replacing ? [] : ensureInbox(get().clusters);
        const newThoughts: Thought[] = [];
        for (const item of result.thoughts) {
          const found = findOrCreateCluster(clusters, item.cluster);
          clusters = found.clusters;
          newThoughts.push(thoughtFromParsed(item, found.id, dumpId));
        }
        clusters = ensureInbox(clusters);
        const dump: DumpRecord = {
          id: dumpId,
          raw,
          createdAt: nowIso(),
          thoughtCount: newThoughts.length,
          briefing: result.briefing,
          source,
        };
        set({
          clusters,
          thoughts: replacing ? newThoughts : [...newThoughts, ...get().thoughts],
          dumps: replacing ? [dump] : [dump, ...get().dumps].slice(0, 40),
          lastBriefing: result.briefing,
          isSample: false,
          selectedId: null,
          landingIds: newThoughts.map((t) => t.id),
          theater: null,
        });
        return dumpId;
      },

      beginTheater: (raw, result, source) => {
        set({ theater: { raw, result, source } });
      },

      commitTheater: () => {
        const theater = get().theater;
        if (!theater) return;
        get().ingestUncluster(theater.raw, theater.result, theater.source);
      },

      updateThought: (id, patch) => {
        set({
          thoughts: get().thoughts.map((t) => (t.id === id ? { ...t, ...patch, id: t.id } : t)),
        });
      },

      completeThought: (id) => {
        set({
          thoughts: get().thoughts.map((t) =>
            t.id === id ? { ...t, done: true, completedAt: nowIso() } : t,
          ),
          focusId: get().focusId === id ? null : get().focusId,
        });
      },

      reopenThought: (id) => {
        set({
          thoughts: get().thoughts.map((t) =>
            t.id === id ? { ...t, done: false, completedAt: null } : t,
          ),
        });
      },

      deleteThought: (id) => {
        set({
          thoughts: get().thoughts.filter((t) => t.id !== id),
          selectedId: get().selectedId === id ? null : get().selectedId,
          focusId: get().focusId === id ? null : get().focusId,
        });
      },

      select: (id) => set({ selectedId: id }),

      setFocus: (id) =>
        set({
          focusId: id,
          focusStartedAt: id ? nowIso() : null,
          focusElapsedSec: 0,
        }),

      tickFocus: (sec) => set({ focusElapsedSec: sec }),

      addCluster: (name) => {
        const found = findOrCreateCluster(get().clusters, name);
        set({ clusters: found.clusters, isSample: false });
        return found.id;
      },

      renameCluster: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set({
          clusters: get().clusters.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
        });
      },

      moveToCluster: (thoughtId, clusterId) => {
        set({
          thoughts: get().thoughts.map((t) => (t.id === thoughtId ? { ...t, clusterId } : t)),
        });
      },

      placeThought: (id, x, y) => {
        set({
          thoughts: get().thoughts.map((t) => (t.id === id ? { ...t, x, y } : t)),
        });
      },

      resetLayout: () => {
        set({
          thoughts: get().thoughts.map((t) => ({ ...t, x: null, y: null })),
        });
      },

      loadSample: () => {
        const sample = makeSampleMind();
        set({
          ...empty,
          clusters: sample.clusters,
          thoughts: sample.thoughts,
          isSample: true,
          theater: null,
          landingIds: [],
          lastBriefing: "A crowded Tuesday. Uncluster what you can, then take the 2pm deck.",
        });
      },

      clearMind: () => {
        set({
          ...empty,
          userCleared: true,
          theater: null,
          landingIds: [],
          clusters: [{ id: uid(), name: INBOX, createdAt: nowIso() }],
        });
      },

      setWorkHours: (start, end) => set({ workStartHour: start, workEndHour: end }),

      clearLanding: () => set({ landingIds: [] }),
    }),
    {
      name: "clusterphobic-mind",
      skipHydration: true,
      version: 2,
      migrate: (persisted) => {
        const data = persisted as Partial<MindSnapshot> | undefined;
        if (!data || !Array.isArray(data.thoughts) || (data.thoughts.length === 0 && !data.userCleared)) {
          return sampleSnapshot();
        }
        return data as MindSnapshot;
      },
      partialize: (s) => ({
        thoughts: s.thoughts,
        clusters: s.clusters,
        dumps: s.dumps,
        selectedId: s.selectedId,
        focusId: s.focusId,
        focusStartedAt: s.focusStartedAt,
        focusElapsedSec: s.focusElapsedSec,
        lastBriefing: s.lastBriefing,
        userCleared: s.userCleared,
        isSample: s.isSample,
        workStartHour: s.workStartHour,
        workEndHour: s.workEndHour,
      }),
    },
  ),
);

export function hydrateMind(): () => void {
  const persistApi = useMind.persist;
  void persistApi.rehydrate();
  const finish = persistApi.onFinishHydration(() => {
    const s = useMind.getState();
    if (s.thoughts.length === 0 && s.clusters.length === 0 && !s.userCleared) {
      s.loadSample();
    }
  });
  if (persistApi.hasHydrated()) {
    const s = useMind.getState();
    if (s.thoughts.length === 0 && s.clusters.length === 0 && !s.userCleared) {
      s.loadSample();
    }
  }
  return finish;
}

export function pickNextFocus(thoughts: Thought[]): Thought | undefined {
  const open = thoughts.filter((t) => !t.done);
  const rank = (t: Thought) => {
    const nowBoost = t.horizon === "now" ? 0 : t.horizon === "today" ? 10 : t.horizon === "week" ? 20 : 30;
    const dueBoost = isDueToday(t) ? 0 : 8;
    const energyBoost = t.energy === "high" ? 0 : t.energy === "medium" ? 1 : 2;
    return nowBoost + dueBoost + energyBoost;
  };
  return [...open].sort((a, b) => rank(a) - rank(b) || a.createdAt.localeCompare(b.createdAt))[0];
}

export const KIND_LABEL: Record<Kind, string> = {
  task: "Task",
  note: "Note",
  worry: "Worry",
  appointment: "Appointment",
  idea: "Idea",
};

export const HORIZON_LABEL: Record<Horizon, string> = {
  now: "Now",
  today: "Today",
  week: "This week",
  someday: "Someday",
};

export const ENERGY_LABEL: Record<Energy, string> = {
  low: "Low energy",
  medium: "Medium",
  high: "Deep work",
};
