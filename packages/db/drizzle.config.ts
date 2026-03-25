import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: drizzle-kit requires default export
export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
});
