import { database } from "@measure/database/client";
import { foods } from "@measure/database/schema/foods";
import { foodSchema } from "@measure/shared/schemas/food";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

const foodRouter = router({
	// Creates a user-scoped food entry with a default 100g serving.
	create: protectedProcedure.input(foodSchema).mutation(async ({ input, ctx }) => {
		const [food] = await database
			.insert(foods)
			.values({
				...input,
				userId: ctx.userId,
			})
			.returning();

		return food;
	}),

	// Returns all foods created by the authenticated user.
	list: protectedProcedure.query(async ({ ctx }) => {
		const userFoods = await database.select().from(foods).where(eq(foods.userId, ctx.userId));

		return userFoods;
	}),
});

export { foodRouter };
