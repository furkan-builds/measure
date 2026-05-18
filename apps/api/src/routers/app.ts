import { router } from "../trpc";
import { authRouter } from "./auth";
import { foodRouter } from "./food";
import { foodLogRouter } from "./foodLog";
import { healthRouter } from "./health";
import { weightRouter } from "./weight";

const appRouter = router({
	auth: authRouter,
	food: foodRouter,
	foodLog: foodLogRouter,
	health: healthRouter,
	weight: weightRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
