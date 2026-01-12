import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/core/pages/About";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
