import postcssGlobalData from "@csstools/postcss-global-data";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import sri from "@vividlemon/vite-plugin-sri";
// import fs from "fs";
import { resolve } from "path";
import postcssCustomMedia from "postcss-custom-media";
import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import { createHtmlPlugin } from "vite-plugin-html";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  // const isDev = mode === "development";
  const publicDir = "src/common/shared/public";

  const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

  return {
    base: isGitHubPagesBuild ? "/diagnost" : "/",
    publicDir,
    plugins: [
      svgr({
        include: "**/*.svg",
      }),

      tsConfigPaths(),
      tanstackStart({
        router: {
          entry: "./core/app/routing/router.tsx",
          routesDirectory: "./core/app/routing/routes",
          generatedRouteTree: "./core/app/routing/routeTree.gen.ts",
        },
      }),
      // react's vite plugin must come after start's vite plugin
      viteReact(),

      createHtmlPlugin({
        minify: false,
        inject: {
          data: {},
          ejsOptions: {
            filename: "index.html",
          },
        },
      }),
      sri(),

      // analyzer({
      //   analyzerPort: 8500,
      // }),
    ],
    css: {
      postcss: {
        plugins: [
          // Both PostCSS plugins are used to implement custom variables for media queries
          postcssGlobalData({
            files: ["./src/core/app/styles/breakpoints.pcss"],
          }),
          postcssCustomMedia(),
        ],
      },
    },
    build: {
      outDir: resolve(__dirname, "./build"),
      assetsInlineLimit: 0,
    },
    define: {},
    server: {
      host: true,
      port: 9000,
      cors: true,
      hmr: {
        protocol: "ws",
        host: "localhost",
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/vitest.setup.ts"],
    },
  };
});
