import { z } from "zod";

const mealValues = ["breakfast", "lunch", "dinner", "snack"] as const;

const foodSchema = z.object({
	name: z.string().min(1).max(200),
	brand: z.string().max(200).nullable().optional(),
	caloriesPer100g: z.number().nonnegative(),
	proteinPer100g: z.number().nonnegative(),
	carbsPer100g: z.number().nonnegative(),
	fatPer100g: z.number().nonnegative(),
	fiberPer100g: z.number().nonnegative().nullable().optional(),
});

const servingSchema = z.object({
	foodId: z.string().uuid(),
	label: z.string().min(1).max(100),
	amountGrams: z.number().positive(),
	isDefault: z.boolean().default(false),
	sortOrder: z.number().int().nonnegative().default(0),
});

const quickFoodLogSchema = z.object({
	label: z.string().min(1).max(200),
	calories: z.number().nonnegative(),
	protein: z.number().nonnegative().nullable().optional(),
	carbs: z.number().nonnegative().nullable().optional(),
	fat: z.number().nonnegative().nullable().optional(),
	meal: z.enum(mealValues),
	loggedAt: z.coerce.date(),
});

const detailedFoodLogSchema = z.object({
	foodId: z.string().uuid(),
	servingId: z.string().uuid(),
	quantity: z.number().positive(),
	meal: z.enum(mealValues),
	loggedAt: z.coerce.date(),
});

type Food = z.infer<typeof foodSchema>;
type Serving = z.infer<typeof servingSchema>;
type QuickFoodLogEntry = z.infer<typeof quickFoodLogSchema>;
type DetailedFoodLogEntry = z.infer<typeof detailedFoodLogSchema>;

export { mealValues, foodSchema, servingSchema, quickFoodLogSchema, detailedFoodLogSchema };
export type { Food, Serving, QuickFoodLogEntry, DetailedFoodLogEntry };
