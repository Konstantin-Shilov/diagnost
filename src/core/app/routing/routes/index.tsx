import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/core/pages/Main";

export const Route = createFileRoute("/")({
  component: HomePage,
});
