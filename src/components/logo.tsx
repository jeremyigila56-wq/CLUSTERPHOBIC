import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden="true">
      <rect x="3.5" y="6" width="10.5" height="10.5" rx="2.2" className="fill-foreground/20" />
      <rect x="10" y="8.5" width="10.5" height="10.5" rx="2.2" className="fill-foreground/40" />
      <rect x="6.5" y="3.5" width="10.5" height="10.5" rx="2.2" className="fill-primary" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Mark className="size-5" />
      <span className="font-display text-[15px] tracking-[0.08em] text-foreground uppercase">
        Clusterphobic
      </span>
    </span>
  );
}
