import { DailySummary } from "@/components/DailySummary";
import { DateNavigation } from "@/components/DateNavigation";
import { FoodLogList } from "@/components/FoodLogList";
import { QuickAddForm } from "@/components/QuickAddForm";
import { useState } from "react";

const DashboardPage = () => {
	const [date, setDate] = useState(() => new Date());

	return (
		<div className="flex flex-col gap-6">
			<DateNavigation date={date} onDateChange={setDate} />
			<DailySummary date={date} />
			<QuickAddForm date={date} />
			<FoodLogList date={date} />
		</div>
	);
};

export { DashboardPage };
