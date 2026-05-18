import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/lib/auth";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { WeightPage } from "@/pages/WeightPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route element={<ProtectedRoute />}>
						<Route element={<AppLayout />}>
							<Route path="/" element={<DashboardPage />} />
							<Route path="/weight" element={<WeightPage />} />
						</Route>
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export { App };
