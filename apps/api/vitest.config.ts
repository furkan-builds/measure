import { defineConfig } from "vitest/config";
import { testEnv } from "./vitest.env";

// biome-ignore lint/style/noDefaultExport: vitest requires default export
export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/__tests__/**/*.test.ts"],
		globalSetup: "./vitest.global-setup.ts",
		env: testEnv,
	},
});
