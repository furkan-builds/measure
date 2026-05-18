import { TEST_IDS } from "@/lib/test-ids";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateNavigation } from "../DateNavigation";

describe("DateNavigation", () => {
	it("displays 'Today' when the date is today", () => {
		render(<DateNavigation date={new Date()} onDateChange={vi.fn()} />);

		expect(screen.getByTestId(TEST_IDS.DATE_NAV.LABEL)).toHaveTextContent("Today");
	});

	it("displays 'Yesterday' when the date is yesterday", () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		render(<DateNavigation date={yesterday} onDateChange={vi.fn()} />);

		expect(screen.getByTestId(TEST_IDS.DATE_NAV.LABEL)).toHaveTextContent("Yesterday");
	});

	it("displays a formatted date for other days", () => {
		render(<DateNavigation date={new Date("2026-03-15")} onDateChange={vi.fn()} />);

		const label = screen.getByTestId(TEST_IDS.DATE_NAV.LABEL).textContent;

		expect(label).toContain("Mar");
		expect(label).toContain("15");
	});

	it("calls onDateChange with the previous day when clicking Previous", async () => {
		const user = userEvent.setup();
		const onDateChange = vi.fn();
		const date = new Date("2026-05-18");
		render(<DateNavigation date={date} onDateChange={onDateChange} />);

		await user.click(screen.getByTestId(TEST_IDS.DATE_NAV.PREV));

		expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
		const newDate = onDateChange.mock.calls[0][0] as Date;

		expect(newDate.getDate()).toBe(17);
	});

	it("calls onDateChange with the next day when clicking Next", async () => {
		const user = userEvent.setup();
		const onDateChange = vi.fn();
		const date = new Date("2026-05-17");
		render(<DateNavigation date={date} onDateChange={onDateChange} />);

		await user.click(screen.getByTestId(TEST_IDS.DATE_NAV.NEXT));

		expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
		const newDate = onDateChange.mock.calls[0][0] as Date;

		expect(newDate.getDate()).toBe(18);
	});

	it("disables the Next button when the date is today", () => {
		render(<DateNavigation date={new Date()} onDateChange={vi.fn()} />);

		expect(screen.getByTestId(TEST_IDS.DATE_NAV.NEXT)).toBeDisabled();
	});

	it("shows a Today button when viewing a past date", () => {
		const pastDate = new Date("2026-05-01");
		render(<DateNavigation date={pastDate} onDateChange={vi.fn()} />);

		expect(screen.getByTestId(TEST_IDS.DATE_NAV.TODAY)).toBeInTheDocument();
	});

	it("hides the Today button when viewing today", () => {
		render(<DateNavigation date={new Date()} onDateChange={vi.fn()} />);

		expect(screen.queryByTestId(TEST_IDS.DATE_NAV.TODAY)).not.toBeInTheDocument();
	});
});
