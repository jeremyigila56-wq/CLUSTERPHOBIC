import { i as __toESM } from "../_runtime.mjs";
import { a as format, r as parseISO } from "../_libs/date-fns.mjs";
import { i as durationLabel, l as mindLoad, n as HORIZONS, r as KINDS, t as ENERGIES, u as nowIso } from "./types-DmzTiNOd.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as cn, l as useMind, n as HORIZON_LABEL, o as hydrateMind, r as KIND_LABEL, s as pickNextFocus, t as ENERGY_LABEL } from "./store-VouiM2Md.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useLocation, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Search, c as Focus, d as CalendarClock, f as ArrowUp, i as SunMedium, l as Command, n as TriangleAlert, o as PenLine, r as Trash2, s as Layers, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as DialogOverlay$1, h as Slot, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D9D1Jx-P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var buttonVariants = cva("tap-press inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			ghost: "text-foreground hover:bg-accent",
			outline: "hairline bg-transparent hover:bg-accent",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
		},
		size: {
			default: "h-10 rounded-md px-4",
			sm: "h-9 rounded-sm px-3",
			lg: "h-11 rounded-lg px-5",
			icon: "size-10 rounded-md",
			chip: "h-8 rounded-full px-3 text-xs"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:shadow-[var(--shadow-border-hover)] disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var unclusterDump = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ee0d33118314e4fce8ff78c397c37c2fab18f3eb51e1b86fc6344ed6dc0d750e"));
function CaptureBar() {
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const capture = useMind((s) => s.capture);
	const ingestUncluster = useMind((s) => s.ingestUncluster);
	const navigate = useNavigate();
	async function onSubmit(uncluster) {
		const text = value.trim();
		if (!text || busy) return;
		if (!uncluster && text.length < 140 && !text.includes("\n")) {
			capture(text);
			setValue("");
			toast("Caught. Sitting on the desk.");
			return;
		}
		setBusy(true);
		try {
			const res = await unclusterDump({ data: {
				dump: text,
				nowIso: nowIso()
			} });
			ingestUncluster(text, res.result, res.ok ? res.source : "local");
			setValue("");
			toast(res.result.briefing || `Unclustered into ${res.result.thoughts.length} pieces.`);
			navigate({ to: "/" });
		} catch {
			capture(text);
			setValue("");
			toast("Saved locally.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		className: "border-t border-border bg-card/80 px-3 py-2.5 backdrop-blur-sm sm:px-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-3xl items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "capture-input",
					value,
					onChange: (e) => setValue(e.target.value),
					placeholder: "What’s crowding you?",
					className: "h-11 rounded-lg bg-background",
					disabled: busy,
					onKeyDown: (e) => {
						if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
							e.preventDefault();
							onSubmit(true);
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					size: "icon",
					className: "size-11 shrink-0",
					disabled: busy || !value.trim(),
					onClick: () => void onSubmit(true),
					"aria-label": "Uncluster this",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					className: "size-11 shrink-0",
					disabled: busy || !value.trim(),
					"aria-label": "Capture",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
				})
			]
		})
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 text-card-foreground shadow-[var(--shadow-border)]", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
var Command$2 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground", className),
	...props
}));
Command$2.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center gap-2 border-b border-border px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-80 overflow-x-hidden overflow-y-auto p-1", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-8 text-center text-sm text-muted-foreground",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none select-none data-[selected=true]:bg-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
function CommandPalette({ open, onOpenChange }) {
	const navigate = useNavigate();
	const thoughts = useMind((s) => s.thoughts);
	const select = useMind((s) => s.select);
	const completeThought = useMind((s) => s.completeThought);
	const setFocus = useMind((s) => s.setFocus);
	const capture = useMind((s) => s.capture);
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setQuery("");
	}, [open]);
	const openThoughts = thoughts.filter((t) => !t.done);
	function go(path) {
		onOpenChange(false);
		navigate({ to: path });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Command palette"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Jump, capture, or clear a thought"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
					placeholder: "Jump, capture, or find a thought…",
					value: query,
					onValueChange: setQuery
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "Nothing matches." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
						heading: "Go",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								onSelect: () => go("/"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), " Field"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								onSelect: () => go("/dump"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" }), " Dump"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								onSelect: () => go("/day"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "size-4" }), " Day"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								onSelect: () => go("/focus"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "size-4" }), " Focus"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
								onSelect: () => go("/review"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4" }), " Review"]
							})
						]
					}),
					query.trim().length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: "Capture",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								capture(query.trim());
								onOpenChange(false);
								go("/");
							},
							children: [
								"Catch “",
								query.trim(),
								"”"
							]
						})
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: "Open",
						children: openThoughts.slice(0, 12).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandItem, {
							value: `${t.title} ${t.id}`,
							onSelect: () => {
								select(t.id);
								onOpenChange(false);
							},
							children: t.title
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
						heading: "Act",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								const next = pickNextFocus(thoughts);
								if (!next) return;
								completeThought(next.id);
								onOpenChange(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Clear the next thing"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								const next = pickNextFocus(thoughts);
								if (!next) return;
								setFocus(next.id);
								go("/focus");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "size-4" }), " Focus the next thing"]
						})]
					})
				] })] })
			]
		})
	});
}
function LoadMeter({ className }) {
	const thoughts = useMind((s) => s.thoughts);
	const load = mindLoad(thoughts);
	const filled = Math.round(load.score * 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3", className),
		"aria-label": `Mind load ${load.label}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-end gap-px",
			"aria-hidden": "true",
			children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("load-tick", i < filled && "on"),
				style: { height: `${8 + i % 3 * 3}px` }
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
				children: load.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tabular-nums text-foreground/80",
				children: [load.open, " open"]
			})]
		})]
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-6", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3.5",
				y: "6",
				width: "10.5",
				height: "10.5",
				rx: "2.2",
				className: "fill-foreground/20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10",
				y: "8.5",
				width: "10.5",
				height: "10.5",
				rx: "2.2",
				className: "fill-foreground/40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "6.5",
				y: "3.5",
				width: "10.5",
				height: "10.5",
				rx: "2.2",
				className: "fill-primary"
			})
		]
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[15px] tracking-[0.08em] text-foreground uppercase",
			children: "Clusterphobic"
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-accent text-muted-foreground",
		solid: "bg-primary text-primary-foreground",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/60", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var SheetContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-card text-card-foreground shadow-[var(--shadow-border)]", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-3 right-3 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 px-6 pt-6 pr-14 pb-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-2xl font-medium tracking-tight", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-lg bg-transparent px-0 py-0 text-base text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ThoughtSheet() {
	const navigate = useNavigate();
	const selectedId = useMind((s) => s.selectedId);
	const thought = useMind((s) => s.thoughts.find((t) => t.id === selectedId) ?? null);
	const clusters = useMind((s) => s.clusters);
	const select = useMind((s) => s.select);
	const updateThought = useMind((s) => s.updateThought);
	const completeThought = useMind((s) => s.completeThought);
	const reopenThought = useMind((s) => s.reopenThought);
	const deleteThought = useMind((s) => s.deleteThought);
	const setFocus = useMind((s) => s.setFocus);
	const addCluster = useMind((s) => s.addCluster);
	if (!thought) return null;
	const cluster = clusters.find((c) => c.id === thought.clusterId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: Boolean(selectedId),
		onOpenChange: (open) => !open && select(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "gap-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "sr-only",
						children: thought.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
						className: "sr-only",
						children: "Edit this thought"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
						children: [
							cluster?.name ?? "Inbox",
							" · ",
							KIND_LABEL[thought.kind]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: thought.title,
						onChange: (e) => updateThought(thought.id, { title: e.target.value }),
						className: "font-display h-auto rounded-none bg-transparent px-0 py-1 text-2xl font-medium tracking-tight shadow-none focus-visible:shadow-none"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 overflow-y-auto px-6 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: thought.body,
							onChange: (e) => updateThought(thought.id, { body: e.target.value }),
							placeholder: "Anything else this is carrying…",
							className: "min-h-20 text-sm text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kind",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								options: KINDS.map((k) => ({
									id: k,
									label: KIND_LABEL[k]
								})),
								value: thought.kind,
								onChange: (kind) => updateThought(thought.id, { kind })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "When",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								options: HORIZONS.map((h) => ({
									id: h,
									label: HORIZON_LABEL[h]
								})),
								value: thought.horizon,
								onChange: (horizon) => updateThought(thought.id, { horizon })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Energy",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								options: ENERGIES.map((e) => ({
									id: e,
									label: ENERGY_LABEL[e]
								})),
								value: thought.energy,
								onChange: (energy) => updateThought(thought.id, { energy })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Due",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: thought.dueAt ? format(parseISO(thought.dueAt), "yyyy-MM-dd") : "",
									onChange: (e) => {
										const v = e.target.value;
										updateThought(thought.id, { dueAt: v ? (/* @__PURE__ */ new Date(`${v}T09:00:00`)).toISOString() : null });
									}
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Clock",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: thought.scheduledAt ? format(parseISO(thought.scheduledAt), "HH:mm") : "",
									onChange: (e) => {
										const v = e.target.value;
										if (!v) {
											updateThought(thought.id, { scheduledAt: null });
											return;
										}
										const base = thought.dueAt ? parseISO(thought.dueAt) : /* @__PURE__ */ new Date();
										const [hh, mm] = v.split(":").map(Number);
										base.setHours(hh, mm, 0, 0);
										updateThought(thought.id, {
											scheduledAt: base.toISOString(),
											horizon: thought.horizon === "someday" ? "today" : thought.horizon
										});
									}
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: `Duration · ${durationLabel(thought.durationMin)}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [
									15,
									25,
									45,
									60,
									90
								].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateThought(thought.id, { durationMin: m }),
									className: cn("h-8 rounded-full px-3 text-xs", thought.durationMin === m ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: durationLabel(m)
								}, m))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pile",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [clusters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateThought(thought.id, { clusterId: c.id }),
									className: cn("h-8 rounded-full px-3 text-xs", thought.clusterId === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: c.name
								}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-8 rounded-full bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground",
									onClick: () => {
										const name = window.prompt("Name this pile");
										if (!name?.trim()) return;
										const id = addCluster(name);
										updateThought(thought.id, { clusterId: id });
									},
									children: "New pile"
								})]
							})
						}),
						thought.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: ["Cleared ", thought.completedAt ? "already" : ""]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 border-t border-border p-4",
					children: [
						thought.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							onClick: () => reopenThought(thought.id),
							children: "Reopen"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1",
							onClick: () => {
								completeThought(thought.id);
								select(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Clear"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => {
								setFocus(thought.id);
								select(null);
								navigate({ to: "/focus" });
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "size-4" }), "Focus"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Delete thought",
							onClick: () => {
								deleteThought(thought.id);
								select(null);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-[0.16em] text-muted-foreground uppercase",
			children: label
		}), children]
	});
}
function ChipRow({ options, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(opt.id),
			className: cn("h-8 rounded-full px-3 text-xs", value === opt.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"),
			children: opt.label
		}, opt.id))
	});
}
var NAV = [
	{
		to: "/",
		label: "Field",
		icon: Layers
	},
	{
		to: "/dump",
		label: "Dump",
		icon: PenLine
	},
	{
		to: "/day",
		label: "Day",
		icon: SunMedium
	},
	{
		to: "/focus",
		label: "Focus",
		icon: Focus
	},
	{
		to: "/review",
		label: "Review",
		icon: CalendarClock
	}
];
function Shell({ children }) {
	const [palette, setPalette] = (0, import_react.useState)(false);
	const location = useLocation();
	const navigate = useNavigate();
	const isSample = useMind((s) => s.isSample);
	const clearMind = useMind((s) => s.clearMind);
	(0, import_react.useEffect)(() => {
		return hydrateMind();
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			const target = e.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPalette((v) => !v);
				return;
			}
			if (e.key === "?" && !typing) {
				e.preventDefault();
				setPalette(true);
				return;
			}
			if (typing) return;
			if (e.key === "n") {
				e.preventDefault();
				document.getElementById("capture-input")?.focus();
			}
			if (e.key === "d") navigate({ to: "/dump" });
			if (e.key === "f") navigate({ to: "/" });
			if (e.key === "t") navigate({ to: "/day" });
			if (e.key === "j") navigate({ to: "/focus" });
			if (e.key === "r") navigate({ to: "/review" });
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden flex-1 justify-center md:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadMeter, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadMeter, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "hidden text-muted-foreground sm:inline-flex",
							onClick: () => setPalette(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-wide",
								children: "K"
							})]
						})]
					})
				]
			}),
			isSample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "This is a sample mind. Dump yours and it becomes the desk."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "chip",
						variant: "secondary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dump",
							children: "Dump yours"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "chip",
						variant: "ghost",
						onClick: () => clearMind(),
						children: "Empty"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-border py-3 md:flex",
					"aria-label": "Primary",
					children: NAV.map((item) => {
						const active = location.pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							"aria-label": item.label,
							className: cn("flex size-11 flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150", active ? "bg-accent text-foreground" : "hover:bg-accent/60 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-[9px] tracking-[0.12em] uppercase",
								children: item.label
							})]
						}, item.to);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-h-0 min-w-0 flex-1 overflow-hidden",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex shrink-0 items-center justify-around border-t border-border bg-card py-1 md:hidden",
				"aria-label": "Primary mobile",
				children: NAV.map((item) => {
					const active = location.pathname === item.to;
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-11 min-w-11 flex-col items-center justify-center rounded-md px-2 text-muted-foreground", active && "text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 text-[9px] tracking-[0.1em] uppercase",
							children: item.label
						})]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThoughtSheet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
				open: palette,
				onOpenChange: setPalette
			})
		]
	});
}
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 8, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-[var(--shadow-border)]", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var styles_default = "/assets/styles-Dts4SXbI.css";
var APP_NAME = "Clusterphobic";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Empty your head. Uncluster it. Do the next true thing."
			},
			{
				name: "theme-color",
				content: "#0b0b0a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
				delayDuration: 200,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "top-center",
					toastOptions: { className: "!bg-card !text-foreground !border-border !shadow-[var(--shadow-border)]" }
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-DtjN32kx.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./day-39_drgzv.mjs");
var Route$3 = createFileRoute("/day")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./dump-Cnlwgbt1.mjs");
var Route$2 = createFileRoute("/dump")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./focus-Ev2bX3no.mjs");
var Route$1 = createFileRoute("/focus")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./review-2uvvnps7.mjs");
var Route = createFileRoute("/review")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	DayRoute: Route$3.update({
		id: "/day",
		path: "/day",
		getParentRoute: () => Route$5
	}),
	DumpRoute: Route$2.update({
		id: "/dump",
		path: "/dump",
		getParentRoute: () => Route$5
	}),
	FocusRoute: Route$1.update({
		id: "/focus",
		path: "/focus",
		getParentRoute: () => Route$5
	}),
	ReviewRoute: Route.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Button as i, Textarea as n, unclusterDump as r, router_exports as t };
