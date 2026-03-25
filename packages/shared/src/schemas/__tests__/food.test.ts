import { describe, expect, it } from "vitest";
import { foodLogEntrySchema, foodSchema } from "../food";

describe("foodSchema", () => {
	it("accepts valid food data", () => {
		const result = foodSchema.safeParse({
			name: "Chicken Breast",
			calories: 165,
			protein: 31,
			carbs: 0,
			fat: 3.6,
			servingSize: 100,
			servingUnit: "g",
		});

		expect(result.success).toBe(true);
	});

	it("rejects negative calories", () => {
		const result = foodSchema.safeParse({
			name: "Invalid",
			calories: -10,
			protein: 0,
			carbs: 0,
			fat: 0,
			servingSize: 100,
			servingUnit: "g",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty name", () => {
		const result = foodSchema.safeParse({
			name: "",
			calories: 100,
			protein: 10,
			carbs: 10,
			fat: 5,
			servingSize: 100,
			servingUnit: "g",
		});

		expect(result.success).toBe(false);
	});
});

describe("foodLogEntrySchema", () => {
	it("accepts valid log entry", () => {
		const result = foodLogEntrySchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			servings: 1.5,
			meal: "lunch",
			loggedAt: "2026-03-25T12:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid meal type", () => {
		const result = foodLogEntrySchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			servings: 1,
			meal: "brunch",
			loggedAt: "2026-03-25T12:00:00Z",
		});

		expect(result.success).toBe(false);
	});
});
