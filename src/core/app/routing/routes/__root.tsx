import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type ReactNode } from "react";

import { NotFound } from "@/common/shared/ui/NotFound";
import { Preloader } from "@/common/shared/ui/Preloader";
import { MainLayout } from "@/core/layout/MainLayout";

// Глобальные стили
import "@/core/app/styles/reset.css";
import "@/core/app/styles/spacing.css";
import "@/core/app/styles/global.css";
import "@/core/app/styles/font.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge,chrome=1" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, minimal-ui, viewport-fit=cover",
      },
      { name: "theme-color", content: "#007bff" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        as: "style",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  component: () => (
    <RootDocument>
      <MainLayout>
        <Outlet />
      </MainLayout>
      <TanStackRouterDevtools />
    </RootDocument>
  ),
  notFoundComponent: NotFound,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <title>Диагностика выгорания</title>
        <HeadContent />
      </head>
      <body>
        <Preloader />
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
