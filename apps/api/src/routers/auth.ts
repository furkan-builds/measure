import { db } from "@measure/db/client";
import { users } from "@measure/db/schema/users";
import { loginSchema } from "@measure/shared/schemas/auth";
import { createUserSchema } from "@measure/shared/schemas/user";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createToken } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../auth/password";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const TOKEN_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
	path: "/",
};

const authRouter = router({
	// Creates a new user account, hashes the password, and sets a JWT cookie.
	signup: publicProcedure.input(createUserSchema).mutation(async ({ input, ctx }) => {
		const existing = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, input.email));

		if (existing.length > 0) {
			throw new TRPCError({ code: "CONFLICT", message: "Email already in use" });
		}

		const passwordHash = await hashPassword(input.password);

		const [user] = await db
			.insert(users)
			.values({
				email: input.email,
				name: input.name,
				passwordHash,
			})
			.returning({ id: users.id, email: users.email, name: users.name });

		const token = await createToken(user.id);
		ctx.res.cookie("token", token, TOKEN_COOKIE_OPTIONS);

		return { id: user.id, email: user.email, name: user.name };
	}),

	// Validates credentials and sets a JWT cookie.
	login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
		const [user] = await db.select().from(users).where(eq(users.email, input.email));

		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
		}

		const valid = await verifyPassword(input.password, user.passwordHash);

		if (!valid) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
		}

		const token = await createToken(user.id);
		ctx.res.cookie("token", token, TOKEN_COOKIE_OPTIONS);

		return { id: user.id, email: user.email, name: user.name };
	}),

	// Clears the JWT cookie.
	logout: publicProcedure.mutation(async ({ ctx }) => {
		ctx.res.clearCookie("token", { path: "/" });
		return { success: true };
	}),

	// Returns the current authenticated user's info.
	me: protectedProcedure.query(async ({ ctx }) => {
		const [user] = await db
			.select({ id: users.id, email: users.email, name: users.name })
			.from(users)
			.where(eq(users.id, ctx.userId));

		if (!user) {
			throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
		}

		return user;
	}),
});

export { authRouter };
