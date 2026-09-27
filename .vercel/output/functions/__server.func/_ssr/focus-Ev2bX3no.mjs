import { i as __toESM } from "../_runtime.mjs";
import { i as durationLabel } from "./types-DmzTiNOd.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as useMind, n as HORIZON_LABEL, s as pickNextFocus, t as ENERGY_LABEL } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Button } from "./router-D9D1Jx-P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/focus-Ev2bX3no.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FocusStage() {
	const thoughts = useMind((s) => s.thoughts);
	const clusters = useMind((s) => s.clusters);
	const focusId = useMind((s) => s.focusId);
	const elapsed = useMind((s) => s.focusElapsedSec);
	const setFocus = useMind((s) => s.setFocus);
	const tickFocus = useMind((s) => s.tickFocus);
	const completeThought = useMind((s) => s.completeThought);
	const updateThought = useMind((s) => s.updateThought);
	const navigate = useNavigate();
	const current = thoughts.find((t) => t.id === focusId && !t.done) ?? pickNextFocus(thoughts);
	(0, import_react.useEffect)(() => {
		if (current && current.id !== focusId) setFocus(current.id);
	}, [
		current,
		focusId,
		setFocus
	]);
	(0, import_react.useEffect)(() => {
		if (!current) return;
		const started = Date.now() - elapsed * 1e3;
		const id = window.setInterval(() => {
			tickFocus(Math.floor((Date.now() - started) / 1e3));
		}, 1e3);
		return () => window.clearInterval(id);
	}, [current?.id]);
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
				children: "Focus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 max-w-md text-4xl tracking-tight",
				children: "Nothing is crowding you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-sm text-muted-foreground",
				children: "Dump something, or go back to the desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: () => void navigate({ to: "/dump" }),
				children: "Empty your head"
			})
		]
	});
	const cluster = clusters.find((c) => c.id === current.clusterId);
	const remaining = Math.max(0, current.durationMin * 60 - elapsed);
	const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
	const ss = String(remaining % 60).padStart(2, "0");
	const progress = Math.min(1, elapsed / Math.max(current.durationMin * 60, 1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full max-w-xl flex-col justify-center px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
				children: "This, only this"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-4 text-4xl leading-tight tracking-tight sm:text-5xl",
				children: current.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: [
					cluster?.name,
					" · ",
					HORIZON_LABEL[current.horizon],
					" · ",
					ENERGY_LABEL[current.energy],
					" ·",
					" ",
					durationLabel(current.durationMin)
				]
			}),
			current.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-foreground/70",
				children: current.body
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-5xl tabular-nums tracking-tight",
					children: [
						mm,
						":",
						ss
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-px w-full bg-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "now-line h-px",
						style: { width: `${progress * 100}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							completeThought(current.id);
							const next = pickNextFocus(useMind.getState().thoughts);
							setFocus(next?.id ?? null);
						},
						children: "Clear it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							updateThought(current.id, { horizon: "week" });
							const rest = useMind.getState().thoughts.filter((t) => t.id !== current.id);
							const next = pickNextFocus(rest);
							setFocus(next?.id ?? null);
						},
						children: "Not now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void navigate({ to: "/" }),
						children: "Back to the desk"
					})
				]
			})
		]
	});
}
function FocusPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusStage, {});
}
//#endregion
export { FocusPage as component };
