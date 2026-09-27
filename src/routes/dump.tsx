import { createFileRoute } from "@tanstack/react-router";
import { DumpStage } from "@/components/dump-stage";

export const Route = createFileRoute("/dump")({ component: DumpPage });

function DumpPage() {
  return <DumpStage />;
}
