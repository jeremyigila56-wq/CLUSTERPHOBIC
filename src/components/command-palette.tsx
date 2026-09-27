import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarClock, Check, Focus, Layers, PenLine, SunMedium } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { pickNextFocus, useMind } from "@/lib/store";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const thoughts = useMind((s) => s.thoughts);
  const select = useMind((s) => s.select);
  const completeThought = useMind((s) => s.completeThought);
  const setFocus = useMind((s) => s.setFocus);
  const capture = useMind((s) => s.capture);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const openThoughts = thoughts.filter((t) => !t.done);

  function go(path: string) {
    onOpenChange(false);
    void navigate({ to: path });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">Jump, capture, or clear a thought</DialogDescription>
        <Command>
          <CommandInput
            placeholder="Jump, capture, or find a thought…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>Nothing matches.</CommandEmpty>
            <CommandGroup heading="On the desk">
              <CommandItem onSelect={() => go("/")}>
                <Layers className="size-4" /> Hold Space on the field to exhale
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Go">
              <CommandItem onSelect={() => go("/")}>
                <Layers className="size-4" /> Field
              </CommandItem>
              <CommandItem onSelect={() => go("/dump")}>
                <PenLine className="size-4" /> Dump
              </CommandItem>
              <CommandItem onSelect={() => go("/day")}>
                <SunMedium className="size-4" /> Day
              </CommandItem>
              <CommandItem onSelect={() => go("/focus")}>
                <Focus className="size-4" /> Focus
              </CommandItem>
              <CommandItem onSelect={() => go("/review")}>
                <CalendarClock className="size-4" /> Review
              </CommandItem>
            </CommandGroup>
            {query.trim().length > 1 ? (
              <>
                <CommandSeparator />
                <CommandGroup heading="Capture">
                  <CommandItem
                    onSelect={() => {
                      capture(query.trim());
                      onOpenChange(false);
                      go("/");
                    }}
                  >
                    Catch “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
            <CommandSeparator />
            <CommandGroup heading="Open">
              {openThoughts.slice(0, 12).map((t) => (
                <CommandItem
                  key={t.id}
                  value={`${t.title} ${t.id}`}
                  onSelect={() => {
                    select(t.id);
                    onOpenChange(false);
                  }}
                >
                  {t.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Act">
              <CommandItem
                onSelect={() => {
                  const next = pickNextFocus(thoughts);
                  if (!next) return;
                  completeThought(next.id);
                  onOpenChange(false);
                }}
              >
                <Check className="size-4" /> Clear the next thing
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  const next = pickNextFocus(thoughts);
                  if (!next) return;
                  setFocus(next.id);
                  go("/focus");
                }}
              >
                <Focus className="size-4" /> Focus the next thing
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
