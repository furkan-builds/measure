import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { createMockContext, createTestUser } from "../../__tests__/helpers/test-data";
import { appRouter } from "../app";

describe("auth.changePassword", () => {
	it("rejects unauthenticated calls", async () => {
		const caller = appRouter.createCaller(createMockContext());

		await expect(
			caller.auth.changePassword({ currentPassword: "old", newPassword: "newpassword" }),
		).rejects.toThrow(TRPCError);
	});

	it("changes the password when current password is correct", async () => {
		const user = await createTestUser({ password: "oldpassword123" });
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		const result = await caller.auth.changePassword({
			currentPassword: "oldpassword123",
			newPassword: "newpassword456",
		});

		expect(result.success).toBe(true);
	});

	it("allows logging in with the new password after change", async () => {
		const user = await createTestUser({ password: "oldpassword123" });
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await caller.auth.changePassword({
			currentPassword: "oldpassword123",
			newPassword: "newpassword456",
		});

		const loginCaller = appRouter.createCaller(createMockContext());
		const loginResult = await loginCaller.auth.login({
			email: user.email,
			password: "newpassword456",
		});

		expect(loginResult.id).toBe(user.id);
	});

	it("rejects when current password is wrong", async () => {
		const user = await createTestUser({ password: "correctpassword" });
		const caller = appRouter.createCaller(createMockContext({ userId: user.id }));

		await expect(
			caller.auth.changePassword({
				currentPassword: "wrongpassword",
				newPassword: "newpassword456",
			}),
		).rejects.toThrow("Current password is incorrect");
	});
});
