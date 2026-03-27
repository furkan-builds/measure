import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { weightLog } from "../weight";

describe("weightLog schema", () => {
	it("defines a weight_log table", () => {
		expect(getTableName(weightLog)).toBe("weight_log");
	});

	it("has expected columns", () => {
		const columnNames = Object.keys(weightLog);

		expect(columnNames).toContain("id");
		expect(columnNames).toContain("userId");
		expect(columnNames).toContain("weight");
		expect(columnNames).toContain("unit");
		expect(columnNames).toContain("loggedAt");
		expect(columnNames).toContain("createdAt");
	});
});
