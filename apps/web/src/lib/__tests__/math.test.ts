import { describe, expect, it } from "vitest";
import { evaluateMathExpression } from "../math";

describe("evaluateMathExpression", () => {
	it("returns a plain number as-is", () => {
		expect(evaluateMathExpression("152")).toBe(152);
	});

	it("returns a decimal number as-is", () => {
		expect(evaluateMathExpression("16.5")).toBe(16.5);
	});

	it("evaluates multiplication", () => {
		expect(evaluateMathExpression("152 * 3")).toBe(456);
	});

	it("evaluates division", () => {
		expect(evaluateMathExpression("152 / 3")).toBe(50.67);
	});

	it("evaluates addition", () => {
		expect(evaluateMathExpression("100 + 50")).toBe(150);
	});

	it("evaluates subtraction", () => {
		expect(evaluateMathExpression("200 - 50")).toBe(150);
	});

	it("respects operator precedence", () => {
		expect(evaluateMathExpression("10 + 5 * 3")).toBe(25);
	});

	it("handles chained operations", () => {
		expect(evaluateMathExpression("100 + 200 + 50")).toBe(350);
	});

	it("handles mixed operations with precedence", () => {
		expect(evaluateMathExpression("10 + 20 * 2 - 5")).toBe(45);
	});

	it("handles expressions without spaces", () => {
		expect(evaluateMathExpression("152*3")).toBe(456);
	});

	it("returns null for empty string", () => {
		expect(evaluateMathExpression("")).toBeNull();
	});

	it("returns null for invalid expressions", () => {
		expect(evaluateMathExpression("abc")).toBeNull();
	});

	it("returns null for division by zero", () => {
		expect(evaluateMathExpression("100 / 0")).toBeNull();
	});

	it("handles decimals in expressions", () => {
		expect(evaluateMathExpression("16.5 * 2")).toBe(33);
	});
});
