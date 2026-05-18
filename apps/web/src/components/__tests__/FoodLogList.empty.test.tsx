import { TEST_IDS } from "@/lib/test-ids";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FoodLogList } from "../FoodLogList";

vi.mock("@/lib/trpc", () => ({
	trpc: {
		useUtils: () => ({
			foodLog: {
				list: { invalidate: vi.fn() },
				summary: { invalidate: vi.fn() },
			},
		}),
		foodLog: {
			list: {
				useQuery: () => ({ data: [] }),
			},
			remove: {
				useMutation: () => ({ mutate: vi.fn(), isPending: false }),
			},
		},
	},
}));

describe("FoodLogList empty state", () => {
	it("shows empty message when there are no entries", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		expect(screen.getByTestId(TEST_IDS.FOOD_LOG.EMPTY)).toBeInTheDocument();
	});
});
