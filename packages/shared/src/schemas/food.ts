import { z } from "zod";

const foodSchema = z.object({
	name: z.string().min(1).max(200),
	calories: z.number().nonnegative(),
	protein: z.number().nonnegative(),
	carbs: z.number().nonnegative(),
	fat: z.number().nonnegative(),
	servingSize: z.number().positive(),
	servingUnit: z.string().min(1).max(50),
});

type Food = z.infer<typeof foodSchema>;

const foodLogEntrySchema = z.object({
	foodId: z.string().uuid(),
	servings: z.number().positive(),
	meal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
	loggedAt: z.coerce.date(),
});

type FoodLogEntry = z.infer<typeof foodLogEntrySchema>;

export { foodSchema, foodLogEntrySchema };
export type { Food, FoodLogEntry };
