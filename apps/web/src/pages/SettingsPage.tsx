import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";
import { changePasswordSchema } from "@measure/shared/schemas/auth";
import { type FormEvent, useState } from "react";

const SettingsPage = () => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const changePassword = trpc.auth.changePassword.useMutation({
		onSuccess: () => {
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setError(null);
			setSuccess(true);
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		if (newPassword !== confirmPassword) {
			setError("New passwords do not match");
			return;
		}

		const result = changePasswordSchema.safeParse({ currentPassword, newPassword });
		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}

		changePassword.mutate(result.data, {
			onError: (err) => setError(err.message),
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="current-password">Current Password</Label>
							<Input
								id="current-password"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								data-testid={TEST_IDS.CHANGE_PASSWORD.CURRENT}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="new-password">New Password</Label>
							<Input
								id="new-password"
								type="password"
								placeholder="At least 8 characters"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								data-testid={TEST_IDS.CHANGE_PASSWORD.NEW}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="confirm-password">Confirm New Password</Label>
							<Input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								data-testid={TEST_IDS.CHANGE_PASSWORD.CONFIRM}
							/>
						</div>
						{error && (
							<p className="text-sm text-destructive" data-testid={TEST_IDS.CHANGE_PASSWORD.ERROR}>
								{error}
							</p>
						)}
						{success && (
							<p className="text-sm text-green-600" data-testid={TEST_IDS.CHANGE_PASSWORD.SUCCESS}>
								Password changed successfully
							</p>
						)}
						<Button
							type="submit"
							disabled={changePassword.isPending}
							data-testid={TEST_IDS.CHANGE_PASSWORD.SUBMIT}
						>
							{changePassword.isPending ? "Changing..." : "Change Password"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export { SettingsPage };
