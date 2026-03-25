import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// biome-ignore lint/style/noDefaultExport: vitest requires default export
export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: "jsdom",
			include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
		},
	}),
);
