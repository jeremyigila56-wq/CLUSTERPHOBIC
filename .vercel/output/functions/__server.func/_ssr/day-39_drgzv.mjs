import { a as format, r as parseISO } from "../_libs/date-fns.mjs";
import { a as hourMarks, i as durationLabel, o as isDueToday, s as isIsoToday } from "./types-DmzTiNOd.mjs";
import { a as cn, l as useMind } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/day-39_drgzv.js
var import_jsx_runtime = require_jsx_runtime();
function DaySpine() {
	const thoughts = useMind((s) => s.thoughts);
	const clusters = useMind((s) => s.clusters);
	const workStartHour = useMind((s) => s.workStartHour);
	const workEndHour = useMind((s) => s.workEndHour);
	const select = useMind((s) => s.select);
	const selectedId = useMind((s) => s.selectedId);
	const updateThought = useMind((s) => s.updateThought);
	const lastBriefing = useMind((s) => s.lastBriefing);
	const today = thoughts.filter((t) => !t.done).filter(isDueToday);
	const scheduled = today.filter((t) => t.scheduledAt && isIsoToday(t.scheduledAt));
	const unscheduled = today.filter((t) => !(t.scheduledAt && isIsoToday(t.scheduledAt)));
	const hours = hourMarks(workStartHour, workEndHour);
	const now = /* @__PURE__ */ new Date();
	const nowH = now.getHours() + now.getMinutes() / 60;
	const hourH = 72;
	function placeOnHour(thought, hour) {
		const d = /* @__PURE__ */ new Date();
		d.setHours(hour, 0, 0, 0);
		updateThought(thought.id, {
			scheduledAt: d.toISOString(),
			horizon: thought.horizon === "someday" ? "today" : thought.horizon,
			dueAt: thought.dueAt ?? d.toISOString()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-full shrink-0 flex-col gap-3 sm:w-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
					children: "Today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl tracking-tight",
					children: format(now, "EEEE d")
				}),
				lastBriefing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: lastBriefing
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Drop unscheduled notes onto an hour. One pile at a time."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-2 overflow-y-auto pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: ["Unplaced · ", unscheduled.length]
				}), unscheduled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Everything for today has a time."
				}) : unscheduled.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => select(t.id),
					className: cn("note-card w-full rounded-lg p-3 text-left", selectedId === t.id && "ring-1 ring-primary"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[15px] leading-snug",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
						children: [
							clusters.find((c) => c.id === t.clusterId)?.name,
							" · ",
							durationLabel(t.durationMin)
						]
					})]
				}, t.id))]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-0 flex-1 overflow-y-auto pr-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				style: { height: hours.length * hourH },
				children: [
					hours.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "spine-hour absolute right-0 left-0 flex",
						style: {
							top: i * hourH,
							height: hourH
						},
						onClick: () => {
							if (!selectedId) return;
							const t = thoughts.find((x) => x.id === selectedId);
							if (t) placeOnHour(t, h);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-14 shrink-0 pt-2 text-xs tabular-nums text-muted-foreground",
							children: format((/* @__PURE__ */ new Date()).setHours(h, 0, 0, 0), "h a")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" })]
					}, h)),
					nowH >= workStartHour && nowH <= workEndHour ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute right-0 left-0 z-10 flex items-center",
						style: { top: (nowH - workStartHour) * hourH },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-14" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "now-line h-px flex-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "now-line ml-2 size-1.5 rounded-full" })
						]
					}) : null,
					scheduled.map((t) => {
						const d = parseISO(t.scheduledAt);
						const top = (d.getHours() + d.getMinutes() / 60 - workStartHour) * hourH + 8;
						const height = Math.max(48, t.durationMin / 60 * hourH - 8);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => select(t.id),
							className: cn("note-card absolute right-2 left-16 z-[2] overflow-hidden rounded-md p-2.5 text-left", selectedId === t.id && "ring-1 ring-primary"),
							style: {
								top,
								height
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 font-display text-sm leading-snug",
								children: t.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[10px] tracking-[0.12em] text-muted-foreground uppercase",
								children: [
									format(d, "h:mm a"),
									" · ",
									durationLabel(t.durationMin)
								]
							})]
						}, t.id);
					})
				]
			}), selectedId && unscheduled.some((t) => t.id === selectedId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sticky bottom-2 mt-3 text-center text-xs text-muted-foreground",
				children: "Tap an hour to place it."
			}) : null]
		})]
	});
}
function DayPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaySpine, {});
}
//#endregion
export { DayPage as component };
