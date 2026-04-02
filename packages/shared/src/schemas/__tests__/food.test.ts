import { describe, expect, it } from "vitest";
import {
	deleteFoodLogSchema,
	detailedFoodLogSchema,
	foodSchema,
	listFoodLogSchema,
	quickFoodLogSchema,
	servingSchema,
	updateFoodLogSchema,
} from "../food";

describe("foodSchema", () => {
	it("accepts valid food data", () => {
		const result = foodSchema.safeParse({
			name: "Chicken Breast",
			caloriesPer100g: 165,
			proteinPer100g: 31,
			carbsPer100g: 0,
			fatPer100g: 3.6,
		});

		expect(result.success).toBe(true);
	});

	it("accepts food with optional brand and fiber", () => {
		const result = foodSchema.safeParse({
			name: "Oats",
			brand: "Quaker",
			caloriesPer100g: 389,
			proteinPer100g: 16.9,
			carbsPer100g: 66.3,
			fatPer100g: 6.9,
			fiberPer100g: 10.6,
		});

		expect(result.success).toBe(true);
	});

	it("rejects negative calories", () => {
		const result = foodSchema.safeParse({
			name: "Invalid",
			caloriesPer100g: -10,
			proteinPer100g: 0,
			carbsPer100g: 0,
			fatPer100g: 0,
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty name", () => {
		const result = foodSchema.safeParse({
			name: "",
			caloriesPer100g: 100,
			proteinPer100g: 10,
			carbsPer100g: 10,
			fatPer100g: 5,
		});

		expect(result.success).toBe(false);
	});
});

describe("servingSchema", () => {
	it("accepts valid serving data", () => {
		const result = servingSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			label: "1 cup",
			amountGrams: 240,
		});

		expect(result.success).toBe(true);
	});

	it("rejects zero amountGrams", () => {
		const result = servingSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			label: "1 slice",
			amountGrams: 0,
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty label", () => {
		const result = servingSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			label: "",
			amountGrams: 100,
		});

		expect(result.success).toBe(false);
	});
});

describe("quickFoodLogSchema", () => {
	it("accepts a quick add with just calories", () => {
		const result = quickFoodLogSchema.safeParse({
			label: "Afternoon snack",
			calories: 350,
			meal: "snack",
			loggedAt: "2026-03-25T14:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("accepts a quick add with optional macros", () => {
		const result = quickFoodLogSchema.safeParse({
			label: "Protein shake",
			calories: 200,
			protein: 30,
			carbs: 10,
			fat: 5,
			meal: "snack",
			loggedAt: "2026-03-25T16:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("rejects missing label", () => {
		const result = quickFoodLogSchema.safeParse({
			calories: 100,
			meal: "lunch",
			loggedAt: "2026-03-25T12:00:00Z",
		});

		expect(result.success).toBe(false);
	});

	it("rejects negative calories", () => {
		const result = quickFoodLogSchema.safeParse({
			label: "Bad entry",
			calories: -50,
			meal: "dinner",
			loggedAt: "2026-03-25T18:00:00Z",
		});

		expect(result.success).toBe(false);
	});
});

describe("detailedFoodLogSchema", () => {
	it("accepts valid detailed log entry", () => {
		const result = detailedFoodLogSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			servingId: "660e8400-e29b-41d4-a716-446655440000",
			quantity: 1.5,
			meal: "lunch",
			loggedAt: "2026-03-25T12:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid meal type", () => {
		const result = detailedFoodLogSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			servingId: "660e8400-e29b-41d4-a716-446655440000",
			quantity: 1,
			meal: "brunch",
			loggedAt: "2026-03-25T12:00:00Z",
		});

		expect(result.success).toBe(false);
	});

	it("rejects zero quantity", () => {
		const result = detailedFoodLogSchema.safeParse({
			foodId: "550e8400-e29b-41d4-a716-446655440000",
			servingId: "660e8400-e29b-41d4-a716-446655440000",
			quantity: 0,
			meal: "dinner",
			loggedAt: "2026-03-25T18:00:00Z",
		});

		expect(result.success).toBe(false);
	});
});

describe("updateFoodLogSchema", () => {
	it("accepts a partial update with just calories", () => {
		const result = updateFoodLogSchema.safeParse({
			id: "550e8400-e29b-41d4-a716-446655440000",
			calories: 300,
		});

		expect(result.success).toBe(true);
	});

	it("accepts a partial update with multiple fields", () => {
		const result = updateFoodLogSchema.safeParse({
			id: "550e8400-e29b-41d4-a716-446655440000",
			label: "Updated snack",
			calories: 250,
			meal: "dinner",
		});

		expect(result.success).toBe(true);
	});

	it("rejects missing id", () => {
		const result = updateFoodLogSchema.safeParse({
			calories: 300,
		});

		expect(result.success).toBe(false);
	});

	it("rejects invalid id", () => {
		const result = updateFoodLogSchema.safeParse({
			id: "not-a-uuid",
			calories: 300,
		});

		expect(result.success).toBe(false);
	});
});

describe("deleteFoodLogSchema", () => {
	it("accepts a valid id", () => {
		const result = deleteFoodLogSchema.safeParse({
			id: "550e8400-e29b-41d4-a716-446655440000",
		});

		expect(result.success).toBe(true);
	});

	it("rejects an invalid id", () => {
		const result = deleteFoodLogSchema.safeParse({
			id: "not-a-uuid",
		});

		expect(result.success).toBe(false);
	});
});

describe("listFoodLogSchema", () => {
	it("accepts a date string", () => {
		const result = listFoodLogSchema.safeParse({
			date: "2026-03-25",
		});

		expect(result.success).toBe(true);
	});

	it("coerces a string to a Date", () => {
		const result = listFoodLogSchema.safeParse({
			date: "2026-03-25T00:00:00Z",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.date).toBeInstanceOf(Date);
		}
	});
});
