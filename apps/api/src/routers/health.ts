import { publicProcedure, router } from "../trpc";

const healthRouter = router({
	check: publicProcedure.query(() => {
		return { status: "ok" };
	}),
});

export { healthRouter };
