import { router } from "../trpc";
import { healthRouter } from "./health";

const appRouter = router({
	health: healthRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
