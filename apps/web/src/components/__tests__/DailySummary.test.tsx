import { TEST_IDS } from "@/lib/test-ids";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DailySummary } from "../DailySummary";

const mockSummaryData = {
	calories: 1250,
	protein: 85.5,
	carbs: 120.3,
	fat: 45.7,
	entryCount: 4,
};

vi.mock("@/lib/trpc", () => ({
	trpc: {
		foodLog: {
			summary: {
				useQuery: () => ({ data: mockSummaryData }),
			},
		},
	},
}));

describe("DailySummary", () => {
	it("renders calorie and macro totals", () => {
		render(<DailySummary date={new Date("2026-05-18")} />);

		expect(screen.getByTestId(TEST_IDS.SUMMARY.CALORIES)).toHaveTextContent("1250");
		expect(screen.getByTestId(TEST_IDS.SUMMARY.PROTEIN)).toHaveTextContent("86g");
		expect(screen.getByTestId(TEST_IDS.SUMMARY.CARBS)).toHaveTextContent("120g");
		expect(screen.getByTestId(TEST_IDS.SUMMARY.FAT)).toHaveTextContent("46g");
	});

	it("renders the entry count", () => {
		render(<DailySummary date={new Date("2026-05-18")} />);

		expect(screen.getByTestId(TEST_IDS.SUMMARY.ENTRY_COUNT)).toHaveTextContent("4 entries");
	});
});
