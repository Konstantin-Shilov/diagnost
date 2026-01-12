import { createFileRoute } from "@tanstack/react-router";

import { SurveyPage } from "@/core/pages/Survey";

export const Route = createFileRoute("/survey")({
  component: SurveyPage,
});
