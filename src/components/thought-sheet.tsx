import { format, parseISO } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { Check, Focus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ENERGY_LABEL, HORIZON_LABEL, KIND_LABEL, useMind } from "@/lib/store";
import { durationLabel } from "@/lib/time";
import type { Energy, Horizon, Kind } from "@/lib/types";
import { ENERGIES, HORIZONS, KINDS } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ThoughtSheet() {
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

  return (
    <Sheet open={Boolean(selectedId)} onOpenChange={(open) => !open && select(null)}>
      <SheetContent className="paper-surface gap-0">
        <SheetHeader>
          <SheetTitle className="sr-only">{thought.title}</SheetTitle>
          <SheetDescription className="sr-only">Edit this thought</SheetDescription>
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {cluster?.name ?? "Inbox"} · {KIND_LABEL[thought.kind]}
          </p>
          <Input
            value={thought.title}
            onChange={(e) => updateThought(thought.id, { title: e.target.value })}
            className="font-display h-auto rounded-none bg-transparent px-0 py-1 text-2xl font-medium tracking-tight shadow-none focus-visible:shadow-none"
          />
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
          <Textarea
            value={thought.body}
            onChange={(e) => updateThought(thought.id, { body: e.target.value })}
            placeholder="Anything else this is carrying…"
            className="min-h-20 text-sm text-muted-foreground"
          />

          <Field label="Kind">
            <ChipRow
              options={KINDS.map((k) => ({ id: k, label: KIND_LABEL[k] }))}
              value={thought.kind}
              onChange={(kind) => updateThought(thought.id, { kind: kind as Kind })}
            />
          </Field>

          <Field label="When">
            <ChipRow
              options={HORIZONS.map((h) => ({ id: h, label: HORIZON_LABEL[h] }))}
              value={thought.horizon}
              onChange={(horizon) => updateThought(thought.id, { horizon: horizon as Horizon })}
            />
          </Field>

          <Field label="Energy">
            <ChipRow
              options={ENERGIES.map((e) => ({ id: e, label: ENERGY_LABEL[e] }))}
              value={thought.energy}
              onChange={(energy) => updateThought(thought.id, { energy: energy as Energy })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Due">
              <Input
                type="date"
                value={thought.dueAt ? format(parseISO(thought.dueAt), "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  updateThought(thought.id, {
                    dueAt: v ? new Date(`${v}T09:00:00`).toISOString() : null,
                  });
                }}
              />
            </Field>
            <Field label="Clock">
              <Input
                type="time"
                value={
                  thought.scheduledAt ? format(parseISO(thought.scheduledAt), "HH:mm") : ""
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) {
                    updateThought(thought.id, { scheduledAt: null });
                    return;
                  }
                  const base = thought.dueAt ? parseISO(thought.dueAt) : new Date();
                  const [hh, mm] = v.split(":").map(Number);
                  base.setHours(hh, mm, 0, 0);
                  updateThought(thought.id, {
                    scheduledAt: base.toISOString(),
                    horizon: thought.horizon === "someday" ? "today" : thought.horizon,
                  });
                }}
              />
            </Field>
          </div>

          <Field label={`Duration · ${durationLabel(thought.durationMin)}`}>
            <div className="flex flex-wrap gap-1.5">
              {[15, 25, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => updateThought(thought.id, { durationMin: m })}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs",
                    thought.durationMin === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {durationLabel(m)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Pile">
            <div className="flex flex-wrap gap-1.5">
              {clusters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateThought(thought.id, { clusterId: c.id })}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs",
                    thought.clusterId === c.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.name}
                </button>
              ))}
              <button
                type="button"
                className="h-8 rounded-full bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const name = window.prompt("Name this pile");
                  if (!name?.trim()) return;
                  const id = addCluster(name);
                  updateThought(thought.id, { clusterId: id });
                }}
              >
                New pile
              </button>
            </div>
          </Field>

          {thought.done ? (
            <Badge variant="outline">Cleared {thought.completedAt ? "already" : ""}</Badge>
          ) : null}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          {thought.done ? (
            <Button variant="secondary" className="flex-1" onClick={() => reopenThought(thought.id)}>
              Reopen
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={() => {
                completeThought(thought.id);
                select(null);
              }}
            >
              <Check className="size-4" />
              Clear
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setFocus(thought.id);
              select(null);
              void navigate({ to: "/focus" });
            }}
          >
            <Focus className="size-4" />
            Focus
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete thought"
            onClick={() => {
              deleteThought(thought.id);
              select(null);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      {children}
    </div>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "h-8 rounded-full px-3 text-xs",
            value === opt.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
