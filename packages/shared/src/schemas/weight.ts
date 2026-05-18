import { z } from "zod";

const weightEntrySchema = z.object({
	weight: z.number().positive(),
	unit: z.enum(["kg", "lb"]),
	loggedAt: z.coerce.date(),
});

const weightGoalSchema = z.object({
	goalWeight: z.number().positive(),
	goalWeightUnit: z.enum(["kg", "lb"]),
});

const weightHistorySchema = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});

const deleteWeightEntrySchema = z.object({
	id: z.string().uuid(),
});

type WeightEntry = z.infer<typeof weightEntrySchema>;
type WeightGoal = z.infer<typeof weightGoalSchema>;
type WeightHistory = z.infer<typeof weightHistorySchema>;

export { weightEntrySchema, weightGoalSchema, weightHistorySchema, deleteWeightEntrySchema };
export type { WeightEntry, WeightGoal, WeightHistory };
