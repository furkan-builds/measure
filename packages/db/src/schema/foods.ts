import { pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

const mealEnum = pgEnum("meal", ["breakfast", "lunch", "dinner", "snack"]);

const foods = pgTable("foods", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id),
	name: text("name").notNull(),
	calories: real("calories").notNull(),
	protein: real("protein").notNull(),
	carbs: real("carbs").notNull(),
	fat: real("fat").notNull(),
	servingSize: real("serving_size").notNull(),
	servingUnit: text("serving_unit").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const foodLog = pgTable("food_log", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	foodId: uuid("food_id")
		.notNull()
		.references(() => foods.id),
	servings: real("servings").notNull(),
	meal: mealEnum("meal").notNull(),
	loggedAt: timestamp("logged_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export { mealEnum, foods, foodLog };
