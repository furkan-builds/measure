import { WeightChart } from "@/components/WeightChart";
import { WeightGoal } from "@/components/WeightGoal";
import { WeightHistory } from "@/components/WeightHistory";
import { WeightLogForm } from "@/components/WeightLogForm";

const WeightPage = () => {
	return (
		<div className="flex flex-col gap-6">
			<WeightLogForm />
			<WeightGoal />
			<WeightChart />
			<WeightHistory />
		</div>
	);
};

export { WeightPage };
