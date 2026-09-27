import { createFileRoute } from "@tanstack/react-router";
import { ClusterField } from "@/components/cluster-field";

export const Route = createFileRoute("/")({ component: FieldPage });

function FieldPage() {
  return <ClusterField />;
}
