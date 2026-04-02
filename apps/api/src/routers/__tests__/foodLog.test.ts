import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createMockContext } from "../../__mocks__/context.mock";
import { appRouter } from "../app";

describe("foodLogRouter", () => {
	it("is mounted on the app router", () => {
		const caller = appRouter.createCaller(createMockContext());

		expect(caller.foodLog).toBeDefined();
	});

	it("rejects unauthenticated quickAdd calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.quickAdd({
				label: "Snack",
				calories: 200,
				meal: "snack",
				loggedAt: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated log calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.log({
				foodId: "00000000-0000-0000-0000-000000000000",
				servingId: "00000000-0000-0000-0000-000000000000",
				quantity: 1,
				meal: "lunch",
				loggedAt: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated edit calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.edit({
				id: "00000000-0000-0000-0000-000000000000",
				calories: 300,
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated remove calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.remove({
				id: "00000000-0000-0000-0000-000000000000",
			}),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated list calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.foodLog.list({
				date: new Date(),
			}),
		).rejects.toThrow(TRPCError);
	});
});
