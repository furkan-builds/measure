import { describe, expect, it } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { healthRouter } from "../health";

describe("healthRouter", () => {
	it("returns ok status", async () => {
		const caller = healthRouter.createCaller(createMockContext());
		const result = await caller.check();

		expect(result).toEqual({ status: "ok" });
	});
});
