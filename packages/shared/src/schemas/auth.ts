import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

type LoginInput = z.infer<typeof loginSchema>;

export { loginSchema };
export type { LoginInput };
