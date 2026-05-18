import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Log in</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Login form coming soon.</p>
				</CardContent>
			</Card>
		</div>
	);
};

export { LoginPage };
