import { describe, expect, it } from "vitest";
import { createUserSchema } from "../user";

describe("createUserSchema", () => {
	it("accepts valid user data", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "securepass123",
			name: "Jane Doe",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid email", () => {
		const result = createUserSchema.safeParse({
			email: "not-an-email",
			password: "securepass123",
			name: "Jane Doe",
		});

		expect(result.success).toBe(false);
	});

	it("rejects password shorter than 8 characters", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "short",
			name: "Jane Doe",
		});

		expect(result.success).toBe(false);
	});

	it("rejects password longer than 128 characters", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "a".repeat(129),
			name: "Jane Doe",
		});

		expect(result.success).toBe(false);
	});

	it("accepts password at exactly 8 characters", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "12345678",
			name: "Jane Doe",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "securepass123",
			name: "",
		});

		expect(result.success).toBe(false);
	});

	it("rejects name longer than 100 characters", () => {
		const result = createUserSchema.safeParse({
			email: "test@example.com",
			password: "securepass123",
			name: "a".repeat(101),
		});

		expect(result.success).toBe(false);
	});
});
