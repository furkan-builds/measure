import { router } from "../trpc";
import { authRouter } from "./auth";
import { foodRouter } from "./food";
import { foodLogRouter } from "./foodLog";
import { healthRouter } from "./health";

const appRouter = router({
	auth: authRouter,
	food: foodRouter,
	foodLog: foodLogRouter,
	health: healthRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
