import { createFileRoute } from "@tanstack/react-router";
import { ReviewStage } from "@/components/review-stage";

export const Route = createFileRoute("/review")({ component: ReviewPage });

function ReviewPage() {
  return <ReviewStage />;
}
