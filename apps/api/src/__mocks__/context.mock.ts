import type { Context } from "../trpc";

// Creates a minimal mock context for testing tRPC procedures.
// Provides a fake req/res so procedures can run without a real HTTP server.
const createMockContext = (overrides?: Partial<Context>): Context => {
	return {
		req: {} as Context["req"],
		res: {
			cookie: () => {},
			clearCookie: () => {},
		} as unknown as Context["res"],
		userId: null,
		...overrides,
	};
};

export { createMockContext };
