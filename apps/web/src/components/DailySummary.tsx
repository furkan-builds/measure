import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";

type DailySummaryProps = {
	date: Date;
};

const DailySummary = (dailySummaryProps: DailySummaryProps) => {
	const summaryQuery = trpc.foodLog.summary.useQuery({ date: dailySummaryProps.date });

	const summary = summaryQuery.data ?? {
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
		entryCount: 0,
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Today&apos;s Summary{" "}
					<span
						className="text-sm font-normal text-muted-foreground"
						data-testid={TEST_IDS.SUMMARY.ENTRY_COUNT}
					>
						({summary.entryCount} {summary.entryCount === 1 ? "entry" : "entries"})
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-4 gap-4 text-center">
					<div>
						<p className="text-2xl font-bold" data-testid={TEST_IDS.SUMMARY.CALORIES}>
							{Math.round(summary.calories)}
						</p>
						<p className="text-xs text-muted-foreground">Calories</p>
					</div>
					<div>
						<p className="text-2xl font-bold" data-testid={TEST_IDS.SUMMARY.PROTEIN}>
							{Math.round(summary.protein)}g
						</p>
						<p className="text-xs text-muted-foreground">Protein</p>
					</div>
					<div>
						<p className="text-2xl font-bold" data-testid={TEST_IDS.SUMMARY.CARBS}>
							{Math.round(summary.carbs)}g
						</p>
						<p className="text-xs text-muted-foreground">Carbs</p>
					</div>
					<div>
						<p className="text-2xl font-bold" data-testid={TEST_IDS.SUMMARY.FAT}>
							{Math.round(summary.fat)}g
						</p>
						<p className="text-xs text-muted-foreground">Fat</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export { DailySummary };
