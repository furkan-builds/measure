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
import { quickFoodLogSchema } from "@measure/shared/schemas/food";
import { type FormEvent, useState } from "react";

type QuickAddFormProps = {
	date: Date;
	onSuccess?: () => void;
};

const MEALS = ["breakfast", "lunch", "dinner", "snack"] as const;

const QuickAddForm = (quickAddFormProps: QuickAddFormProps) => {
	const utils = trpc.useUtils();
	const [label, setLabel] = useState("");
	const [calories, setCalories] = useState("");
	const [protein, setProtein] = useState("");
	const [carbs, setCarbs] = useState("");
	const [fat, setFat] = useState("");
	const [meal, setMeal] = useState<string>("lunch");
	const [error, setError] = useState<string | null>(null);

	const quickAdd = trpc.foodLog.quickAdd.useMutation({
		onSuccess: () => {
			utils.foodLog.list.invalidate({ date: quickAddFormProps.date });
			utils.foodLog.summary.invalidate({ date: quickAddFormProps.date });
			setLabel("");
			setCalories("");
			setProtein("");
			setCarbs("");
			setFat("");
			setError(null);
			quickAddFormProps.onSuccess?.();
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const input = {
			label,
			calories: Number(calories),
			protein: protein ? Number(protein) : null,
			carbs: carbs ? Number(carbs) : null,
			fat: fat ? Number(fat) : null,
			meal: meal as (typeof MEALS)[number],
			loggedAt: quickAddFormProps.date,
		};

		const result = quickFoodLogSchema.safeParse(input);
		if (!result.success) {
			setError(result.error.issues[0].message);
			return;
		}

		quickAdd.mutate(result.data, {
			onError: (err) => setError(err.message),
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Add</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2 flex flex-col gap-1.5">
							<Label htmlFor="quick-add-label">Label</Label>
							<Input
								id="quick-add-label"
								placeholder="e.g. Chicken salad"
								value={label}
								onChange={(e) => setLabel(e.target.value)}
								required
								data-testid={TEST_IDS.QUICK_ADD.LABEL}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quick-add-calories">Calories</Label>
							<Input
								id="quick-add-calories"
								type="number"
								min="0"
								placeholder="0"
								value={calories}
								onChange={(e) => setCalories(e.target.value)}
								required
								data-testid={TEST_IDS.QUICK_ADD.CALORIES}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quick-add-meal">Meal</Label>
							<Select value={meal} onValueChange={setMeal} data-testid={TEST_IDS.QUICK_ADD.MEAL}>
								<SelectTrigger id="quick-add-meal" data-testid={TEST_IDS.QUICK_ADD.MEAL}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MEALS.map((m) => (
										<SelectItem key={m} value={m}>
											{m.charAt(0).toUpperCase() + m.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quick-add-protein">Protein (g)</Label>
							<Input
								id="quick-add-protein"
								type="number"
								min="0"
								placeholder="Optional"
								value={protein}
								onChange={(e) => setProtein(e.target.value)}
								data-testid={TEST_IDS.QUICK_ADD.PROTEIN}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quick-add-carbs">Carbs (g)</Label>
							<Input
								id="quick-add-carbs"
								type="number"
								min="0"
								placeholder="Optional"
								value={carbs}
								onChange={(e) => setCarbs(e.target.value)}
								data-testid={TEST_IDS.QUICK_ADD.CARBS}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="quick-add-fat">Fat (g)</Label>
							<Input
								id="quick-add-fat"
								type="number"
								min="0"
								placeholder="Optional"
								value={fat}
								onChange={(e) => setFat(e.target.value)}
								data-testid={TEST_IDS.QUICK_ADD.FAT}
							/>
						</div>
					</div>
					{error && (
						<p className="text-sm text-destructive" data-testid={TEST_IDS.QUICK_ADD.ERROR}>
							{error}
						</p>
					)}
					<Button
						type="submit"
						disabled={quickAdd.isPending}
						data-testid={TEST_IDS.QUICK_ADD.SUBMIT}
					>
						{quickAdd.isPending ? "Adding..." : "Add Entry"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export { QuickAddForm };
