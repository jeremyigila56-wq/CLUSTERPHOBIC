import { mindLoad } from "@/lib/time";
import { useMind } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LoadMeter({ className }: { className?: string }) {
  const thoughts = useMind((s) => s.thoughts);
  const load = mindLoad(thoughts);

  return (
    <div className={cn("flex items-center gap-3", className)} aria-label={`Mind load ${load.label}`}>
      <div className="ink-well" aria-hidden="true">
        <span style={{ height: `${Math.max(8, load.score * 100)}%` }} />
      </div>
      <div className="leading-tight">
        <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{load.label}</p>
        <p className="text-xs tabular-nums text-foreground/80">{load.open} open</p>
      </div>
    </div>
  );
}
