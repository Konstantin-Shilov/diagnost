import { createFileRoute } from "@tanstack/react-router";

import { ResultPage } from "@/core/pages/Results";

export const Route = createFileRoute("/results/$id")({
  component: () => {
    const { id } = Route.useParams();

    return <ResultPage id={id} />;
  },
});
