import { TEST_IDS } from "@/lib/test-ids";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "../LoginPage";

const mockLogin = {
	mutate: vi.fn(),
	isPending: false,
};

vi.mock("@/lib/auth", () => ({
	useAuth: () => ({
		user: null,
		isLoading: false,
		login: mockLogin,
		signup: { mutate: vi.fn(), isPending: false },
		logout: { mutate: vi.fn(), isPending: false },
	}),
}));

const renderLoginPage = () => {
	return render(
		<MemoryRouter>
			<LoginPage />
		</MemoryRouter>,
	);
};

beforeEach(() => {
	mockLogin.mutate.mockReset();
});

describe("LoginPage", () => {
	it("renders the login form", () => {
		renderLoginPage();

		expect(screen.getByTestId(TEST_IDS.LOGIN.EMAIL)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.LOGIN.PASSWORD)).toBeInTheDocument();
		expect(screen.getByTestId(TEST_IDS.LOGIN.SUBMIT)).toBeInTheDocument();
	});

	it("has a link to the signup page", () => {
		renderLoginPage();

		const link = screen.getByTestId(TEST_IDS.LOGIN.SIGNUP_LINK);

		expect(link).toHaveAttribute("href", "/signup");
	});

	it("calls login.mutate with valid credentials", async () => {
		const user = userEvent.setup();
		renderLoginPage();

		await user.type(screen.getByTestId(TEST_IDS.LOGIN.EMAIL), "test@example.com");
		await user.type(screen.getByTestId(TEST_IDS.LOGIN.PASSWORD), "password123");
		await user.click(screen.getByTestId(TEST_IDS.LOGIN.SUBMIT));

		expect(mockLogin.mutate).toHaveBeenCalledWith(
			{ email: "test@example.com", password: "password123" },
			expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
		);
	});

	it("shows a validation error for invalid email", async () => {
		renderLoginPage();

		fireEvent.change(screen.getByTestId(TEST_IDS.LOGIN.EMAIL), {
			target: { value: "not-an-email" },
		});
		fireEvent.change(screen.getByTestId(TEST_IDS.LOGIN.PASSWORD), {
			target: { value: "password123" },
		});
		fireEvent.submit(screen.getByTestId(TEST_IDS.LOGIN.SUBMIT));

		expect(mockLogin.mutate).not.toHaveBeenCalled();

		await waitFor(() => {
			expect(screen.getByTestId(TEST_IDS.LOGIN.ERROR)).toHaveTextContent("Invalid email");
		});
	});

	it("displays server errors from the mutation", async () => {
		mockLogin.mutate.mockImplementation(
			(_data: unknown, options: { onError: (err: Error) => void }) => {
				options.onError(new Error("Invalid email or password"));
			},
		);
		const user = userEvent.setup();
		renderLoginPage();

		await user.type(screen.getByTestId(TEST_IDS.LOGIN.EMAIL), "test@example.com");
		await user.type(screen.getByTestId(TEST_IDS.LOGIN.PASSWORD), "wrongpassword");
		await user.click(screen.getByTestId(TEST_IDS.LOGIN.SUBMIT));

		await waitFor(() => {
			expect(screen.getByTestId(TEST_IDS.LOGIN.ERROR)).toHaveTextContent(
				"Invalid email or password",
			);
		});
	});
});
