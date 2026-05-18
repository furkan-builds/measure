import { type ReactNode, createContext, useContext } from "react";
import { trpc } from "./trpc";

type User = {
	id: string;
	email: string;
	name: string;
};

type AuthContextValue = {
	user: User | null;
	isLoading: boolean;
	login: ReturnType<typeof trpc.auth.login.useMutation>;
	signup: ReturnType<typeof trpc.auth.signup.useMutation>;
	logout: ReturnType<typeof trpc.auth.logout.useMutation>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

const AuthProvider = (authProviderProps: AuthProviderProps) => {
	const utils = trpc.useUtils();

	const meQuery = trpc.auth.me.useQuery(undefined, {
		retry: false,
	});

	const login = trpc.auth.login.useMutation({
		onSuccess: (data) => utils.auth.me.setData(undefined, data),
	});

	const signup = trpc.auth.signup.useMutation({
		onSuccess: (data) => utils.auth.me.setData(undefined, data),
	});

	const logout = trpc.auth.logout.useMutation({
		onSuccess: () => utils.auth.me.setData(undefined, undefined),
	});

	const value: AuthContextValue = {
		user: meQuery.data ?? null,
		isLoading: meQuery.isLoading,
		login,
		signup,
		logout,
	};

	return <AuthContext.Provider value={value}>{authProviderProps.children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { AuthProvider, useAuth };
