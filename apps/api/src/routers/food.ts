import { database } from "@measure/database/client";
import { foods, servings } from "@measure/database/schema/foods";
import { foodSchema } from "@measure/shared/schemas/food";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

const foodRouter = router({
	// Creates a user-scoped food entry with a default 100g serving.
	create: protectedProcedure.input(foodSchema).mutation(async ({ input, ctx }) => {
		return database.transaction(async (tx) => {
			const [food] = await tx
				.insert(foods)
				.values({
					...input,
					userId: ctx.userId,
				})
				.returning();

			const [serving] = await tx
				.insert(servings)
				.values({
					foodId: food.id,
					label: "100g",
					amountGrams: 100,
					isDefault: true,
					sortOrder: 0,
				})
				.returning();

			return { ...food, defaultServing: serving };
		});
	}),

	// Returns all foods created by the authenticated user.
	list: protectedProcedure.query(async ({ ctx }) => {
		const userFoods = await database.select().from(foods).where(eq(foods.userId, ctx.userId));

		return userFoods;
	}),
});

export { foodRouter };
