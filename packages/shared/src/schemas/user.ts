import { z } from "zod";

const createUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(128),
	name: z.string().min(1).max(100),
});

type CreateUser = z.infer<typeof createUserSchema>;

export { createUserSchema };
export type { CreateUser };
