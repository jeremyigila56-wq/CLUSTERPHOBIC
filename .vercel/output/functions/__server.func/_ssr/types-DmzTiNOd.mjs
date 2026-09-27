import { i as isToday, n as setHours, o as addHours, r as parseISO, s as addDays, t as setMinutes } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/types-DmzTiNOd.js
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function atHour(hour, minute = 0, dayOffset = 0) {
	const d = addDays(/* @__PURE__ */ new Date(), dayOffset);
	d.setHours(hour, minute, 0, 0);
	return d;
}
function isoAtHour(hour, minute = 0, dayOffset = 0) {
	return atHour(hour, minute, dayOffset).toISOString();
}
function weekdayOffset(target, now = /* @__PURE__ */ new Date()) {
	let delta = target - now.getDay();
	if (delta <= 0) delta += 7;
	return delta;
}
function isIsoToday(iso) {
	if (!iso) return false;
	try {
		return isToday(parseISO(iso));
	} catch {
		return false;
	}
}
function isDueToday(t) {
	if (t.horizon === "now" || t.horizon === "today") return true;
	return isIsoToday(t.scheduledAt) || isIsoToday(t.dueAt);
}
function horizonWeight(h) {
	switch (h) {
		case "now": return 4;
		case "today": return 3;
		case "week": return 2;
		default: return 1;
	}
}
function mindLoad(thoughts) {
	const openThoughts = thoughts.filter((t) => !t.done);
	const weight = openThoughts.reduce((sum, t) => {
		const dur = Math.min(t.durationMin || 30, 180) / 30;
		return sum + horizonWeight(t.horizon) * (.6 + dur * .4);
	}, 0);
	const score = Math.min(1, weight / 42);
	const label = score > .68 ? "clustered" : score > .34 ? "crowded" : "quiet";
	return {
		open: openThoughts.length,
		weight,
		score,
		label
	};
}
function durationLabel(min) {
	if (min < 60) return `${min}m`;
	const h = Math.floor(min / 60);
	const m = min % 60;
	return m ? `${h}h ${m}m` : `${h}h`;
}
function hourMarks(start, end) {
	const marks = [];
	for (let h = start; h <= end; h++) marks.push(h);
	return marks;
}
var WEEKDAYS = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
	sun: 0,
	mon: 1,
	tue: 2,
	tues: 2,
	wed: 3,
	thu: 4,
	thur: 4,
	thurs: 4,
	fri: 5,
	sat: 6
};
var BUCKETS = [
	{
		name: "Work",
		keys: [
			"email",
			"deck",
			"meeting",
			"slack",
			"client",
			"deadline",
			"presentation",
			"code",
			"review",
			"1:1",
			"standup",
			"deploy",
			"doc",
			"inbox",
			"report",
			"slides",
			"pitch",
			"boss",
			"office",
			"sprint"
		]
	},
	{
		name: "Home",
		keys: [
			"grocery",
			"groceries",
			"laundry",
			"clean",
			"dishes",
			"rent",
			"lease",
			"tap",
			"repair",
			"cook",
			"trash",
			"kitchen",
			"apartment",
			"house",
			"plants",
			"mail"
		]
	},
	{
		name: "Health",
		keys: [
			"gym",
			"walk",
			"dentist",
			"doctor",
			"sleep",
			"meds",
			"run",
			"yoga",
			"therapy",
			"stretch",
			"water",
			"appointment",
			"physio"
		]
	},
	{
		name: "People",
		keys: [
			"mom",
			"dad",
			"call",
			"text",
			"birthday",
			"friend",
			"family",
			"sister",
			"brother",
			"partner",
			"dinner",
			"lunch with"
		]
	},
	{
		name: "Money",
		keys: [
			"tax",
			"taxes",
			"pay",
			"bank",
			"invoice",
			"budget",
			"bill",
			"rent",
			"insurance"
		]
	}
];
function chunkDump(raw) {
	const trimmed = raw.replace(/\r/g, "").trim();
	if (!trimmed) return [];
	const lines = trimmed.split(/\n+/).map((line) => line.replace(/^\s*(?:[-*•]+|\d+[.)])\s*/, "").trim()).filter(Boolean);
	const chunks = [];
	for (const line of lines) if (line.length > 140 && /[.;] /.test(line)) for (const part of line.split(/(?<=[.;])\s+/)) {
		const p = part.replace(/^[.;]\s*/, "").trim();
		if (p.length > 2) chunks.push(p);
	}
	else chunks.push(line);
	if (chunks.length === 1 && chunks[0].length > 70) {
		const parts = chunks[0].split(/\s*(?:,\s+and\s+|;\s+|(?<=\S)\.\s+(?=[A-Z])|,\s+(?=[A-Z]))\s*/).map((s) => s.trim()).filter((s) => s.length > 2);
		if (parts.length > 1) return parts;
	}
	return chunks;
}
function detectKind(text) {
	const t = text.toLowerCase();
	if (/\b(worried|worry|anxious|afraid|stressed|overwhelmed|dread)\b/.test(t)) return "worry";
	if (/\b(idea|maybe|what if|wonder|could try|brainstorm)\b/.test(t)) return "idea";
	if (/\b(remember|note to self|just a note|fyi)\b/.test(t)) return "note";
	if (/\b(meeting|appointment|call with|dentist|doctor|interview|1:1|lunch with)\b/.test(t)) return "appointment";
	return "task";
}
function detectEnergy(text, kind) {
	const t = text.toLowerCase();
	if (/\b(deep|focus|write|deck|code|hard|difficult)\b/.test(t)) return "high";
	if (kind === "worry" || /\b(email|call|text|quick|tidy|sort)\b/.test(t)) return "low";
	return "medium";
}
function detectDuration(text, kind) {
	const t = text.toLowerCase();
	const hour = t.match(/\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/);
	if (hour) return Math.round(parseFloat(hour[1]) * 60);
	const min = t.match(/\b(\d+)\s*(?:minutes?|mins?|m)\b/);
	if (min) return parseInt(min[1], 10);
	if (kind === "appointment") return 45;
	if (kind === "note" || kind === "idea") return 10;
	if (kind === "worry") return 15;
	if (/\b(email|text|call|reply)\b/.test(t)) return 15;
	if (/\b(deck|presentation|write|review)\b/.test(t)) return 60;
	return 25;
}
function applyClock(date, hour, minute, pm) {
	let h = hour;
	if (pm === true && h < 12) h += 12;
	if (pm === false && h === 12) h = 0;
	return setMinutes(setHours(date, h), minute);
}
function detectWhen(text, now) {
	const t = text.toLowerCase();
	let day = new Date(now);
	let hasDay = false;
	let horizon = "today";
	if (/\b(now|asap|immediately|right now)\b/.test(t)) return {
		dueAt: now.toISOString(),
		scheduledAt: now.toISOString(),
		horizon: "now"
	};
	if (/\b(someday|eventually|later on|one day|whenever)\b/.test(t)) return {
		dueAt: null,
		scheduledAt: null,
		horizon: "someday"
	};
	if (/\btomorrow\b/.test(t)) {
		day = addDays(now, 1);
		hasDay = true;
		horizon = "today";
	} else if (/\btoday|tonight|this morning|this afternoon|this evening\b/.test(t)) {
		hasDay = true;
		horizon = "now";
	} else if (/\bnext week\b/.test(t)) {
		day = addDays(now, 7);
		hasDay = true;
		horizon = "week";
	} else {
		const wd = t.match(/\b(?:next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)\b/);
		if (wd) {
			day = addDays(now, weekdayOffset(WEEKDAYS[wd[1]], now));
			hasDay = true;
			horizon = "week";
		}
	}
	const inDays = t.match(/\bin\s+(\d+)\s+days?\b/);
	if (inDays) {
		day = addDays(now, parseInt(inDays[1], 10));
		hasDay = true;
		horizon = parseInt(inDays[1], 10) <= 1 ? "today" : "week";
	}
	const inHours = t.match(/\bin\s+(\d+)\s+hours?\b/);
	if (inHours) {
		day = addHours(now, parseInt(inHours[1], 10));
		hasDay = true;
		horizon = "now";
	}
	const clock = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
	let scheduled = null;
	if (clock && Number(clock[1]) <= 23) {
		const hour = parseInt(clock[1], 10);
		const minute = clock[2] ? parseInt(clock[2], 10) : 0;
		const mer = clock[3] ? clock[3] === "pm" : hour <= 7 ? true : null;
		scheduled = applyClock(hasDay ? day : now, hour, minute, mer);
		hasDay = true;
	}
	if (!hasDay) {
		if (/\b(this week|by friday|by eod|end of week)\b/.test(t)) return {
			dueAt: addDays(now, weekdayOffset(5, now)).toISOString(),
			scheduledAt: null,
			horizon: "week"
		};
		return {
			dueAt: null,
			scheduledAt: null,
			horizon: "today"
		};
	}
	const due = scheduled ?? setHours(setMinutes(day, 0), 9);
	if (horizon === "today" && due.getTime() - now.getTime() > 1296e5) horizon = "week";
	return {
		dueAt: due.toISOString(),
		scheduledAt: scheduled ? scheduled.toISOString() : null,
		horizon
	};
}
function detectCluster(text) {
	const t = text.toLowerCase();
	let best = "Inbox";
	let score = 0;
	for (const bucket of BUCKETS) {
		const hits = bucket.keys.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
		if (hits > score) {
			score = hits;
			best = bucket.name;
		}
	}
	return best;
}
function cleanTitle(text) {
	return text.replace(/\s+/g, " ").replace(/^[.;,-]\s*/, "").replace(/\b(today|tomorrow|tonight|this (morning|afternoon|evening)|asap)\b/gi, "").replace(/\s{2,}/g, " ").trim().replace(/[,;.\s]+$/, "");
}
function parseDump(raw, now = /* @__PURE__ */ new Date()) {
	const chunks = chunkDump(raw);
	const clusterNames = /* @__PURE__ */ new Set();
	const thoughts = [];
	for (const chunk of chunks) {
		const kind = detectKind(chunk);
		const when = detectWhen(chunk, now);
		const cluster = detectCluster(chunk);
		clusterNames.add(cluster);
		const title = cleanTitle(chunk) || chunk.slice(0, 80);
		thoughts.push({
			title: title.charAt(0).toUpperCase() + title.slice(1),
			body: chunk,
			kind,
			cluster,
			horizon: when.horizon,
			energy: detectEnergy(chunk, kind),
			durationMin: detectDuration(chunk, kind),
			dueAt: when.dueAt,
			scheduledAt: when.scheduledAt
		});
	}
	if (clusterNames.size === 0) clusterNames.add("Inbox");
	const open = thoughts.length;
	const briefing = open === 0 ? "Nothing to uncluster yet." : open === 1 ? "One thing, clearly. That’s already lighter." : `${open} pieces, sorted into ${clusterNames.size} pile${clusterNames.size === 1 ? "" : "s"}. Start with what’s now.`;
	return {
		clusters: [...clusterNames].map((name) => ({
			name,
			summary: `${name} things pulled from the dump.`
		})),
		thoughts,
		briefing
	};
}
var KINDS = [
	"task",
	"note",
	"worry",
	"appointment",
	"idea"
];
var HORIZONS = [
	"now",
	"today",
	"week",
	"someday"
];
var ENERGIES = [
	"low",
	"medium",
	"high"
];
//#endregion
export { hourMarks as a, isoAtHour as c, parseDump as d, durationLabel as i, mindLoad as l, HORIZONS as n, isDueToday as o, KINDS as r, isIsoToday as s, ENERGIES as t, nowIso as u };
