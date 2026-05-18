import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(8).max(128),
});

type LoginInput = z.infer<typeof loginSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export { loginSchema, changePasswordSchema };
export type { LoginInput, ChangePasswordInput };
