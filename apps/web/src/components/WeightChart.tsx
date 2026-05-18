import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_IDS } from "@/lib/test-ids";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const WeightChart = () => {
	const [dateRange] = useState(() => {
		const to = new Date();
		to.setHours(23, 59, 59, 999);
		const from = new Date();
		from.setDate(from.getDate() - 30);
		from.setHours(0, 0, 0, 0);
		return { from, to };
	});

	const listQuery = trpc.weight.list.useQuery(dateRange);

	const goalQuery = trpc.weight.getGoal.useQuery();

	const entries = listQuery.data ?? [];
	const chartData = [...entries].reverse().map((entry) => ({
		date: new Date(entry.loggedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
		weight: entry.weight,
	}));

	const goalWeight = goalQuery.data?.goalWeight;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Last 30 Days</CardTitle>
			</CardHeader>
			<CardContent data-testid={TEST_IDS.WEIGHT.CHART}>
				{chartData.length === 0 ? (
					<p className="text-sm text-muted-foreground">No weight entries in the last 30 days.</p>
				) : (
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={chartData}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
							<XAxis dataKey="date" className="text-xs" tick={{ fill: "currentColor" }} />
							<YAxis
								domain={["dataMin - 2", "dataMax + 2"]}
								className="text-xs"
								tick={{ fill: "currentColor" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: "8px",
								}}
							/>
							<Line
								type="monotone"
								dataKey="weight"
								stroke="var(--color-primary)"
								strokeWidth={2}
								dot={{ r: 3 }}
								activeDot={{ r: 5 }}
							/>
							{goalWeight && (
								<Line
									type="monotone"
									dataKey={() => goalWeight}
									stroke="var(--color-muted-foreground)"
									strokeDasharray="5 5"
									strokeWidth={1}
									dot={false}
									name="Goal"
								/>
							)}
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};

export { WeightChart };
