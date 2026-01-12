import { createFileRoute } from "@tanstack/react-router";

import { HistoryPage } from "@/core/pages/History";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});
