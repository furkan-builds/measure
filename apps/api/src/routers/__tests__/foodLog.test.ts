import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { appRouter } from "../app";

// Rows that the mock database will resolve with on the next query.
let mockRows: unknown[] = [];

// Mock the database module so we can control query results without a real DB.
// Every chainable method returns a Promise that resolves to mockRows.
vi.mock("@measure/database/client", () => {
	const createChainablePromise = (): Record<string, unknown> => {
		const target: Record<string, unknown> = {};

		const proxy = new Proxy(target, {
			get(_obj, prop) {
				// Allow awaiting the chain — resolves to the current mockRows.
				if (prop === "then") {
					return (resolve: (v: unknown) => void) => resolve(mockRows);
				}
				// Any other property returns a function that continues the chain.
				return () => proxy;
			},
		});

		return proxy;
	};

	return {
		database: createChainablePromise(),
	};
});

const MOCK_USER_ID = "11111111-1111-1111-1111-111111111111";

const createAuthenticatedCaller = () => {
	return appRouter.createCaller(createMockContext({ userId: MOCK_USER_ID }));
};

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

describe("foodLog.summary", () => {
	it("returns aggregated totals for a day with entries", async () => {
		mockRows = [
			{
				totalCalories: "850",
				totalProtein: "65.5",
				totalCarbs: "90.2",
				totalFat: "30.1",
				entryCount: 3,
			},
		];
		const caller = createAuthenticatedCaller();

		const result = await caller.foodLog.summary({ date: new Date("2026-03-25") });

		expect(result).toEqual({
			calories: 850,
			protein: 65.5,
			carbs: 90.2,
			fat: 30.1,
			entryCount: 3,
		});
	});

	it("returns zeros when no entries exist for the day", async () => {
		mockRows = [
			{
				totalCalories: null,
				totalProtein: null,
				totalCarbs: null,
				totalFat: null,
				entryCount: 0,
			},
		];
		const caller = createAuthenticatedCaller();

		const result = await caller.foodLog.summary({ date: new Date("2026-03-25") });

		expect(result).toEqual({
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
			entryCount: 0,
		});
	});

	it("handles entries with only calories (no macros)", async () => {
		mockRows = [
			{
				totalCalories: "400",
				totalProtein: null,
				totalCarbs: null,
				totalFat: null,
				entryCount: 2,
			},
		];
		const caller = createAuthenticatedCaller();

		const result = await caller.foodLog.summary({ date: new Date("2026-03-25") });

		expect(result).toEqual({
			calories: 400,
			protein: 0,
			carbs: 0,
			fat: 0,
			entryCount: 2,
		});
	});
});

describe("foodLog.loggedDates", () => {
	it("returns an array of date strings within the range", async () => {
		mockRows = [{ date: "2026-03-15" }, { date: "2026-03-17" }, { date: "2026-03-22" }];
		const caller = createAuthenticatedCaller();

		const result = await caller.foodLog.loggedDates({
			from: new Date("2026-03-01"),
			to: new Date("2026-03-31"),
		});

		expect(result).toEqual(["2026-03-15", "2026-03-17", "2026-03-22"]);
	});

	it("returns an empty array when no entries exist in range", async () => {
		mockRows = [];
		const caller = createAuthenticatedCaller();

		const result = await caller.foodLog.loggedDates({
			from: new Date("2026-03-01"),
			to: new Date("2026-03-31"),
		});

		expect(result).toEqual([]);
	});
});
