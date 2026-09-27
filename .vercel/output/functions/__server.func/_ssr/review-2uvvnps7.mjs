import { i as isToday, r as parseISO } from "../_libs/date-fns.mjs";
import { l as mindLoad } from "./types-DmzTiNOd.mjs";
import { l as useMind } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as Button } from "./router-D9D1Jx-P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/review-2uvvnps7.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewStage() {
	const thoughts = useMind((s) => s.thoughts);
	const lastBriefing = useMind((s) => s.lastBriefing);
	const clearMind = useMind((s) => s.clearMind);
	const loadSample = useMind((s) => s.loadSample);
	const isSample = useMind((s) => s.isSample);
	const completeThought = useMind((s) => s.completeThought);
	const dumps = useMind((s) => s.dumps);
	const select = useMind((s) => s.select);
	const load = mindLoad(thoughts);
	const clearedToday = thoughts.filter((t) => t.done && t.completedAt && isToday(parseISO(t.completedAt)));
	const stillOpen = thoughts.filter((t) => !t.done);
	const lingering = stillOpen.filter((t) => t.kind === "worry" || t.horizon === "now");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col overflow-y-auto px-4 py-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
				children: "Review"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-4xl tracking-tight",
				children: "What left, what stayed."
			}),
			lastBriefing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: lastBriefing
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cleared today",
						value: String(clearedToday.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Still open",
						value: String(stillOpen.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Load",
						value: load.label
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "Still nags"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: lingering.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "Nothing is shouting."
					}) : lingering.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "note-card w-full rounded-lg p-3 text-left",
						onClick: () => select(t.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[15px]",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase",
							children: [
								t.kind,
								" · ",
								t.horizon
							]
						})]
					}) }, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "Cleared"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1.5",
					children: clearedToday.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "None yet. Clearing one changes the room."
					}) : clearedToday.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground line-through",
						children: t.title
					}, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-border pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
						children: "The desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							dumps.length,
							" dump",
							dumps.length === 1 ? "" : "s",
							" recorded.",
							isSample ? " You’re looking at a sample mind." : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							lingering[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => completeThought(lingering[0].id),
								children: "Clear the loudest one"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => loadSample(),
								children: "Load sample mind"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => clearMind(),
								children: "Empty the desk"
							})
						]
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-2 text-2xl tabular-nums tracking-tight capitalize",
			children: value
		})]
	});
}
function ReviewPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStage, {});
}
//#endregion
export { ReviewPage as component };
