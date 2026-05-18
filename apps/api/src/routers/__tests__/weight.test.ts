import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createMockContext, createTestUser } from "../../__tests__/helpers/test-data";
import { appRouter } from "../app";

describe("weightRouter", () => {
	it("is mounted on the app router", () => {
		const caller = appRouter.createCaller(createMockContext());

		expect(caller.weight).toBeDefined();
	});

	it("rejects unauthenticated log calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.weight.log({ weight: 80, unit: "kg", loggedAt: new Date() }),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated list calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.weight.list({ from: new Date("2026-01-01"), to: new Date("2026-12-31") }),
		).rejects.toThrow(TRPCError);
	});

	it("rejects unauthenticated setGoal calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(caller.weight.setGoal({ goalWeight: 75, goalWeightUnit: "kg" })).rejects.toThrow(
			TRPCError,
		);
	});
});

describe("weight.log", () => {
	it("creates a weight entry", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.weight.log({
			weight: 82.5,
			unit: "kg",
			loggedAt: new Date("2026-05-18T08:00:00Z"),
		});

		expect(result.weight).toBe(82.5);
		expect(result.unit).toBe("kg");
		expect(result.userId).toBe(user.id);
	});

	it("updates the existing entry when logging twice on the same day", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await caller.weight.log({
			weight: 82,
			unit: "kg",
			loggedAt: new Date("2026-05-18T08:00:00Z"),
		});

		const updated = await caller.weight.log({
			weight: 81.5,
			unit: "kg",
			loggedAt: new Date("2026-05-18T20:00:00Z"),
		});

		expect(updated.weight).toBe(81.5);

		const entries = await caller.weight.list({
			from: new Date("2026-05-18"),
			to: new Date("2026-05-18T23:59:59Z"),
		});

		expect(entries).toHaveLength(1);
	});
});

describe("weight.list", () => {
	it("returns entries within the date range", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await caller.weight.log({ weight: 83, unit: "kg", loggedAt: new Date("2026-05-10T08:00:00Z") });
		await caller.weight.log({ weight: 82, unit: "kg", loggedAt: new Date("2026-05-15T08:00:00Z") });
		await caller.weight.log({ weight: 81, unit: "kg", loggedAt: new Date("2026-05-20T08:00:00Z") });

		const result = await caller.weight.list({
			from: new Date("2026-05-01"),
			to: new Date("2026-05-16"),
		});

		expect(result).toHaveLength(2);
		expect(result[0].weight).toBe(82);
		expect(result[1].weight).toBe(83);
	});

	it("does not return other users' entries", async () => {
		const user1 = await createTestUser();
		const user2 = await createTestUser();
		const caller1 = appRouter.createCaller(createMockContext({ userId: user1.id }));
		const caller2 = appRouter.createCaller(createMockContext({ userId: user2.id }));

		await caller1.weight.log({
			weight: 80,
			unit: "kg",
			loggedAt: new Date("2026-05-10T08:00:00Z"),
		});

		const result = await caller2.weight.list({
			from: new Date("2026-05-01"),
			to: new Date("2026-05-31"),
		});

		expect(result).toHaveLength(0);
	});
});

describe("weight.remove", () => {
	it("deletes an entry", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const entry = await caller.weight.log({
			weight: 80,
			unit: "kg",
			loggedAt: new Date("2026-05-18T08:00:00Z"),
		});

		const result = await caller.weight.remove({ id: entry.id });

		expect(result.success).toBe(true);
	});

	it("rejects deleting another user's entry", async () => {
		const user1 = await createTestUser();
		const user2 = await createTestUser();
		const caller1 = appRouter.createCaller(createMockContext({ userId: user1.id }));
		const caller2 = appRouter.createCaller(createMockContext({ userId: user2.id }));

		const entry = await caller1.weight.log({
			weight: 80,
			unit: "kg",
			loggedAt: new Date("2026-05-18T08:00:00Z"),
		});

		await expect(caller2.weight.remove({ id: entry.id })).rejects.toThrow("Weight entry not found");
	});
});

describe("weight.latest", () => {
	it("returns the most recent entry", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await caller.weight.log({ weight: 83, unit: "kg", loggedAt: new Date("2026-05-10T08:00:00Z") });
		await caller.weight.log({ weight: 81, unit: "kg", loggedAt: new Date("2026-05-18T08:00:00Z") });

		const result = await caller.weight.latest();

		expect(result?.weight).toBe(81);
	});

	it("returns null when no entries exist", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.weight.latest();

		expect(result).toBeNull();
	});
});

describe("weight.setGoal and weight.getGoal", () => {
	it("sets and retrieves a goal weight", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await caller.weight.setGoal({ goalWeight: 75, goalWeightUnit: "kg" });
		const result = await caller.weight.getGoal();

		expect(result.goalWeight).toBe(75);
		expect(result.goalWeightUnit).toBe("kg");
	});

	it("returns null when no goal is set", async () => {
		const user = await createTestUser();
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.weight.getGoal();

		expect(result.goalWeight).toBeNull();
		expect(result.goalWeightUnit).toBeNull();
	});
});
