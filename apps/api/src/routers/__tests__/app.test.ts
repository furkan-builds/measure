import { describe, expect, it } from "vitest";
import { appRouter } from "../app";

describe("appRouter", () => {
	it("has a health router", () => {
		const caller = appRouter.createCaller({});

		expect(caller.health).toBeDefined();
	});

	it("can call health.check through the app router", async () => {
		const caller = appRouter.createCaller({});
		const result = await caller.health.check();

		expect(result).toEqual({ status: "ok" });
	});
});
