import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { TEST_IDS } from "@/lib/test-ids";
import { createUserSchema } from "@measure/shared/schemas/user";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const result = createUserSchema.safeParse({ email, password, name });
		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}

		signup.mutate(result.data, {
			onSuccess: () => navigate("/"),
			onError: (err) => setError(err.message),
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Sign up</CardTitle>
					<CardDescription>Create an account to get started.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								data-testid={TEST_IDS.SIGNUP.NAME}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								data-testid={TEST_IDS.SIGNUP.EMAIL}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="At least 8 characters"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								data-testid={TEST_IDS.SIGNUP.PASSWORD}
							/>
						</div>
						{error && (
							<p className="text-sm text-destructive" data-testid={TEST_IDS.SIGNUP.ERROR}>
								{error}
							</p>
						)}
						<Button type="submit" disabled={signup.isPending} data-testid={TEST_IDS.SIGNUP.SUBMIT}>
							{signup.isPending ? "Creating account..." : "Sign up"}
						</Button>
						<p className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-foreground underline underline-offset-4"
								data-testid={TEST_IDS.SIGNUP.LOGIN_LINK}
							>
								Log in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export { SignupPage };
