import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: vitest requires default export
export default defineConfig({
	test: {
		environment: "jsdom",
		include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
	},
});
