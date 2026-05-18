import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import {
	createMockContext,
	createTestFood,
	createTestFoodLogEntry,
	createTestUser,
} from "../../__tests__/helpers/test-data";
import { appRouter } from "../app";

describe("foodLogRouter", () => {
	it("is mounted on the app router", () => {
		const caller = appRouter.createCaller(createMockContext());

		expect(caller.foodLog).toBeDefined();
	});

	it("rejects unauthenticated quickAdd calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.quickAdd({
				label: "Snack",
				calories: 200,
				meal: "snack",
				loggedAt: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated log calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.log({
				foodId: "00000000-0000-0000-0000-000000000000",
				servingId: "00000000-0000-0000-0000-000000000000",
				quantity: 1,
				meal: "lunch",
				loggedAt: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated edit calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.edit({
				id: "00000000-0000-0000-0000-000000000000",
				calories: 300,
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated remove calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.remove({
				id: "00000000-0000-0000-0000-000000000000",
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated list calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.list({
				date: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated summary calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.summary({
				date: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated loggedDates calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.loggedDates({
				from: new Date("2026-03-01"),
				to: new Date("2026-03-31"),
			}),
		).rejects.toThrow(TRPCError);
	});
});

describe("foodLog.quickAdd", () => {
	it("creates a quick-add entry with just calories", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.quickAdd({
			label: "Afternoon snack",
			calories: 350,
			meal: "snack",
			loggedAt: new Date("2026-04-10T14:00:00Z"),
		});

		expect(result.label).toBe("Afternoon snack");
		expect(result.calories).toBe(350);
		expect(result.meal).toBe("snack");
		expect(result.protein).toBeNull();
		expect(result.carbs).toBeNull();
		expect(result.fat).toBeNull();
	});

	it("creates a quick-add entry with macros", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.quickAdd({
			label: "Protein shake",
			calories: 200,
			protein: 30,
			carbs: 10,
			fat: 5,
			meal: "snack",
			loggedAt: new Date("2026-04-10T16:00:00Z"),
		});

		expect(result.protein).toBe(30);
		expect(result.carbs).toBe(10);
		expect(result.fat).toBe(5);
	});
});

describe("foodLog.log", () => {
	it("creates a detailed entry from food and serving", async () => {
		const user = await createTestUser();
		const { food, serving } = await createTestFood(user.id, {
			name: "Chicken Breast",
			caloriesPer100g: 165,
			proteinPer100g: 31,
			carbsPer100g: 0,
			fatPer100g: 3.6,
		});
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.log({
			foodId: food.id,
			servingId: serving.id,
			quantity: 2,
			meal: "lunch",
			loggedAt: new Date("2026-04-10T12:00:00Z"),
		});

		// 2 servings of 100g = 200g, so nutrients are 2x the per-100g values.
		expect(result.label).toBe("Chicken Breast");
		expect(result.calories).toBe(330);
		expect(result.protein).toBe(62);
		expect(result.carbs).toBe(0);
		expect(result.fat).toBeCloseTo(7.2);
	});

	it("rejects a non-existent food", async () => {
		const user = await createTestUser();
		const { serving } = await createTestFood(user.id);
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await expect(
			caller.foodLog.log({
				foodId: "00000000-0000-0000-0000-000000000000",
				servingId: serving.id,
				quantity: 1,
				meal: "lunch",
				loggedAt: new Date(),
			}),
		).rejects.toThrow("Food not found");
	});

	it("rejects a serving that doesn't belong to the food", async () => {
		const user = await createTestUser();
		const { food: food1 } = await createTestFood(user.id, { name: "Food A" });
		const { serving: serving2 } = await createTestFood(user.id, { name: "Food B" });
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await expect(
			caller.foodLog.log({
				foodId: food1.id,
				servingId: serving2.id,
				quantity: 1,
				meal: "lunch",
				loggedAt: new Date(),
			}),
		).rejects.toThrow("Serving does not belong to this food");
	});
});

describe("foodLog.edit", () => {
	it("updates an existing entry", async () => {
		const user = await createTestUser();
		const entry = await createTestFoodLogEntry(user.id, { calories: 300 });
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.edit({
			id: entry.id,
			calories: 450,
			meal: "dinner",
		});

		expect(result.calories).toBe(450);
		expect(result.meal).toBe("dinner");
	});

	it("rejects editing another user's entry", async () => {
		const user1 = await createTestUser();
		const user2 = await createTestUser();
		const entry = await createTestFoodLogEntry(user1.id);
		const caller2 = appRouter.createCaller(createMockContext({ userId: user2.id }));

		await expect(
			caller2.foodLog.edit({ id: entry.id, calories: 999 }),
		).rejects.toThrow("Food log entry not found");
	});
});

describe("foodLog.remove", () => {
	it("deletes an existing entry", async () => {
		const user = await createTestUser();
		const entry = await createTestFoodLogEntry(user.id);
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.remove({ id: entry.id });

		expect(result.success).toBe(true);

		// Verify it's actually gone.
		const entries = await caller.foodLog.list({ date: new Date() });

		expect(entries).toHaveLength(0);
	});

	it("rejects removing another user's entry", async () => {
		const user1 = await createTestUser();
		const user2 = await createTestUser();
		const entry = await createTestFoodLogEntry(user1.id);
		const caller2 = appRouter.createCaller(createMockContext({ userId: user2.id }));

		await expect(
			caller2.foodLog.remove({ id: entry.id }),
		).rejects.toThrow("Food log entry not found");
	});
});

describe("foodLog.list", () => {
	it("returns entries for a specific date", async () => {
		const user = await createTestUser();
		await createTestFoodLogEntry(user.id, {
			label: "Breakfast",
			loggedAt: new Date("2026-04-10T08:00:00Z"),
		});
		await createTestFoodLogEntry(user.id, {
			label: "Lunch",
			loggedAt: new Date("2026-04-10T12:00:00Z"),
		});
		await createTestFoodLogEntry(user.id, {
			label: "Other day",
			loggedAt: new Date("2026-04-11T08:00:00Z"),
		});
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.list({ date: new Date("2026-04-10") });

		expect(result).toHaveLength(2);
		const labels = result.map((e) => e.label);

		expect(labels).toContain("Breakfast");
		expect(labels).toContain("Lunch");
	});
});

describe("foodLog.summary", () => {
	it("returns aggregated totals for a day with entries", async () => {
		const user = await createTestUser();
		const date = new Date("2026-04-10T12:00:00Z");
		await createTestFoodLogEntry(user.id, {
			calories: 400,
			protein: 30,
			carbs: 40,
			fat: 10,
			loggedAt: date,
		});
		await createTestFoodLogEntry(user.id, {
			calories: 450,
			protein: 35.5,
			carbs: 50.2,
			fat: 20.1,
			loggedAt: date,
		});
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.summary({ date: new Date("2026-04-10") });

		expect(result.calories).toBe(850);
		expect(result.protein).toBeCloseTo(65.5);
		expect(result.carbs).toBeCloseTo(90.2);
		expect(result.fat).toBeCloseTo(30.1);
		expect(result.entryCount).toBe(2);
	});

	it("returns zeros when no entries exist for the day", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.summary({ date: new Date("2026-04-10") });

		expect(result).toEqual({
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
			entryCount: 0,
		});
	});

	it("handles entries with only calories (no macros)", async () => {
		const user = await createTestUser();
		await createTestFoodLogEntry(user.id, {
			calories: 200,
			loggedAt: new Date("2026-04-10T10:00:00Z"),
		});
		await createTestFoodLogEntry(user.id, {
			calories: 200,
			loggedAt: new Date("2026-04-10T14:00:00Z"),
		});
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.summary({ date: new Date("2026-04-10") });

		expect(result.calories).toBe(400);
		expect(result.protein).toBe(0);
		expect(result.carbs).toBe(0);
		expect(result.fat).toBe(0);
		expect(result.entryCount).toBe(2);
	});
});

describe("foodLog.loggedDates", () => {
	it("returns dates that have entries within the range", async () => {
		const user = await createTestUser();
		await createTestFoodLogEntry(user.id, {
			loggedAt: new Date("2026-04-10T12:00:00Z"),
		});
		await createTestFoodLogEntry(user.id, {
			loggedAt: new Date("2026-04-12T08:00:00Z"),
		});
		// Two entries on the same day should produce only one date.
		await createTestFoodLogEntry(user.id, {
			loggedAt: new Date("2026-04-12T18:00:00Z"),
		});
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.loggedDates({
			from: new Date("2026-04-01"),
			to: new Date("2026-04-30"),
		});

		expect(result).toHaveLength(2);
		expect(result).toContain("2026-04-10");
		expect(result).toContain("2026-04-12");
	});

	it("returns an empty array when no entries exist in range", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.foodLog.loggedDates({
			from: new Date("2026-04-01"),
			to: new Date("2026-04-30"),
		});

		expect(result).toEqual([]);
	});
});
