import { describe, expect, it } from "vitest";
import { loginSchema } from "../auth";

describe("loginSchema", () => {
	it("accepts valid login credentials", () => {
		const result = loginSchema.safeParse({
			email: "test@example.com",
			password: "mypassword",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid email", () => {
		const result = loginSchema.safeParse({
			email: "not-an-email",
			password: "mypassword",
		});

		expect(result.success).toBe(false);
	});

	it("rejects empty password", () => {
		const result = loginSchema.safeParse({
			email: "test@example.com",
			password: "",
		});

		expect(result.success).toBe(false);
	});
});
