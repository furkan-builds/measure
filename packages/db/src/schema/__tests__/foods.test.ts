import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { foodLog, foods, mealEnum, servings } from "../foods";

describe("foods schema", () => {
	it("defines a foods table", () => {
		expect(getTableName(foods)).toBe("foods");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(foods);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("name");
		expect(columnNames).toContain("brand");
		expect(columnNames).toContain("userId");
		expect(columnNames).toContain("caloriesPer100g");
		expect(columnNames).toContain("proteinPer100g");
		expect(columnNames).toContain("carbsPer100g");
		expect(columnNames).toContain("fatPer100g");
		expect(columnNames).toContain("fiberPer100g");
		expect(columnNames).toContain("createdAt");
		expect(columnNames).toContain("updatedAt");
	});
});

describe("servings schema", () => {
	it("defines a servings table", () => {
		expect(getTableName(servings)).toBe("servings");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(servings);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("foodId");
		expect(columnNames).toContain("label");
		expect(columnNames).toContain("amountGrams");
		expect(columnNames).toContain("isDefault");
		expect(columnNames).toContain("sortOrder");
		expect(columnNames).toContain("createdAt");
	});
});

describe("foodLog schema", () => {
	it("defines a food_log table", () => {
		expect(getTableName(foodLog)).toBe("food_log");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(foodLog);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("userId");
		expect(columnNames).toContain("label");
		expect(columnNames).toContain("calories");
		expect(columnNames).toContain("protein");
		expect(columnNames).toContain("carbs");
		expect(columnNames).toContain("fat");
		expect(columnNames).toContain("foodId");
		expect(columnNames).toContain("servingId");
		expect(columnNames).toContain("quantity");
		expect(columnNames).toContain("meal");
		expect(columnNames).toContain("loggedAt");
		expect(columnNames).toContain("createdAt");
	});
});

describe("mealEnum", () => {
	it("defines the meal enum values", () => {
		expect(mealEnum.enumValues).toEqual(["breakfast", "lunch", "dinner", "snack"]);
	});
});
