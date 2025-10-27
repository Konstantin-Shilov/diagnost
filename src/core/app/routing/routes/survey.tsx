import { createFileRoute } from "@tanstack/react-router";

import { SurveyContainer } from "@/components/Survey";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});

function SurveyPage() {
  return <SurveyContainer />;
}
