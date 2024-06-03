import { defineConfig } from "tsup";

const env = process.env.NODE_ENV;

export default defineConfig((options) => ({
  treeshake: !options.watch,
  splitting: !options.watch,
  dts: true,
  clean: true,
  outDir: "./lib",
  target: "es2020",
  entry: ["src/index.ts", "src/session.ts"],
  sourcemap: true,
  format: ["esm", "cjs"],
  skipNodeModulesBundle: true, // Skips building dependencies for node modules
  minify: !options.watch && env === "production",
}));
