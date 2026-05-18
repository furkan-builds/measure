import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const AppLayout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => navigate("/login"),
		});
	};

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
					<span className="text-lg font-bold">Measure</span>
					{user && (
						<div className="flex items-center gap-4">
							<span className="text-sm text-muted-foreground">{user.name}</span>
							<Button variant="ghost" size="sm" onClick={handleLogout}>
								Log out
							</Button>
						</div>
					)}
				</div>
			</header>
			<main className="mx-auto max-w-3xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
};

export { AppLayout };
