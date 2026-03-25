import { describe, expect, it } from "vitest";
import { healthRouter } from "../health";

describe("healthRouter", () => {
	it("returns ok status", async () => {
		const caller = healthRouter.createCaller({});
		const result = await caller.check();

		expect(result).toEqual({ status: "ok" });
	});
});
