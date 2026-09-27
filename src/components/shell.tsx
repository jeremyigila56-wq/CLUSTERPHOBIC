import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { CalendarClock, Command, Focus, Layers, PenLine, SunMedium } from "lucide-react";
import { CaptureBar } from "@/components/capture-bar";
import { CommandPalette } from "@/components/command-palette";
import { LoadMeter } from "@/components/load-meter";
import { Wordmark } from "@/components/logo";
import { ThoughtSheet } from "@/components/thought-sheet";
import { UnclusterTheater } from "@/components/uncluster-theater";
import { Button } from "@/components/ui/button";
import { hydrateMind, useMind } from "@/lib/store";
import { mindLoad } from "@/lib/time";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Field", icon: Layers },
  { to: "/dump", label: "Dump", icon: PenLine },
  { to: "/day", label: "Day", icon: SunMedium },
  { to: "/focus", label: "Focus", icon: Focus },
  { to: "/review", label: "Review", icon: CalendarClock },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isSample = useMind((s) => s.isSample);
  const clearMind = useMind((s) => s.clearMind);
  const thoughts = useMind((s) => s.thoughts);
  const theater = useMind((s) => s.theater);
  const load = mindLoad(thoughts);

  useEffect(() => {
    return hydrateMind();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

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
      if (typing || theater) return;
      if (e.key === "n") {
        e.preventDefault();
        document.getElementById("capture-input")?.focus();
      }
      if (e.key === "d") void navigate({ to: "/dump" });
      if (e.key === "f") void navigate({ to: "/" });
      if (e.key === "t") void navigate({ to: "/day" });
      if (e.key === "j") void navigate({ to: "/focus" });
      if (e.key === "r") void navigate({ to: "/review" });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, theater]);

  return (
    <div
      className="flex h-dvh flex-col bg-background text-foreground"
      data-load={load.label}
      data-theater={theater ? "on" : "off"}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <LoadMeter />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="md:hidden">
            <LoadMeter />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground sm:inline-flex"
            onClick={() => setPalette(true)}
          >
            <Command className="size-3.5" />
            <span className="text-xs tracking-wide">K</span>
          </Button>
        </div>
      </header>

      {isSample && !theater ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-2 text-sm">
          <p className="text-muted-foreground">
            This is a sample mind. Dump yours and it becomes the desk.
          </p>
          <div className="flex gap-2">
            <Button size="chip" variant="secondary" asChild>
              <Link to="/dump">Dump yours</Link>
            </Button>
            <Button size="chip" variant="ghost" onClick={() => clearMind()}>
              Empty
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <nav
          className="hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-border py-3 md:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={cn(
                  "flex size-11 flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150",
                  active ? "bg-accent text-foreground" : "hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="mt-1 text-[9px] tracking-[0.12em] uppercase">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>

      {theater ? null : <CaptureBar />}

      <nav
        className="flex shrink-0 items-center justify-around border-t border-border bg-card py-1 md:hidden"
        aria-label="Primary mobile"
      >
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-11 min-w-11 flex-col items-center justify-center rounded-md px-2 text-muted-foreground",
                active && "text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="mt-0.5 text-[9px] tracking-[0.1em] uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <ThoughtSheet />
      <UnclusterTheater />
      <CommandPalette open={palette} onOpenChange={setPalette} />
    </div>
  );
}
