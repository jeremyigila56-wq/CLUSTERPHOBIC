import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as cn, c as unit, i as clamp, l as useMind, n as HORIZON_LABEL } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { u as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DtjN32kx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CARD_W = 176;
var CARD_H = 88;
function autoLayout(clusters, thoughts, width, height) {
	const map = /* @__PURE__ */ new Map();
	const grouped = clusters.map((c) => ({
		cluster: c,
		items: thoughts.filter((t) => t.clusterId === c.id)
	})).filter((g) => g.items.length > 0);
	const n = Math.max(grouped.length, 1);
	const cx0 = width / 2;
	const cy0 = height / 2;
	const rx = Math.max(width * .32, 140);
	const ry = Math.max(height * .3, 110);
	grouped.forEach((g, i) => {
		const angle = i / n * Math.PI * 2 - Math.PI / 2;
		const ccx = n === 1 ? cx0 : cx0 + Math.cos(angle) * rx;
		const ccy = n === 1 ? cy0 : cy0 + Math.sin(angle) * ry;
		g.items.forEach((t, j) => {
			if (t.x != null && t.y != null) {
				map.set(t.id, {
					x: t.x,
					y: t.y
				});
				return;
			}
			const count = g.items.length;
			const a = j / Math.max(count, 1) * Math.PI * 2 + unit(t.id, "a") * .7;
			const ring = 72 + j % 3 * 34 + unit(t.id, "r") * 22;
			const spread = count === 1 ? 0 : ring;
			map.set(t.id, {
				x: clamp(ccx + Math.cos(a) * spread - CARD_W / 2, 12, width - CARD_W - 12),
				y: clamp(ccy + Math.sin(a) * spread - CARD_H / 2, 56, height - CARD_H - 16)
			});
		});
	});
	return map;
}
function ClusterField() {
	const thoughts = useMind((s) => s.thoughts);
	const clusters = useMind((s) => s.clusters);
	const selectedId = useMind((s) => s.selectedId);
	const select = useMind((s) => s.select);
	const completeThought = useMind((s) => s.completeThought);
	const placeThought = useMind((s) => s.placeThought);
	const moveToCluster = useMind((s) => s.moveToCluster);
	const resetLayout = useMind((s) => s.resetLayout);
	const [filter, setFilter] = (0, import_react.useState)("open");
	const wrapRef = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)({
		w: 800,
		h: 600
	});
	const drag = (0, import_react.useRef)(null);
	const [live, setLive] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => {
			const r = el.getBoundingClientRect();
			setSize({
				w: r.width,
				h: r.height
			});
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	const visible = thoughts.filter((t) => filter === "all" ? true : !t.done);
	const layout = (0, import_react.useMemo)(() => autoLayout(clusters, visible, size.w, size.h), [
		clusters,
		visible,
		size.w,
		size.h
	]);
	const clusterCenters = (0, import_react.useMemo)(() => {
		const acc = /* @__PURE__ */ new Map();
		for (const t of visible) {
			const p = live[t.id] ?? layout.get(t.id);
			if (!p) continue;
			const cur = acc.get(t.clusterId) ?? {
				x: 0,
				y: 0,
				n: 0,
				name: ""
			};
			cur.x += p.x + CARD_W / 2;
			cur.y += p.y + CARD_H / 2;
			cur.n += 1;
			cur.name = clusters.find((c) => c.id === t.clusterId)?.name ?? "";
			acc.set(t.clusterId, cur);
		}
		const out = /* @__PURE__ */ new Map();
		for (const [id, v] of acc) out.set(id, {
			x: v.x / v.n,
			y: v.y / v.n,
			name: v.name
		});
		return out;
	}, [
		visible,
		layout,
		live,
		clusters
	]);
	function onPointerDown(e, id) {
		const p = live[id] ?? layout.get(id);
		if (!p) return;
		const rect = wrapRef.current?.getBoundingClientRect();
		if (!rect) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drag.current = {
			id,
			dx: e.clientX - rect.left - p.x,
			dy: e.clientY - rect.top - p.y,
			moved: false
		};
	}
	function onPointerMove(e) {
		const d = drag.current;
		if (!d) return;
		const rect = wrapRef.current?.getBoundingClientRect();
		if (!rect) return;
		const x = clamp(e.clientX - rect.left - d.dx, 8, size.w - CARD_W - 8);
		const y = clamp(e.clientY - rect.top - d.dy, 8, size.h - CARD_H - 8);
		if (Math.abs(x - (live[d.id]?.x ?? layout.get(d.id)?.x ?? 0)) > 3) d.moved = true;
		setLive((prev) => ({
			...prev,
			[d.id]: {
				x,
				y
			}
		}));
	}
	function onPointerUp() {
		const d = drag.current;
		if (!d) return;
		const pos = live[d.id];
		if (d.moved && pos) {
			placeThought(d.id, pos.x, pos.y);
			let nearest = null;
			for (const [cid, c] of clusterCenters) {
				const dist = Math.hypot(c.x - (pos.x + CARD_W / 2), c.y - (pos.y + CARD_H / 2));
				if (!nearest || dist < nearest.dist) nearest = {
					id: cid,
					dist
				};
			}
			if (nearest && nearest.dist < 140) moveToCluster(d.id, nearest.id);
		} else if (!d.moved) select(d.id);
		drag.current = null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg text-foreground/90 italic sm:text-xl",
					children: visible.length === 0 ? "The desk is clear." : "Everything on the desk, in piles."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 rounded-full bg-card/80 p-1 shadow-[var(--shadow-border)] backdrop-blur-sm",
					children: [["open", "all"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(key),
						className: cn("h-8 rounded-full px-3 text-xs tracking-wide uppercase", filter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"),
						children: key
					}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setLive({});
							resetLayout();
						},
						className: "hidden h-8 rounded-full px-3 text-xs tracking-wide text-muted-foreground uppercase hover:text-foreground md:inline",
						children: "Spread"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: wrapRef,
				className: "field-canvas relative hidden min-h-0 flex-1 overflow-hidden md:block",
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "field-grain absolute inset-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "desk-vignette absolute inset-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "pointer-events-none absolute inset-0 size-full",
						"aria-hidden": "true",
						children: visible.map((t) => {
							const p = live[t.id] ?? layout.get(t.id);
							const c = clusterCenters.get(t.clusterId);
							if (!p || !c) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: p.x + CARD_W / 2,
								y1: p.y + CARD_H / 2,
								x2: c.x,
								y2: c.y,
								stroke: "currentColor",
								className: "text-foreground/10",
								strokeWidth: "1"
							}, `l-${t.id}`);
						})
					}),
					[...clusterCenters.entries()].map(([id, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2",
						style: {
							left: c.x,
							top: c.y - 58
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm tracking-[0.14em] text-muted-foreground uppercase",
							children: c.name
						})
					}, id)),
					visible.map((t) => {
						const p = live[t.id] ?? layout.get(t.id);
						if (!p) return null;
						const rot = (unit(t.id, "rot") - .5) * 5;
						const delay = unit(t.id, "d") * 2;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteCard, {
							thought: t,
							clusterName: clusters.find((c) => c.id === t.clusterId)?.name ?? "",
							x: p.x,
							y: p.y,
							rot,
							delay,
							selected: selectedId === t.id,
							onPointerDown: (e) => onPointerDown(e, t.id),
							onSelect: () => select(t.id),
							onComplete: () => completeThought(t.id)
						}, t.id);
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-16 pb-4 md:hidden",
				children: clusters.map((c) => ({
					cluster: c,
					items: visible.filter((t) => t.clusterId === c.id)
				})).filter((g) => g.items.length > 0).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-sm tracking-[0.14em] text-muted-foreground uppercase",
					children: g.cluster.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: g.items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(t.id),
						className: cn("note-card w-full rounded-lg p-3 text-left", selectedId === t.id && "ring-1 ring-primary", t.done && "opacity-40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base leading-snug",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs tracking-[0.12em] text-muted-foreground uppercase",
							children: HORIZON_LABEL[t.horizon]
						})]
					}) }, t.id))
				})] }, g.cluster.id))
			})
		]
	});
}
function NoteCard({ thought, clusterName, x, y, rot, delay, selected, onPointerDown, onSelect, onComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("float-note note-card absolute z-[1] cursor-grab touch-none rounded-lg active:cursor-grabbing", selected && "z-20 ring-1 ring-primary", thought.done && "opacity-40"),
		style: {
			left: x,
			top: y,
			width: CARD_W,
			height: CARD_H,
			rotate: `${rot}deg`,
			animation: `float-note 7s ease-in-out ${delay}s infinite`
		},
		onPointerDown,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "absolute inset-0 rounded-lg p-3 pr-10 text-left",
			onClick: onSelect,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-2 font-display text-sm leading-snug text-foreground",
				children: thought.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs tracking-[0.14em] text-muted-foreground uppercase",
				children: [HORIZON_LABEL[thought.horizon], clusterName ? ` · ${clusterName}` : ""]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": `Clear ${thought.title}`,
			className: "absolute top-2.5 right-2 z-10 size-7 rounded-full shadow-[var(--shadow-border)] hover:bg-accent",
			onPointerDown: (e) => e.stopPropagation(),
			onClick: (e) => {
				e.stopPropagation();
				onComplete();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto size-3.5 text-muted-foreground" })
		})]
	});
}
function FieldPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClusterField, {});
}
//#endregion
export { FieldPage as component };
