import { TEST_IDS } from "@/lib/test-ids";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignupPage } from "../SignupPage";

const mockSignup = {
	mutate: vi.fn(),
	isPending: false,
};

vi.mock("@/lib/auth", () => ({
	useAuth: () => ({
		user: null,
		isLoading: false,
		login: { mutate: vi.fn(), isPending: false },
		signup: mockSignup,
		logout: { mutate: vi.fn(), isPending: false },
	}),
}));

const renderSignupPage = () => {
	return render(
		<MemoryRouter>
			<SignupPage />
		</MemoryRouter>,
	);
};

beforeEach(() => {
	mockSignup.mutate.mockReset();
});

describe("SignupPage", () => {
	it("renders the signup form", () => {
		renderSignupPage();

		expect(screen.getByTestId(TEST_IDS.SIGNUP.NAME)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.SIGNUP.EMAIL)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.SIGNUP.PASSWORD)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.SIGNUP.SUBMIT)).toBeInTheDocument();
	});

	it("has a link to the login page", () => {
		renderSignupPage();

		const link = screen.getByTestId(TEST_IDS.SIGNUP.LOGIN_LINK);

		expect(link).toHaveAttribute("href", "/login");
	});

	it("calls signup.mutate with valid input", async () => {
		const user = userEvent.setup();
		renderSignupPage();

		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.NAME), "Test User");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.EMAIL), "test@example.com");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.PASSWORD), "password123");
		await user.click(screen.getByTestId(TEST_IDS.SIGNUP.SUBMIT));

		expect(mockSignup.mutate).toHaveBeenCalledWith(
			{ name: "Test User", email: "test@example.com", password: "password123" },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	it("shows a validation error when password is too short", async () => {
		const user = userEvent.setup();
		renderSignupPage();

		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.NAME), "Test User");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.EMAIL), "test@example.com");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.PASSWORD), "short");
		await user.click(screen.getByTestId(TEST_IDS.SIGNUP.SUBMIT));

		expect(mockSignup.mutate).not.toHaveBeenCalled();

		await waitFor(() => {
			expect(screen.getByTestId(TEST_IDS.SIGNUP.ERROR)).toHaveTextContent(
				"String must contain at least 8 character(s)",
			);
		});
	});

	it("shows a validation error for invalid email", async () => {
		renderSignupPage();

		fireEvent.change(screen.getByTestId(TEST_IDS.SIGNUP.NAME), { target: { value: "Test User" } });
		fireEvent.change(screen.getByTestId(TEST_IDS.SIGNUP.EMAIL), { target: { value: "bad-email" } });
		fireEvent.change(screen.getByTestId(TEST_IDS.SIGNUP.PASSWORD), {
			target: { value: "password123" },
		});
		fireEvent.submit(screen.getByTestId(TEST_IDS.SIGNUP.SUBMIT));

		expect(mockSignup.mutate).not.toHaveBeenCalled();

		await waitFor(() => {
			expect(screen.getByTestId(TEST_IDS.SIGNUP.ERROR)).toHaveTextContent("Invalid email");
		});
	});

	it("displays server errors from the mutation", async () => {
		mockSignup.mutate.mockImplementation(
			(_data: unknown, options: { onError: (err: Error) => void }) => {
				options.onError(new Error("Email already in use"));
			},
		);
		const user = userEvent.setup();
		renderSignupPage();

		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.NAME), "Test User");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.EMAIL), "taken@example.com");
		await user.type(screen.getByTestId(TEST_IDS.SIGNUP.PASSWORD), "password123");
		await user.click(screen.getByTestId(TEST_IDS.SIGNUP.SUBMIT));

		await waitFor(() => {
			expect(screen.getByTestId(TEST_IDS.SIGNUP.ERROR)).toHaveTextContent("Email already in use");
		});
	});
});
