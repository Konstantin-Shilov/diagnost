// TanStack Start instance configuration
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => {
  return {
    // Enable SSR by default for public pages (index, about)
    // Routes can override this with meta: { renderMode: 'spa' }
    defaultSsr: true,

    // Request middleware (can be added later for auth, etc.)
    requestMiddleware: [],
  };
});
