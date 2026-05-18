import { TEST_IDS } from "@/lib/test-ids";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FoodLogList } from "../FoodLogList";

const mockEntries = [
	{
		id: "1",
		label: "Chicken salad",
		calories: 450,
		protein: 35,
		carbs: 20,
		fat: 15,
		meal: "lunch",
		loggedAt: new Date("2026-05-18T12:00:00Z"),
	},
	{
		id: "2",
		label: "Protein shake",
		calories: 200,
		protein: null,
		carbs: null,
		fat: null,
		meal: "snack",
		loggedAt: new Date("2026-05-18T16:00:00Z"),
	},
];

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
				useQuery: () => ({ data: mockEntries }),
			},
			remove: {
				useMutation: () => ({ mutate: vi.fn(), isPending: false }),
			},
			edit: {
				useMutation: () => ({ mutate: vi.fn(), isPending: false }),
			},
		},
	},
}));

describe("FoodLogList", () => {
	it("renders all entries", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		const entries = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY);

		expect(entries).toHaveLength(2);
	});

	it("displays entry labels and calories", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		const labels = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY_LABEL);

		expect(labels[0]).toHaveTextContent("Chicken salad");
		expect(labels[1]).toHaveTextContent("Protein shake");

		const calories = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY_CALORIES);

		expect(calories[0]).toHaveTextContent("450 cal");
		expect(calories[1]).toHaveTextContent("200 cal");
	});

	it("displays meal badges", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		const meals = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY_MEAL);

		expect(meals[0]).toHaveTextContent("lunch");
		expect(meals[1]).toHaveTextContent("snack");
	});

	it("shows macros when present and omits when null", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		const calories = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY_CALORIES);

		expect(calories[0]).toHaveTextContent("35g P");
		expect(calories[0]).toHaveTextContent("20g C");
		expect(calories[0]).toHaveTextContent("15g F");
		expect(calories[1].textContent).not.toContain("g P");
	});

	it("renders a delete button for each entry", () => {
		render(<FoodLogList date={new Date("2026-05-18")} />);

		const deleteButtons = screen.getAllByTestId(TEST_IDS.FOOD_LOG.ENTRY_DELETE);

		expect(deleteButtons).toHaveLength(2);
	});
});
