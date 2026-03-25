import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

const weightLog = pgTable("weight_log", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	weight: real("weight").notNull(),
	unit: text("unit").notNull(),
	loggedAt: timestamp("logged_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export { weightLog };
