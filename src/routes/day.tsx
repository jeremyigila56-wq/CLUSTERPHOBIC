import { createFileRoute } from "@tanstack/react-router";
import { DaySpine } from "@/components/day-spine";

export const Route = createFileRoute("/day")({ component: DayPage });

function DayPage() {
  return <DaySpine />;
}
