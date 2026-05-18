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
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";
import { type FormEvent, useEffect, useState } from "react";

const WeightGoal = () => {
	const utils = trpc.useUtils();
	const goalQuery = trpc.weight.getGoal.useQuery();
	const latestQuery = trpc.weight.latest.useQuery();
	const [goalWeight, setGoalWeight] = useState("");
	const [goalUnit, setGoalUnit] = useState("kg");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (goalQuery.data?.goalWeight) {
			setGoalWeight(String(goalQuery.data.goalWeight));
			setGoalUnit(goalQuery.data.goalWeightUnit ?? "kg");
		}
	}, [goalQuery.data]);

	const setGoal = trpc.weight.setGoal.useMutation({
		onSuccess: () => {
			utils.weight.getGoal.invalidate();
			setIsEditing(false);
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const value = Number(goalWeight);
		if (value <= 0 || Number.isNaN(value)) return;

		setGoal.mutate({
			goalWeight: value,
			goalWeightUnit: goalUnit as "kg" | "lb",
		});
	};

	const goal = goalQuery.data;
	const latest = latestQuery.data;
	const hasGoal = goal?.goalWeight != null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Goal</CardTitle>
			</CardHeader>
			<CardContent>
				{!isEditing && hasGoal ? (
					<div className="flex flex-col gap-3">
						<div className="flex items-baseline justify-between">
							<div>
								<span className="text-2xl font-bold" data-testid={TEST_IDS.WEIGHT.GOAL}>
									{goal.goalWeight} {goal.goalWeightUnit}
								</span>
								{latest && (
									<span
										className="ml-3 text-sm text-muted-foreground"
										data-testid={TEST_IDS.WEIGHT.LATEST}
									>
										Current: {latest.weight} {latest.unit}
									</span>
								)}
							</div>
							<Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
								Edit
							</Button>
						</div>
						{latest && goal.goalWeight && (
							<p className="text-sm text-muted-foreground">
								{latest.weight > goal.goalWeight
									? `${(latest.weight - goal.goalWeight).toFixed(1)} ${goal.goalWeightUnit} to go`
									: "Goal reached!"}
							</p>
						)}
					</div>
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="goal-weight">Target Weight</Label>
								<Input
									id="goal-weight"
									type="text"
									inputMode="decimal"
									placeholder="e.g. 75"
									value={goalWeight}
									onChange={(e) => setGoalWeight(e.target.value)}
									required
									data-testid={TEST_IDS.WEIGHT.GOAL_INPUT}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="goal-unit">Unit</Label>
								<Select value={goalUnit} onValueChange={setGoalUnit}>
									<SelectTrigger id="goal-unit" data-testid={TEST_IDS.WEIGHT.GOAL_UNIT_SELECT}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="kg">kg</SelectItem>
										<SelectItem value="lb">lb</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={setGoal.isPending}
								data-testid={TEST_IDS.WEIGHT.GOAL_SUBMIT}
							>
								{setGoal.isPending ? "Saving..." : "Set Goal"}
							</Button>
							{hasGoal && (
								<Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
							)}
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
};

export { WeightGoal };
