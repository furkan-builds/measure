import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password hashing", () => {
	it("hashes a password", async () => {
		const hash = await hashPassword("mypassword");

		expect(hash).toBeDefined();
		expect(hash).not.toBe("mypassword");
	});

	it("produces different hashes for the same password (random salt)", async () => {
		const hash1 = await hashPassword("mypassword");
		const hash2 = await hashPassword("mypassword");

		expect(hash1).not.toBe(hash2);
	});

	it("verifies a correct password", async () => {
		const hash = await hashPassword("mypassword");
		const result = await verifyPassword("mypassword", hash);

		expect(result).toBe(true);
	});

	it("rejects an incorrect password", async () => {
		const hash = await hashPassword("mypassword");
		const result = await verifyPassword("wrongpassword", hash);

		expect(result).toBe(false);
	});
});
