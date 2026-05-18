import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { evaluateMathExpression } from "@/lib/math";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";
import { weightEntrySchema } from "@measure/shared/schemas/weight";
import { type FocusEvent, type FormEvent, useEffect, useState } from "react";

const isToday = (date: string | Date): boolean => {
	const d = new Date(date);
	const now = new Date();
	return (
		d.getFullYear() === now.getFullYear() &&
		d.getMonth() === now.getMonth() &&
		d.getDate() === now.getDate()
	);
};

const WeightLogForm = () => {
	const utils = trpc.useUtils();
	const latestQuery = trpc.weight.latest.useQuery();
	const [weight, setWeight] = useState("");
	const [unit, setUnit] = useState("kg");
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [previousEntry, setPreviousEntry] = useState<{
		weight: number;
		unit: string;
		loggedAt: string | Date;
	} | null>(null);

	const todayEntry =
		latestQuery.data && isToday(latestQuery.data.loggedAt) ? latestQuery.data : null;

	useEffect(() => {
		if (todayEntry) {
			setWeight(String(todayEntry.weight));
			setUnit(todayEntry.unit);
		}
	}, [todayEntry]);

	const logWeight = trpc.weight.log.useMutation({
		onSuccess: () => {
			utils.weight.list.invalidate();
			utils.weight.latest.invalidate();
			if (!todayEntry) {
				setWeight("");
			}
			setIsEditing(false);
			setError(null);
		},
	});

	const handleMathBlur = (e: FocusEvent<HTMLInputElement>) => {
		const result = evaluateMathExpression(e.target.value);
		if (result !== null) {
			setWeight(String(result));
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const input = {
			weight: Number(weight),
			unit: unit as "kg" | "lb",
			loggedAt: new Date(),
		};

		const result = weightEntrySchema.safeParse(input);
		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}

		if (todayEntry) {
			setPreviousEntry({
				weight: todayEntry.weight,
				unit: todayEntry.unit,
				loggedAt: todayEntry.loggedAt,
			});
		}

		logWeight.mutate(result.data, {
			onError: (err) => setError(err.message),
		});
	};

	const handleUndo = () => {
		if (!previousEntry) return;

		logWeight.mutate(
			{
				weight: previousEntry.weight,
				unit: previousEntry.unit as "kg" | "lb",
				loggedAt: new Date(previousEntry.loggedAt),
			},
			{
				onSuccess: () => {
					utils.weight.list.invalidate();
					utils.weight.latest.invalidate();
					setPreviousEntry(null);
				},
			},
		);
	};

	const showForm = !todayEntry || isEditing;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{todayEntry ? "Today's Weight" : "Log Weight"}</CardTitle>
			</CardHeader>
			{showForm ? (
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="weight-input">Weight</Label>
								<Input
									id="weight-input"
									type="text"
									inputMode="decimal"
									placeholder="e.g. 80.5"
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
									onBlur={handleMathBlur}
									required
									data-testid={TEST_IDS.WEIGHT.WEIGHT_INPUT}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="weight-unit">Unit</Label>
								<Select value={unit} onValueChange={setUnit}>
									<SelectTrigger id="weight-unit" data-testid={TEST_IDS.WEIGHT.UNIT_SELECT}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="kg">kg</SelectItem>
										<SelectItem value="lb">lb</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{error && (
							<p className="text-sm text-destructive" data-testid={TEST_IDS.WEIGHT.ERROR}>
								{error}
							</p>
						)}
						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={logWeight.isPending}
								data-testid={TEST_IDS.WEIGHT.SUBMIT}
							>
								{logWeight.isPending ? "Saving..." : todayEntry ? "Update Weight" : "Log Weight"}
							</Button>
							{todayEntry && (
								<Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			) : (
				<CardContent>
					<div className="flex items-baseline justify-between">
						<div>
							<span className="text-2xl font-bold" data-testid={TEST_IDS.WEIGHT.LATEST}>
								{todayEntry.weight} {todayEntry.unit}
							</span>
							<span className="ml-3 text-sm text-muted-foreground">
								logged at{" "}
								{new Date(todayEntry.loggedAt).toLocaleTimeString("en-GB", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
						<div className="flex items-center gap-1">
							{previousEntry && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleUndo}
									disabled={logWeight.isPending}
								>
									Undo
								</Button>
							)}
							<Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
								Edit
							</Button>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
};

export { WeightLogForm };
