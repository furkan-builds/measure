import { describe, expect, it } from "vitest";
import { weightEntrySchema } from "../weight";

describe("weightEntrySchema", () => {
	it("accepts valid kg entry", () => {
		const result = weightEntrySchema.safeParse({
			weight: 75.5,
			unit: "kg",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("accepts valid lb entry", () => {
		const result = weightEntrySchema.safeParse({
			weight: 166.5,
			unit: "lb",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(true);
	});

	it("rejects zero weight", () => {
		const result = weightEntrySchema.safeParse({
			weight: 0,
			unit: "kg",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(false);
	});

	it("rejects negative weight", () => {
		const result = weightEntrySchema.safeParse({
			weight: -5,
			unit: "kg",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(false);
	});

	it("rejects invalid unit", () => {
		const result = weightEntrySchema.safeParse({
			weight: 75,
			unit: "stone",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(false);
	});

	it("coerces date string to Date", () => {
		const result = weightEntrySchema.safeParse({
			weight: 75,
			unit: "kg",
			loggedAt: "2026-03-25T08:00:00Z",
		});

		expect(result.success).toBe(true);
		expect(result.data?.loggedAt).toBeInstanceOf(Date);
	});
});
