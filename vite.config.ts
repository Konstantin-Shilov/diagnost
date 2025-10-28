import postcssGlobalData from "@csstools/postcss-global-data";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import sri from "@vividlemon/vite-plugin-sri";
// import fs from "fs";
import { resolve } from "path";
import postcssCustomMedia from "postcss-custom-media";
import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import { createHtmlPlugin } from "vite-plugin-html";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ mode }) => {
  const isDev = mode === "development";
  const publicDir = "src/common/shared/public";

  // Проверяем, что это билд для GitHub Pages
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS || process.env.CI;

  return {
    base: isGitHubPagesBuild ? "/diagnost/" : "/",
    publicDir,
    plugins: [
      svgr({
        include: "**/*.svg",
      }),

      // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/core/app/routing/routes",
        generatedRouteTree: "./src/core/app/routing/routeTree.gen.ts",
      }),
      react(),

      tsconfigPaths(),
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
        protocol: "wss",
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
