import { describe, expect, it } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { appRouter } from "../app";

describe("appRouter", () => {
	it("has a health router", () => {
		const caller = appRouter.createCaller(createMockContext());

		expect(caller.health).toBeDefined();
	});

	it("can call health.check through the app router", async () => {
		const caller = appRouter.createCaller(createMockContext());
		const result = await caller.health.check();

		expect(result).toEqual({ status: "ok" });
	});
});
