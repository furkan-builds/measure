import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { testEnv } from "./vitest.env";

// Runs once before all test files.
// Applies pending migrations, then truncates all tables for a clean slate.
const setup = async () => {
	const client = postgres(testEnv.DATABASE_URL, { max: 1 });
	const db = drizzle(client);

	const currentDir = path.dirname(fileURLToPath(import.meta.url));
	const migrationsFolder = path.resolve(currentDir, "../../packages/database/drizzle");

	await migrate(db, { migrationsFolder });
	await db.execute(
		sql`TRUNCATE TABLE food_log, servings, foods, weight_log, users CASCADE`,
	);
	await client.end();
};

// biome-ignore lint/style/noDefaultExport: vitest requires default export
export default setup;
