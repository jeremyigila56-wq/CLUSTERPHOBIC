import { c as isoAtHour, d as parseDump, o as isDueToday, u as nowIso } from "./types-DmzTiNOd.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-VouiM2Md.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function hash32(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function unit(s, salt = "") {
	return hash32(`${s}:${salt}`) / 4294967295;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
var CREATED = "2026-09-01T12:00:00.000Z";
function makeSampleMind() {
	return {
		clusters: [
			{
				id: "c-work",
				name: "Work",
				createdAt: CREATED
			},
			{
				id: "c-home",
				name: "Home",
				createdAt: CREATED
			},
			{
				id: "c-health",
				name: "Health",
				createdAt: CREATED
			},
			{
				id: "c-people",
				name: "People",
				createdAt: CREATED
			},
			{
				id: "c-money",
				name: "Money",
				createdAt: CREATED
			}
		],
		thoughts: [
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
			t("t-shower", "That product idea from the shower", "Work", "idea", "someday", 15, null, null, "low")
		]
	};
}
function weekdayFromToday(target) {
	let delta = target - (/* @__PURE__ */ new Date()).getDay();
	if (delta <= 0) delta += 7;
	return delta;
}
function t(id, title, clusterName, kind, horizon, durationMin, dueAt, scheduledAt, energy) {
	return {
		id,
		title,
		body: "",
		kind,
		clusterId: clusterName === "Work" ? "c-work" : clusterName === "Home" ? "c-home" : clusterName === "Health" ? "c-health" : clusterName === "People" ? "c-people" : "c-money",
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
		y: null
	};
}
var INBOX = "Inbox";
function ensureInbox(clusters) {
	if (clusters.some((c) => c.name.toLowerCase() === INBOX.toLowerCase())) return clusters;
	return [{
		id: uid(),
		name: INBOX,
		createdAt: nowIso()
	}, ...clusters];
}
function findOrCreateCluster(clusters, name) {
	const trimmed = name.trim() || INBOX;
	const existing = clusters.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
	if (existing) return {
		clusters,
		id: existing.id
	};
	const created = {
		id: uid(),
		name: trimmed,
		createdAt: nowIso()
	};
	return {
		clusters: [...clusters, created],
		id: created.id
	};
}
function thoughtFromParsed(item, clusterId, dumpId) {
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
		y: null
	};
}
var empty = {
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
	workEndHour: 21
};
function sampleSnapshot() {
	const sample = makeSampleMind();
	return {
		...empty,
		clusters: sample.clusters,
		thoughts: sample.thoughts,
		isSample: true,
		lastBriefing: "A crowded Tuesday. Uncluster what you can, then take the 2pm deck."
	};
}
var useMind = create()(persist((set, get) => ({
	...sampleSnapshot(),
	capture: (text) => {
		const raw = text.trim();
		if (!raw) return "";
		if (raw.length > 140 || raw.includes("\n")) {
			const parsed = parseDump(raw);
			return get().ingestUncluster(raw, parsed, "local");
		}
		let clusters = ensureInbox(get().clusters);
		const found = findOrCreateCluster(clusters, INBOX);
		clusters = found.clusters;
		const thought = {
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
			y: null
		};
		set({
			clusters,
			thoughts: [thought, ...get().thoughts],
			selectedId: thought.id,
			isSample: false
		});
		return thought.id;
	},
	ingestUncluster: (raw, result, source) => {
		const dumpId = uid();
		const replacing = get().isSample;
		let clusters = replacing ? [] : ensureInbox(get().clusters);
		const newThoughts = [];
		for (const item of result.thoughts) {
			const found = findOrCreateCluster(clusters, item.cluster);
			clusters = found.clusters;
			newThoughts.push(thoughtFromParsed(item, found.id, dumpId));
		}
		clusters = ensureInbox(clusters);
		const dump = {
			id: dumpId,
			raw,
			createdAt: nowIso(),
			thoughtCount: newThoughts.length,
			briefing: result.briefing,
			source
		};
		set({
			clusters,
			thoughts: replacing ? newThoughts : [...newThoughts, ...get().thoughts],
			dumps: replacing ? [dump] : [dump, ...get().dumps].slice(0, 40),
			lastBriefing: result.briefing,
			isSample: false,
			selectedId: newThoughts[0]?.id ?? get().selectedId
		});
		return dumpId;
	},
	updateThought: (id, patch) => {
		set({ thoughts: get().thoughts.map((t) => t.id === id ? {
			...t,
			...patch,
			id: t.id
		} : t) });
	},
	completeThought: (id) => {
		set({
			thoughts: get().thoughts.map((t) => t.id === id ? {
				...t,
				done: true,
				completedAt: nowIso()
			} : t),
			focusId: get().focusId === id ? null : get().focusId
		});
	},
	reopenThought: (id) => {
		set({ thoughts: get().thoughts.map((t) => t.id === id ? {
			...t,
			done: false,
			completedAt: null
		} : t) });
	},
	deleteThought: (id) => {
		set({
			thoughts: get().thoughts.filter((t) => t.id !== id),
			selectedId: get().selectedId === id ? null : get().selectedId,
			focusId: get().focusId === id ? null : get().focusId
		});
	},
	select: (id) => set({ selectedId: id }),
	setFocus: (id) => set({
		focusId: id,
		focusStartedAt: id ? nowIso() : null,
		focusElapsedSec: 0
	}),
	tickFocus: (sec) => set({ focusElapsedSec: sec }),
	addCluster: (name) => {
		const found = findOrCreateCluster(get().clusters, name);
		set({
			clusters: found.clusters,
			isSample: false
		});
		return found.id;
	},
	renameCluster: (id, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		set({ clusters: get().clusters.map((c) => c.id === id ? {
			...c,
			name: trimmed
		} : c) });
	},
	moveToCluster: (thoughtId, clusterId) => {
		set({ thoughts: get().thoughts.map((t) => t.id === thoughtId ? {
			...t,
			clusterId
		} : t) });
	},
	placeThought: (id, x, y) => {
		set({ thoughts: get().thoughts.map((t) => t.id === id ? {
			...t,
			x,
			y
		} : t) });
	},
	resetLayout: () => {
		set({ thoughts: get().thoughts.map((t) => ({
			...t,
			x: null,
			y: null
		})) });
	},
	loadSample: () => {
		const sample = makeSampleMind();
		set({
			...empty,
			clusters: sample.clusters,
			thoughts: sample.thoughts,
			isSample: true,
			lastBriefing: "A crowded Tuesday. Uncluster what you can, then take the 2pm deck."
		});
	},
	clearMind: () => {
		set({
			...empty,
			userCleared: true,
			clusters: [{
				id: uid(),
				name: INBOX,
				createdAt: nowIso()
			}]
		});
	},
	setWorkHours: (start, end) => set({
		workStartHour: start,
		workEndHour: end
	})
}), {
	name: "clusterphobic-mind",
	skipHydration: true,
	version: 2,
	migrate: (persisted) => {
		const data = persisted;
		if (!data || !Array.isArray(data.thoughts) || data.thoughts.length === 0 && !data.userCleared) return sampleSnapshot();
		return data;
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
		workEndHour: s.workEndHour
	})
}));
function hydrateMind() {
	const persistApi = useMind.persist;
	persistApi.rehydrate();
	const finish = persistApi.onFinishHydration(() => {
		const s = useMind.getState();
		if (s.thoughts.length === 0 && s.clusters.length === 0 && !s.userCleared) s.loadSample();
	});
	if (persistApi.hasHydrated()) {
		const s = useMind.getState();
		if (s.thoughts.length === 0 && s.clusters.length === 0 && !s.userCleared) s.loadSample();
	}
	return finish;
}
function pickNextFocus(thoughts) {
	const open = thoughts.filter((t) => !t.done);
	const rank = (t) => {
		const nowBoost = t.horizon === "now" ? 0 : t.horizon === "today" ? 10 : t.horizon === "week" ? 20 : 30;
		const dueBoost = isDueToday(t) ? 0 : 8;
		const energyBoost = t.energy === "high" ? 0 : t.energy === "medium" ? 1 : 2;
		return nowBoost + dueBoost + energyBoost;
	};
	return [...open].sort((a, b) => rank(a) - rank(b) || a.createdAt.localeCompare(b.createdAt))[0];
}
var KIND_LABEL = {
	task: "Task",
	note: "Note",
	worry: "Worry",
	appointment: "Appointment",
	idea: "Idea"
};
var HORIZON_LABEL = {
	now: "Now",
	today: "Today",
	week: "This week",
	someday: "Someday"
};
var ENERGY_LABEL = {
	low: "Low energy",
	medium: "Medium",
	high: "Deep work"
};
//#endregion
export { cn as a, unit as c, clamp as i, useMind as l, HORIZON_LABEL as n, hydrateMind as o, KIND_LABEL as r, pickNextFocus as s, ENERGY_LABEL as t };
