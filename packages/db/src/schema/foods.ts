import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

const mealEnum = pgEnum("meal", ["breakfast", "lunch", "dinner", "snack"]);

/**
 * Foods table — stores base food info with macros per 100g.
 * userId is null for system foods, set for user-created foods.
 */
const foods = pgTable("foods", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	brand: text("brand"),
	userId: uuid("user_id").references(() => users.id),
	caloriesPer100g: real("calories_per_100g").notNull(),
	proteinPer100g: real("protein_per_100g").notNull(),
	carbsPer100g: real("carbs_per_100g").notNull(),
	fatPer100g: real("fat_per_100g").notNull(),
	fiberPer100g: real("fiber_per_100g"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Servings table — multiple portion sizes per food.
 * Nutrients are derived: food.caloriesPer100g * serving.amountGrams / 100.
 */
const servings = pgTable("servings", {
	id: uuid("id").primaryKey().defaultRandom(),
	foodId: uuid("food_id")
		.notNull()
		.references(() => foods.id),
	label: text("label").notNull(),
	amountGrams: real("amount_grams").notNull(),
	isDefault: boolean("is_default").notNull().default(false),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Food log table — supports two entry modes:
 * - Quick add: label + calories (foodId/servingId/quantity are null)
 * - Detailed: linked to a food + serving (calories/macros computed and stored)
 *
 * Storing computed values on every entry preserves historical accuracy
 * if a food's nutrient data is later edited.
 */
const foodLog = pgTable("food_log", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	label: text("label").notNull(),
	calories: real("calories").notNull(),
	protein: real("protein"),
	carbs: real("carbs"),
	fat: real("fat"),
	foodId: uuid("food_id").references(() => foods.id),
	servingId: uuid("serving_id").references(() => servings.id),
	quantity: real("quantity"),
	meal: mealEnum("meal").notNull(),
	loggedAt: timestamp("logged_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export { mealEnum, foods, servings, foodLog };
