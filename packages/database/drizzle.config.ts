import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(currentDir, "../../apps/api/.env") });

// biome-ignore lint/style/noDefaultExport: drizzle-kit requires default export
export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema/*.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
});
