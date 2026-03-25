import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { foodLog, foods, mealEnum } from "../foods";

describe("foods schema", () => {
	it("defines a foods table", () => {
		expect(getTableName(foods)).toBe("foods");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(foods);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("userId");
		expect(columnNames).toContain("name");
		expect(columnNames).toContain("calories");
		expect(columnNames).toContain("protein");
		expect(columnNames).toContain("carbs");
		expect(columnNames).toContain("fat");
		expect(columnNames).toContain("servingSize");
		expect(columnNames).toContain("servingUnit");
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
		expect(columnNames).toContain("foodId");
		expect(columnNames).toContain("servings");
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
