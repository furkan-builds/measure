import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken } from "./auth/jwt";

// Context is created for every incoming request.
// It extracts the JWT from the cookie and resolves the userId.
const createContext = async ({ req, res }: CreateExpressContextOptions) => {
	const token = req.cookies?.token as string | undefined;
	const userId = token ? await verifyToken(token) : null;

	return { req, res, userId };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const router = t.router;

// Anyone can call this — no auth required.
const publicProcedure = t.procedure;

// Only authenticated users can call this.
// Throws UNAUTHORIZED if no valid token is present.
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
	}

	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export { createContext, router, publicProcedure, protectedProcedure };
export type { Context };
