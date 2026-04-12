import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { appRouter } from "../app";

// Queued rows — each awaited chain pops the next set of rows.
let mockRowQueue: unknown[][] = [];
let mockInsertCallCount = 0;

// Mock the database module with transaction support.
vi.mock("@measure/database/client", () => {
	const createChainableProxy = (): Record<string, unknown> => {
		const target: Record<string, unknown> = {};

		const proxy = new Proxy(target, {
			get(_obj, prop) {
				if (prop === "then") {
					mockInsertCallCount++;
					const rows = mockRowQueue.shift() ?? [];
					return (resolve: (v: unknown) => void) => resolve(rows);
				}
				return () => proxy;
			},
		});

		return proxy;
	};

	const txProxy = createChainableProxy();

	// database is a plain object (not a Proxy) so its return values aren't
	// intercepted when awaited. Only the chainable query methods use proxies.
	const database = {
		select: () => createChainableProxy(),
		insert: () => createChainableProxy(),
		update: () => createChainableProxy(),
		delete: () => createChainableProxy(),
		transaction: async (fn: (tx: unknown) => unknown) => fn(txProxy),
	};

	return { database };
});

const MOCK_USER_ID = "11111111-1111-1111-1111-111111111111";

const createAuthenticatedCaller = () => {
	return appRouter.createCaller(createMockContext({ userId: MOCK_USER_ID }));
};

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
	it("returns food with a default serving", async () => {
		const mockFood = {
			id: "aaaa-bbbb",
			name: "Banana",
			caloriesPer100g: 89,
			proteinPer100g: 1.1,
			carbsPer100g: 22.8,
			fatPer100g: 0.3,
		};
		const mockServing = {
			id: "cccc-dddd",
			foodId: "aaaa-bbbb",
			label: "100g",
			amountGrams: 100,
			isDefault: true,
			sortOrder: 0,
		};

		// First insert (food) returns mockFood, second insert (serving) returns mockServing.
		mockRowQueue = [[mockFood], [mockServing]];
		mockInsertCallCount = 0;
		const caller = createAuthenticatedCaller();

		const result = await caller.food.create({
			name: "Banana",
			caloriesPer100g: 89,
			proteinPer100g: 1.1,
			carbsPer100g: 22.8,
			fatPer100g: 0.3,
		});

		expect(result).toHaveProperty("defaultServing");
		expect(result.defaultServing).toEqual(mockServing);
		expect(mockInsertCallCount).toBe(2);
	});
});
