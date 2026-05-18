import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const WeightHistory = () => {
	const utils = trpc.useUtils();
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	thirtyDaysAgo.setHours(0, 0, 0, 0);
	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999);

	const [dateRange] = useState(() => ({ from: thirtyDaysAgo, to: endOfToday }));
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editWeight, setEditWeight] = useState("");

	const listQuery = trpc.weight.list.useQuery(dateRange);
	const removeMutation = trpc.weight.remove.useMutation({
		onSuccess: () => {
			utils.weight.list.invalidate();
			utils.weight.latest.invalidate();
		},
	});
	const logMutation = trpc.weight.log.useMutation({
		onSuccess: () => {
			utils.weight.list.invalidate();
			utils.weight.latest.invalidate();
			setEditingId(null);
			setEditWeight("");
		},
	});

	const entries = listQuery.data ?? [];

	const handleEdit = (id: string, currentWeight: number) => {
		setEditingId(id);
		setEditWeight(String(currentWeight));
	};

	const handleSave = (entry: { unit: string; loggedAt: string | Date }) => {
		const value = Number(editWeight);
		if (value <= 0 || Number.isNaN(value)) return;

		logMutation.mutate({
			weight: value,
			unit: entry.unit as "kg" | "lb",
			loggedAt: new Date(entry.loggedAt),
		});
	};

	if (entries.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>History</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-2">
					{entries.map((entry) => (
						<li
							key={entry.id}
							className="flex items-center justify-between rounded-lg border p-3"
							data-testid={TEST_IDS.WEIGHT.HISTORY_ENTRY}
						>
							<div className="flex items-center gap-3">
								<span className="text-sm text-muted-foreground">
									{new Date(entry.loggedAt).toLocaleDateString("en-GB", {
										weekday: "short",
										day: "numeric",
										month: "short",
									})}{" "}
									{new Date(entry.loggedAt).toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
								{editingId === entry.id ? (
									<div className="flex items-center gap-2">
										<Input
											type="text"
											inputMode="decimal"
											value={editWeight}
											onChange={(e) => setEditWeight(e.target.value)}
											className="h-7 w-20"
											autoFocus
										/>
										<span className="text-sm text-muted-foreground">{entry.unit}</span>
									</div>
								) : (
									<span className="font-medium">
										{entry.weight} {entry.unit}
									</span>
								)}
							</div>
							<div className="flex items-center gap-1">
								{editingId === entry.id ? (
									<>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleSave(entry)}
											disabled={logMutation.isPending}
										>
											Save
										</Button>
										<Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
											Cancel
										</Button>
									</>
								) : (
									<>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEdit(entry.id, entry.weight)}
										>
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeMutation.mutate({ id: entry.id })}
											disabled={removeMutation.isPending}
											data-testid={TEST_IDS.WEIGHT.HISTORY_DELETE}
										>
											Delete
										</Button>
									</>
								)}
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
};

export { WeightHistory };
