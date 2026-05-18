import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link, Outlet, useNavigate } from "react-router-dom";

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
					<div className="flex items-center gap-6">
						<span className="text-lg font-bold">Measure</span>
						<nav className="flex items-center gap-4">
							<Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
								Food
							</Link>
							<Link to="/weight" className="text-sm text-muted-foreground hover:text-foreground">
								Weight
							</Link>
						</nav>
					</div>
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
