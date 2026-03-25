import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { foodLog, foods, mealEnum } from "./schema/foods";
import { users } from "./schema/users";
import { weightLog } from "./schema/weight";

const connectionString = process.env.DATABASE_URL ?? "";
const client = postgres(connectionString);

const db = drizzle(client, { schema: { users, foods, foodLog, mealEnum, weightLog } });
type Database = typeof db;

export { db };
export type { Database };
