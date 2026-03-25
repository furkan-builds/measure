import { router } from "../trpc";
import { authRouter } from "./auth";
import { healthRouter } from "./health";

const appRouter = router({
	auth: authRouter,
	health: healthRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
