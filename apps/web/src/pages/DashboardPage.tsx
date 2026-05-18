import { DailySummary } from "@/components/DailySummary";
import { FoodLogList } from "@/components/FoodLogList";
import { QuickAddForm } from "@/components/QuickAddForm";

const DashboardPage = () => {
	const today = new Date();

	return (
		<div className="flex flex-col gap-6">
			<DailySummary date={today} />
			<QuickAddForm date={today} />
			<FoodLogList date={today} />
		</div>
	);
};

export { DashboardPage };
