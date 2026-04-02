import { router } from "../trpc";
import { authRouter } from "./auth";
import { foodRouter } from "./food";
import { healthRouter } from "./health";

const appRouter = router({
	auth: authRouter,
	food: foodRouter,
	health: healthRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
