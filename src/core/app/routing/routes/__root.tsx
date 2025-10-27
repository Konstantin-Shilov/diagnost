import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { NotFound } from "@/common/shared/ui/NotFound";
import { MainLayout } from "@/core/layout/MainLayout";

export const Route = createRootRoute({
  head: () => {
    return {
      meta: [
        {
          title: "App Name",
        },
      ],
    };
  },
  component: () => (
    <>
      <HeadContent />
      <MainLayout>
        <Outlet />
      </MainLayout>
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFound,
});
