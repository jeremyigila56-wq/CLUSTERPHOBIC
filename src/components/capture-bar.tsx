import { useState } from "react";
import { ArrowUp, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMind } from "@/lib/store";
import { nowIso } from "@/lib/time";
import { unclusterDump } from "@/lib/uncluster";

export function CaptureBar() {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const capture = useMind((s) => s.capture);
  const beginTheater = useMind((s) => s.beginTheater);

  async function onSubmit(uncluster: boolean) {
    const text = value.trim();
    if (!text || busy) return;
    if (!uncluster && text.length < 140 && !text.includes("\n")) {
      capture(text);
      setValue("");
      return;
    }
    setBusy(true);
    try {
      const res = await unclusterDump({ data: { dump: text, nowIso: nowIso() } });
      beginTheater(text, res.result, res.ok ? res.source : "local");
      setValue("");
    } catch {
      capture(text);
      setValue("");
      toast("Saved locally.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="border-t border-border bg-card/80 px-3 py-2.5 backdrop-blur-sm sm:px-4"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(false);
      }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <Input
          id="capture-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What’s crowding you?"
          className="h-11 rounded-lg bg-background"
          disabled={busy}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              void onSubmit(true);
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-11 shrink-0"
          disabled={busy || !value.trim()}
          onClick={() => void onSubmit(true)}
          aria-label="Uncluster this"
        >
          <Layers className="size-4" />
        </Button>
        <Button type="submit" size="icon" className="size-11 shrink-0" disabled={busy || !value.trim()} aria-label="Capture">
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </form>
  );
}
