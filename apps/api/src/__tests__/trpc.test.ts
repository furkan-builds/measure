import { describe, expect, it } from "vitest";
import { createMockContext } from "../__mocks__/context.mock";
import { publicProcedure, router } from "../trpc";

describe("trpc", () => {
	it("exports a router function", () => {
		expect(router).toBeDefined();
		expect(typeof router).toBe("function");
	});

	it("exports a publicProcedure", () => {
		expect(publicProcedure).toBeDefined();
	});

	it("can create a working router with a procedure", async () => {
		const testRouter = router({
			ping: publicProcedure.query(() => "pong"),
		});
		const caller = testRouter.createCaller(createMockContext());
		const result = await caller.ping();

		expect(result).toBe("pong");
	});
});
