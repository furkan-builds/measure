import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createToken, verifyToken } from "../jwt";

describe("JWT utilities", () => {
	beforeEach(() => {
		vi.stubEnv("JWT_SECRET", "test-secret-key-for-testing-only");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("creates a token", async () => {
		const token = await createToken("user-123");

		expect(token).toBeDefined();
		expect(typeof token).toBe("string");
		expect(token.split(".")).toHaveLength(3); // JWT has 3 parts: header.payload.signature
	});

	it("verifies a valid token and returns the userId", async () => {
		const token = await createToken("user-123");
		const userId = await verifyToken(token);

		expect(userId).toBe("user-123");
	});

	it("returns null for an invalid token", async () => {
		const userId = await verifyToken("not-a-real-token");

		expect(userId).toBeNull();
	});

	it("returns null for a tampered token", async () => {
		const token = await createToken("user-123");
		const tampered = `${token}x`;
		const userId = await verifyToken(tampered);

		expect(userId).toBeNull();
	});
});
