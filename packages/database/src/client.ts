import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { foodLog, foods, mealEnum, servings } from "./schema/foods";
import { users } from "./schema/users";
import { weightLog } from "./schema/weight";

const connectionString = process.env.DATABASE_URL ?? "";
const client = postgres(connectionString);

const database = drizzle(client, {
	schema: { users, foods, servings, foodLog, mealEnum, weightLog },
});
type Database = typeof database;

export { database };
export type { Database };
