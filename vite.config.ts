import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [RubyPlugin(), solid()],
  esbuild: {
    jsx: "preserve",
  },
});
