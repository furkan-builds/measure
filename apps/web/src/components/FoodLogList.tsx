import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";

type FoodLogListProps = {
	date: Date;
};

type EditState = {
	label: string;
	calories: string;
	protein: string;
	carbs: string;
	fat: string;
	meal: string;
};

const MEALS = ["breakfast", "lunch", "dinner", "snack"] as const;

const FoodLogList = (foodLogListProps: FoodLogListProps) => {
	const utils = trpc.useUtils();
	const listQuery = trpc.foodLog.list.useQuery({ date: foodLogListProps.date });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editState, setEditState] = useState<EditState>({
		label: "",
		calories: "",
		protein: "",
		carbs: "",
		fat: "",
		meal: "lunch",
	});

	const invalidate = () => {
		utils.foodLog.list.invalidate({ date: foodLogListProps.date });
		utils.foodLog.summary.invalidate({ date: foodLogListProps.date });
	};

	const removeMutation = trpc.foodLog.remove.useMutation({ onSuccess: invalidate });
	const editMutation = trpc.foodLog.edit.useMutation({
		onSuccess: () => {
			invalidate();
			setEditingId(null);
		},
	});

	const startEditing = (entry: {
		id: string;
		label: string;
		calories: number;
		protein: number | null;
		carbs: number | null;
		fat: number | null;
		meal: string;
	}) => {
		setEditingId(entry.id);
		setEditState({
			label: entry.label,
			calories: String(entry.calories),
			protein: entry.protein != null ? String(entry.protein) : "",
			carbs: entry.carbs != null ? String(entry.carbs) : "",
			fat: entry.fat != null ? String(entry.fat) : "",
			meal: entry.meal,
		});
	};

	const handleSave = () => {
		if (!editingId) return;

		editMutation.mutate({
			id: editingId,
			label: editState.label,
			calories: Number(editState.calories),
			protein: editState.protein ? Number(editState.protein) : null,
			carbs: editState.carbs ? Number(editState.carbs) : null,
			fat: editState.fat ? Number(editState.fat) : null,
			meal: editState.meal as (typeof MEALS)[number],
		});
	};

	const entries = listQuery.data ?? [];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Food Log</CardTitle>
			</CardHeader>
			<CardContent>
				{entries.length === 0 ? (
					<p className="text-sm text-muted-foreground" data-testid={TEST_IDS.FOOD_LOG.EMPTY}>
						No entries yet. Add your first meal above.
					</p>
				) : (
					<ul className="flex flex-col gap-3" data-testid={TEST_IDS.FOOD_LOG.LIST}>
						{entries.map((entry) => (
							<li
								key={entry.id}
								className="rounded-lg border p-3"
								data-testid={TEST_IDS.FOOD_LOG.ENTRY}
							>
								{editingId === entry.id ? (
									<div className="flex flex-col gap-3">
										<div className="grid grid-cols-2 gap-3">
											<div className="col-span-2 flex flex-col gap-1.5">
												<Label>Label</Label>
												<Input
													value={editState.label}
													onChange={(e) => setEditState({ ...editState, label: e.target.value })}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label>Calories</Label>
												<Input
													type="text"
													inputMode="decimal"
													value={editState.calories}
													onChange={(e) => setEditState({ ...editState, calories: e.target.value })}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label>Meal</Label>
												<Select
													value={editState.meal}
													onValueChange={(v) => setEditState({ ...editState, meal: v })}
												>
													<SelectTrigger>
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
												<Label>Protein (g)</Label>
												<Input
													type="text"
													inputMode="decimal"
													value={editState.protein}
													onChange={(e) => setEditState({ ...editState, protein: e.target.value })}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label>Carbs (g)</Label>
												<Input
													type="text"
													inputMode="decimal"
													value={editState.carbs}
													onChange={(e) => setEditState({ ...editState, carbs: e.target.value })}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label>Fat (g)</Label>
												<Input
													type="text"
													inputMode="decimal"
													value={editState.fat}
													onChange={(e) => setEditState({ ...editState, fat: e.target.value })}
												/>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={handleSave}
												disabled={editMutation.isPending}
												data-testid={TEST_IDS.FOOD_LOG.ENTRY_SAVE}
											>
												Save
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setEditingId(null)}
												data-testid={TEST_IDS.FOOD_LOG.ENTRY_CANCEL}
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between">
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="font-medium" data-testid={TEST_IDS.FOOD_LOG.ENTRY_LABEL}>
													{entry.label}
												</span>
												<Badge variant="outline" data-testid={TEST_IDS.FOOD_LOG.ENTRY_MEAL}>
													{entry.meal}
												</Badge>
											</div>
											<span
												className="text-sm text-muted-foreground"
												data-testid={TEST_IDS.FOOD_LOG.ENTRY_CALORIES}
											>
												{entry.calories} cal
												{entry.protein != null && ` · ${entry.protein}g P`}
												{entry.carbs != null && ` · ${entry.carbs}g C`}
												{entry.fat != null && ` · ${entry.fat}g F`}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => startEditing(entry)}
												data-testid={TEST_IDS.FOOD_LOG.ENTRY_EDIT}
											>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeMutation.mutate({ id: entry.id })}
												disabled={removeMutation.isPending}
												data-testid={TEST_IDS.FOOD_LOG.ENTRY_DELETE}
											>
												Delete
											</Button>
										</div>
									</div>
								)}
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
};

export { FoodLogList };
