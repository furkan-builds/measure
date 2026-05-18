import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";

type FoodLogListProps = {
	date: Date;
};

const FoodLogList = (foodLogListProps: FoodLogListProps) => {
	const utils = trpc.useUtils();
	const listQuery = trpc.foodLog.list.useQuery({ date: foodLogListProps.date });
	const removeMutation = trpc.foodLog.remove.useMutation({
		onSuccess: () => {
			utils.foodLog.list.invalidate({ date: foodLogListProps.date });
			utils.foodLog.summary.invalidate({ date: foodLogListProps.date });
		},
	});

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
								className="flex items-center justify-between rounded-lg border p-3"
								data-testid={TEST_IDS.FOOD_LOG.ENTRY}
							>
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
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeMutation.mutate({ id: entry.id })}
									disabled={removeMutation.isPending}
									data-testid={TEST_IDS.FOOD_LOG.ENTRY_DELETE}
								>
									Delete
								</Button>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
};

export { FoodLogList };
