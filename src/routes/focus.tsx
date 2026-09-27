import { createFileRoute } from "@tanstack/react-router";
import { FocusStage } from "@/components/focus-stage";

export const Route = createFileRoute("/focus")({ component: FocusPage });

function FocusPage() {
  return <FocusStage />;
}
