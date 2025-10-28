import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Проверяем, что мы на GitHub Pages
const isGitHubPages = !import.meta.env.DEV &&
  (window.location.hostname.includes('github.io') || window.location.hostname.includes('github.com'));

export const router = createRouter({
  routeTree,
  basepath: isGitHubPages ? "/diagnost" : "/"
});
