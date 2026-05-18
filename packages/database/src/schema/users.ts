import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	passwordHash: text("password_hash").notNull(),
	goalWeight: real("goal_weight"),
	goalWeightUnit: text("goal_weight_unit"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export { users };
