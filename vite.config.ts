import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import solid from "vite-plugin-solid";

export default defineConfig(({ isSsrBuild }) => {
  const ssr = isSsrBuild ?? false;
  return {
    plugins: [
      RubyPlugin(),
      solid({
        ssr,
        hot: false,
        solid: {
          generate: ssr ? "ssr" : "dom",
          hydratable: ssr,
        },
      }),
    ],
    esbuild: {
      jsx: "preserve",
      supported: {
        "top-level-await": ssr,
      },
    },
  };
});
