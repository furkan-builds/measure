import { randomUUID } from "node:crypto";
import { database } from "@measure/database/client";
import { foodLog, foods, servings } from "@measure/database/schema/foods";
import { users } from "@measure/database/schema/users";
import { hashPassword } from "../../auth/password";
import type { Context } from "../../trpc";

// Creates a real user in the test database and returns its id.
// Generates a unique email by default so tests can run in parallel.
const createTestUser = async (
	overrides?: Partial<{ email: string; name: string; password: string }>,
) => {
	const email = overrides?.email ?? `test-${randomUUID()}@example.com`;
	const name = overrides?.name ?? "Test User";
	const password = overrides?.password ?? "testpassword123";

	const [user] = await database
		.insert(users)
		.values({
			email,
			name,
			passwordHash: await hashPassword(password),
		})
		.returning();

	return user;
};

// Creates a food with a default 100g serving and returns both.
const createTestFood = async (
	userId: string,
	overrides?: Partial<{
		name: string;
		caloriesPer100g: number;
		proteinPer100g: number;
		carbsPer100g: number;
		fatPer100g: number;
	}>,
) => {
	const [food] = await database
		.insert(foods)
		.values({
			name: overrides?.name ?? "Test Food",
			userId,
			caloriesPer100g: overrides?.caloriesPer100g ?? 200,
			proteinPer100g: overrides?.proteinPer100g ?? 20,
			carbsPer100g: overrides?.carbsPer100g ?? 25,
			fatPer100g: overrides?.fatPer100g ?? 5,
		})
		.returning();

	const [serving] = await database
		.insert(servings)
		.values({
			foodId: food.id,
			label: "100g",
			amountGrams: 100,
			isDefault: true,
		})
		.returning();

	return { food, serving };
};

// Creates a quick-add food log entry and returns it.
const createTestFoodLogEntry = async (
	userId: string,
	overrides?: Partial<{
		label: string;
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
		meal: "breakfast" | "lunch" | "dinner" | "snack";
		loggedAt: Date;
	}>,
) => {
	const [entry] = await database
		.insert(foodLog)
		.values({
			userId,
			label: overrides?.label ?? "Test Entry",
			calories: overrides?.calories ?? 300,
			protein: overrides?.protein ?? null,
			carbs: overrides?.carbs ?? null,
			fat: overrides?.fat ?? null,
			meal: overrides?.meal ?? "lunch",
			loggedAt: overrides?.loggedAt ?? new Date(),
		})
		.returning();

	return entry;
};

// Creates a minimal mock context for tRPC callers.
const createMockContext = (overrides?: Partial<Context>): Context => {
	return {
		req: {} as Context["req"],
		res: {
			cookie: () => {},
			clearCookie: () => {},
		} as unknown as Context["res"],
		userId: null,
		...overrides,
	};
};

export { createTestUser, createTestFood, createTestFoodLogEntry, createMockContext };
