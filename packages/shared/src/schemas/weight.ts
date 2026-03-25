import { z } from "zod";

const weightEntrySchema = z.object({
	weight: z.number().positive(),
	unit: z.enum(["kg", "lb"]),
	loggedAt: z.coerce.date(),
});

type WeightEntry = z.infer<typeof weightEntrySchema>;

export { weightEntrySchema };
export type { WeightEntry };
