import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { users } from "../users";

describe("users schema", () => {
	it("defines a users table", () => {
		expect(getTableName(users)).toBe("users");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(users);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("email");
		expect(columnNames).toContain("name");
		expect(columnNames).toContain("passwordHash");
		expect(columnNames).toContain("createdAt");
		expect(columnNames).toContain("updatedAt");
	});
});
