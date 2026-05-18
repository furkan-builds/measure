import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createMockContext, createTestUser } from "../../__tests__/helpers/test-data";
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

describe("food.create", () => {
	it("creates a food with a default 100g serving", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.food.create({
			name: "Banana",
			caloriesPer100g: 89,
			proteinPer100g: 1.1,
			carbsPer100g: 22.8,
			fatPer100g: 0.3,
		});

		expect(result.name).toBe("Banana");
		expect(result.caloriesPer100g).toBe(89);
		expect(result.defaultServing).toBeDefined();
		expect(result.defaultServing.label).toBe("100g");
		expect(result.defaultServing.amountGrams).toBe(100);
		expect(result.defaultServing.isDefault).toBe(true);
		expect(result.defaultServing.foodId).toBe(result.id);
	});
});

describe("food.list", () => {
	it("returns only foods created by the authenticated user", async () => {
		const user1 = await createTestUser();
		const user2 = await createTestUser();

		const caller1 = appRouter.createCaller(createMockContext({ userId: user1.id }));
		const caller2 = appRouter.createCaller(createMockContext({ userId: user2.id }));

		await caller1.food.create({
			name: "Banana",
			caloriesPer100g: 89,
			proteinPer100g: 1.1,
			carbsPer100g: 22.8,
			fatPer100g: 0.3,
		});

		await caller2.food.create({
			name: "Apple",
			caloriesPer100g: 52,
			proteinPer100g: 0.3,
			carbsPer100g: 14,
			fatPer100g: 0.2,
		});

		const user1Foods = await caller1.food.list();
		const user2Foods = await caller2.food.list();

		expect(user1Foods).toHaveLength(1);
		expect(user1Foods[0].name).toBe("Banana");
		expect(user2Foods).toHaveLength(1);
		expect(user2Foods[0].name).toBe("Apple");
	});

	it("returns an empty array when user has no foods", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.food.list();

		expect(result).toEqual([]);
	});
});
