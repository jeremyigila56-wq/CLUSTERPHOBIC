import type { Cluster, Thought } from "./types";
import { isoAtHour } from "./time";

const CREATED = "2026-09-01T12:00:00.000Z";

export function makeSampleMind(): { clusters: Cluster[]; thoughts: Thought[] } {
  const clusters: Cluster[] = [
    { id: "c-work", name: "Work", createdAt: CREATED },
    { id: "c-home", name: "Home", createdAt: CREATED },
    { id: "c-health", name: "Health", createdAt: CREATED },
    { id: "c-people", name: "People", createdAt: CREATED },
    { id: "c-money", name: "Money", createdAt: CREATED },
  ];

  const thoughts: Thought[] = [
    t("t-deck", "Finish the Q3 deck", "Work", "task", "now", 90, isoAtHour(14), isoAtHour(14), "high"),
    t("t-priya", "Reply to Priya about the timeline", "Work", "task", "now", 15, isoAtHour(11, 30), isoAtHour(11, 30), "low"),
    t("t-sam", "Prep 1:1 with Sam", "Work", "appointment", "today", 30, isoAtHour(16), isoAtHour(16), "medium"),
    t("t-lease", "Review the lease before Friday", "Home", "task", "week", 40, isoAtHour(10, 0, 2), null, "medium"),
    t("t-groceries", "Groceries: milk, eggs, greens", "Home", "task", "today", 35, isoAtHour(18, 30), isoAtHour(18, 30), "low"),
    t("t-tap", "Fix the leaking tap", "Home", "task", "week", 45, null, null, "medium"),
    t("t-walk", "Twenty-minute walk", "Health", "task", "today", 20, isoAtHour(12, 15), isoAtHour(12, 15), "low"),
    t("t-dentist", "Dentist on Thursday", "Health", "appointment", "week", 60, isoAtHour(10, 0, weekdayFromToday(4)), isoAtHour(10, 0, weekdayFromToday(4)), "low"),
    t("t-sleep", "Read that piece on sleep", "Health", "note", "someday", 20, null, null, "low"),
    t("t-mom", "Call mom", "People", "task", "today", 20, isoAtHour(19), isoAtHour(19), "low"),
    t("t-flights", "Book flights for June", "People", "task", "week", 25, null, null, "medium"),
    t("t-taxes", "Am I behind on taxes", "Money", "worry", "week", 40, null, null, "high"),
    t("t-rent", "Pay rent", "Money", "task", "week", 10, isoAtHour(9, 0, 3), null, "low"),
    t("t-inbox", "Inbox to zero, someday", "Work", "idea", "someday", 50, null, null, "high"),
    t("t-shower", "That product idea from the shower", "Work", "idea", "someday", 15, null, null, "low"),
  ];

  return { clusters, thoughts };
}

function weekdayFromToday(target: number): number {
  const current = new Date().getDay();
  let delta = target - current;
  if (delta <= 0) delta += 7;
  return delta;
}

function t(
  id: string,
  title: string,
  clusterName: string,
  kind: Thought["kind"],
  horizon: Thought["horizon"],
  durationMin: number,
  dueAt: string | null,
  scheduledAt: string | null,
  energy: Thought["energy"],
): Thought {
  const clusterId =
    clusterName === "Work"
      ? "c-work"
      : clusterName === "Home"
        ? "c-home"
        : clusterName === "Health"
          ? "c-health"
          : clusterName === "People"
            ? "c-people"
            : "c-money";
  return {
    id,
    title,
    body: "",
    kind,
    clusterId,
    horizon,
    energy,
    durationMin,
    dueAt,
    scheduledAt,
    done: false,
    createdAt: CREATED,
    completedAt: null,
    dumpId: null,
    x: null,
    y: null,
  };
}
