import { TEST_IDS } from "@/lib/test-ids";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuickAddForm } from "../QuickAddForm";

const mockQuickAdd = {
	mutate: vi.fn(),
	isPending: false,
};

vi.mock("@/lib/trpc", () => ({
	trpc: {
		useUtils: () => ({
			foodLog: {
				list: { invalidate: vi.fn() },
				summary: { invalidate: vi.fn() },
			},
		}),
		foodLog: {
			quickAdd: {
				useMutation: (opts: { onSuccess?: () => void }) => {
					mockQuickAdd.mutate.mockImplementation(() => opts.onSuccess?.());
					return mockQuickAdd;
				},
			},
		},
	},
}));

describe("QuickAddForm", () => {
	it("renders all form fields", () => {
		render(<QuickAddForm date={new Date("2026-05-18")} />);

		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.LABEL)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.CALORIES)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.MEAL)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.PROTEIN)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.CARBS)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.FAT)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.QUICK_ADD.SUBMIT)).toBeInTheDocument();
	});

	it("submits with valid input", async () => {
		const user = userEvent.setup();
		render(<QuickAddForm date={new Date("2026-05-18")} />);

		await user.type(screen.getByTestId(TEST_IDS.QUICK_ADD.LABEL), "Chicken salad");
		await user.type(screen.getByTestId(TEST_IDS.QUICK_ADD.CALORIES), "450");
		await user.click(screen.getByTestId(TEST_IDS.QUICK_ADD.SUBMIT));

		expect(mockQuickAdd.mutate).toHaveBeenCalled();
	});
});
