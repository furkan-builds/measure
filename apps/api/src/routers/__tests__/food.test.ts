import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { appRouter } from "../app";

describe("foodRouter", () => {
	it("is mounted on the app router", () => {
		const caller = appRouter.createCaller(createMockContext());

		expect(caller.food).toBeDefined();
	});

	it("rejects unauthenticated create calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.food.create({
				name: "Banana",
				caloriesPer100g: 89,
				proteinPer100g: 1.1,
				carbsPer100g: 22.8,
				fatPer100g: 0.3,
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated list calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(caller.food.list()).rejects.toThrow(TRPCError);
	});
});
