import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignupPage = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Sign up</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Signup form coming soon.</p>
				</CardContent>
			</Card>
		</div>
	);
};

export { SignupPage };
