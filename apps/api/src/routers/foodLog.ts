import { database } from "@measure/database/client";
import { foodLog, foods, servings } from "@measure/database/schema/foods";
import {
	deleteFoodLogSchema,
	detailedFoodLogSchema,
	listFoodLogSchema,
	quickFoodLogSchema,
	updateFoodLogSchema,
} from "@measure/shared/schemas/food";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, lt } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

// Adds one day to a Date, returning a new Date.
const addOneDay = (date: Date): Date => {
	const next = new Date(date);
	next.setDate(next.getDate() + 1);
	return next;
};

const foodLogRouter = router({
	// Logs a quick-add entry — just label + calories + optional macros.
	quickAdd: protectedProcedure.input(quickFoodLogSchema).mutation(async ({ input, ctx }) => {
		const [entry] = await database
			.insert(foodLog)
			.values({
				userId: ctx.userId,
				label: input.label,
				calories: input.calories,
				protein: input.protein ?? null,
				carbs: input.carbs ?? null,
				fat: input.fat ?? null,
				meal: input.meal,
				loggedAt: input.loggedAt,
			})
			.returning();

		return entry;
	}),

	// Logs a detailed entry — looks up the food + serving, computes nutrients, and stores them.
	log: protectedProcedure.input(detailedFoodLogSchema).mutation(async ({ input, ctx }) => {
		const [food] = await database.select().from(foods).where(eq(foods.id, input.foodId));

		if (!food) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Food not found" });
		}

		const [serving] = await database
			.select()
			.from(servings)
			.where(eq(servings.id, input.servingId));

		if (!serving) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Serving not found" });
		}

		if (serving.foodId !== food.id) {
			throw new TRPCError({ code: "BAD_REQUEST", message: "Serving does not belong to this food" });
		}

		const grams = serving.amountGrams * input.quantity;
		const multiplier = grams / 100;

		const [entry] = await database
			.insert(foodLog)
			.values({
				userId: ctx.userId,
				label: food.name,
				calories: food.caloriesPer100g * multiplier,
				protein: food.proteinPer100g * multiplier,
				carbs: food.carbsPer100g * multiplier,
				fat: food.fatPer100g * multiplier,
				foodId: food.id,
				servingId: serving.id,
				quantity: input.quantity,
				meal: input.meal,
				loggedAt: input.loggedAt,
			})
			.returning();

		return entry;
	}),

	// Updates an existing food log entry. Only the owner can edit.
	edit: protectedProcedure.input(updateFoodLogSchema).mutation(async ({ input, ctx }) => {
		const { id, ...updates } = input;

		// Filter out undefined values so we only SET columns that were provided.
		const setValues: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(updates)) {
			if (value !== undefined) {
				setValues[key] = value;
			}
		}

		if (Object.keys(setValues).length === 0) {
			throw new TRPCError({ code: "BAD_REQUEST", message: "No fields to update" });
		}

		const [entry] = await database
			.update(foodLog)
			.set(setValues)
			.where(and(eq(foodLog.id, id), eq(foodLog.userId, ctx.userId)))
			.returning();

		if (!entry) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Food log entry not found" });
		}

		return entry;
	}),

	// Deletes a food log entry. Only the owner can remove.
	remove: protectedProcedure.input(deleteFoodLogSchema).mutation(async ({ input, ctx }) => {
		const [entry] = await database
			.delete(foodLog)
			.where(and(eq(foodLog.id, input.id), eq(foodLog.userId, ctx.userId)))
			.returning({ id: foodLog.id });

		if (!entry) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Food log entry not found" });
		}

		return { success: true };
	}),

	// Returns all food log entries for a given date (midnight to midnight).
	list: protectedProcedure.input(listFoodLogSchema).query(async ({ input, ctx }) => {
		const startOfDay = new Date(input.date);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = addOneDay(startOfDay);

		const entries = await database
			.select()
			.from(foodLog)
			.where(
				and(
					eq(foodLog.userId, ctx.userId),
					gte(foodLog.loggedAt, startOfDay),
					lt(foodLog.loggedAt, endOfDay),
				),
			);

		return entries;
	}),
});

export { foodLogRouter };
