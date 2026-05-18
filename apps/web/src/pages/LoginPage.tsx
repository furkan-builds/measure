import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { TEST_IDS } from "@/lib/test-ids";
import { loginSchema } from "@measure/shared/schemas/auth";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}

		login.mutate(result.data, {
			onSuccess: () => navigate("/"),
			onError: (err) => setError(err.message),
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Log in</CardTitle>
					<CardDescription>Enter your email and password to continue.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								data-testid={TEST_IDS.LOGIN.EMAIL}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								data-testid={TEST_IDS.LOGIN.PASSWORD}
							/>
						</div>
						{error && (
							<p className="text-sm text-destructive" data-testid={TEST_IDS.LOGIN.ERROR}>
								{error}
							</p>
						)}
						<Button type="submit" disabled={login.isPending} data-testid={TEST_IDS.LOGIN.SUBMIT}>
							{login.isPending ? "Logging in..." : "Log in"}
						</Button>
						<p className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								to="/signup"
								className="text-foreground underline underline-offset-4"
								data-testid={TEST_IDS.LOGIN.SIGNUP_LINK}
							>
								Sign up
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export { LoginPage };
