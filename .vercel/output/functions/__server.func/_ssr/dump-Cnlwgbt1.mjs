import { i as __toESM } from "../_runtime.mjs";
import { a as format, r as parseISO } from "../_libs/date-fns.mjs";
import { u as nowIso } from "./types-DmzTiNOd.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as useMind } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Button, n as Textarea, r as unclusterDump } from "./router-D9D1Jx-P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dump-Cnlwgbt1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE = `Finish the deck before 2
Call mom tonight
Groceries — milk, eggs, greens
Dentist Thursday morning
Worried I'm behind on taxes
Reply to Priya
That idea from the shower about the quiet desk
Book flights
Walk 20 minutes today`;
function DumpStage() {
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const dumps = useMind((s) => s.dumps);
	const ingestUncluster = useMind((s) => s.ingestUncluster);
	const navigate = useNavigate();
	async function uncluster() {
		const text = value.trim();
		if (!text || busy) return;
		setBusy(true);
		try {
			const res = await unclusterDump({ data: {
				dump: text,
				nowIso: nowIso()
			} });
			ingestUncluster(text, res.result, res.ok ? res.source : "local");
			toast(res.result.briefing);
			setValue("");
			navigate({ to: "/" });
		} catch {
			toast("Couldn't reach the uncluster. Try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-4 py-6 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.2em] text-muted-foreground uppercase",
				children: "Dump"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-4xl tracking-tight sm:text-5xl",
				children: "Don’t sort it. Get it out."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-lg text-sm text-muted-foreground",
				children: "Type the cluster in your head — errands, dreads, half-meetings. Then uncluster. Times, piles, and what’s actually now get pulled out of the mess."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value,
				onChange: (e) => setValue(e.target.value),
				placeholder: "Don't organize. Just empty it.",
				className: "font-display mt-8 min-h-0 flex-1 resize-none text-xl leading-relaxed sm:text-2xl",
				disabled: busy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void uncluster(),
						disabled: busy || value.trim().length < 3,
						children: busy ? "Unclustering…" : "Uncluster this"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						type: "button",
						onClick: () => setValue(SAMPLE),
						disabled: busy,
						children: "Try a sample dump"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Cmd+Enter from the bar also works."
					})
				]
			}),
			dumps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
					children: "Earlier dumps"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: dumps.slice(0, 4).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-foreground/70",
								children: format(parseISO(d.createdAt), "MMM d, h:mm a")
							}),
							" · ",
							d.thoughtCount,
							" pieces",
							d.briefing ? ` — ${d.briefing}` : ""
						]
					}, d.id))
				})]
			}) : null
		]
	});
}
function DumpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DumpStage, {});
}
//#endregion
export { DumpPage as component };
