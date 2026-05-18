import { database } from "@measure/database/client";
import { users } from "@measure/database/schema/users";
import { weightLog } from "@measure/database/schema/weight";
import {
	deleteWeightEntrySchema,
	weightEntrySchema,
	weightGoalSchema,
	weightHistorySchema,
} from "@measure/shared/schemas/weight";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

const weightRouter = router({
	log: protectedProcedure.input(weightEntrySchema).mutation(async ({ input, ctx }) => {
		const [entry] = await database
			.insert(weightLog)
			.values({
				userId: ctx.userId,
				weight: input.weight,
				unit: input.unit,
				loggedAt: input.loggedAt,
			})
			.returning();

		return entry;
	}),

	list: protectedProcedure.input(weightHistorySchema).query(async ({ input, ctx }) => {
		const entries = await database
			.select()
			.from(weightLog)
			.where(
				and(
					eq(weightLog.userId, ctx.userId),
					gte(weightLog.loggedAt, input.from),
					lte(weightLog.loggedAt, input.to),
				),
			)
			.orderBy(desc(weightLog.loggedAt));

		return entries;
	}),

	remove: protectedProcedure.input(deleteWeightEntrySchema).mutation(async ({ input, ctx }) => {
		const [deleted] = await database
			.delete(weightLog)
			.where(and(eq(weightLog.id, input.id), eq(weightLog.userId, ctx.userId)))
			.returning();

		if (!deleted) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Weight entry not found" });
		}

		return { success: true as const };
	}),

	latest: protectedProcedure.query(async ({ ctx }) => {
		const [entry] = await database
			.select()
			.from(weightLog)
			.where(eq(weightLog.userId, ctx.userId))
			.orderBy(desc(weightLog.loggedAt))
			.limit(1);

		return entry ?? null;
	}),

	setGoal: protectedProcedure.input(weightGoalSchema).mutation(async ({ input, ctx }) => {
		const [updated] = await database
			.update(users)
			.set({
				goalWeight: input.goalWeight,
				goalWeightUnit: input.goalWeightUnit,
				updatedAt: new Date(),
			})
			.where(eq(users.id, ctx.userId))
			.returning({ goalWeight: users.goalWeight, goalWeightUnit: users.goalWeightUnit });

		return updated;
	}),

	getGoal: protectedProcedure.query(async ({ ctx }) => {
		const [user] = await database
			.select({ goalWeight: users.goalWeight, goalWeightUnit: users.goalWeightUnit })
			.from(users)
			.where(eq(users.id, ctx.userId));

		return {
			goalWeight: user.goalWeight,
			goalWeightUnit: user.goalWeightUnit,
		};
	}),
});

export { weightRouter };
