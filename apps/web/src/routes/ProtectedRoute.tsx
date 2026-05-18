import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const ProtectedRoute = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-gray-500">Loading...</p>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export { ProtectedRoute };
