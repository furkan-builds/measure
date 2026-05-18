import { Button } from "@/components/ui/button";
import { TEST_IDS } from "@/lib/test-ids";
import { type ChangeEvent, useRef } from "react";

type DateNavigationProps = {
	date: Date;
	onDateChange: (date: Date) => void;
};

const formatDate = (date: Date): string => {
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	if (toDateString(date) === toDateString(today)) return "Today";
	if (toDateString(date) === toDateString(yesterday)) return "Yesterday";

	return date.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
};

const toDateString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const isToday = (date: Date): boolean => {
	return toDateString(date) === toDateString(new Date());
};

const DateNavigation = (dateNavigationProps: DateNavigationProps) => {
	const dateInputRef = useRef<HTMLInputElement>(null);

	const goToPreviousDay = () => {
		const prev = new Date(dateNavigationProps.date);
		prev.setDate(prev.getDate() - 1);
		dateNavigationProps.onDateChange(prev);
	};

	const goToNextDay = () => {
		const next = new Date(dateNavigationProps.date);
		next.setDate(next.getDate() + 1);
		dateNavigationProps.onDateChange(next);
	};

	const goToToday = () => {
		dateNavigationProps.onDateChange(new Date());
	};

	const handleDatePick = (e: ChangeEvent<HTMLInputElement>) => {
		const [year, month, day] = e.target.value.split("-").map(Number);
		const picked = new Date(year, month - 1, day);
		if (!Number.isNaN(picked.getTime())) {
			dateNavigationProps.onDateChange(picked);
		}
	};

	const openDatePicker = () => {
		dateInputRef.current?.showPicker();
	};

	return (
		<div className="flex items-center justify-between">
			<Button
				variant="outline"
				size="sm"
				onClick={goToPreviousDay}
				data-testid={TEST_IDS.DATE_NAV.PREV}
			>
				Previous
			</Button>
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="cursor-pointer text-lg font-semibold hover:text-muted-foreground"
					onClick={openDatePicker}
					data-testid={TEST_IDS.DATE_NAV.LABEL}
				>
					{formatDate(dateNavigationProps.date)}
				</button>
				<input
					ref={dateInputRef}
					type="date"
					className="invisible absolute h-0 w-0"
					value={toDateString(dateNavigationProps.date)}
					max={toDateString(new Date())}
					onChange={handleDatePick}
					tabIndex={-1}
					data-testid={TEST_IDS.DATE_NAV.PICKER}
				/>
				{!isToday(dateNavigationProps.date) && (
					<Button
						variant="ghost"
						size="sm"
						onClick={goToToday}
						data-testid={TEST_IDS.DATE_NAV.TODAY}
					>
						Today
					</Button>
				)}
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={goToNextDay}
				disabled={isToday(dateNavigationProps.date)}
				data-testid={TEST_IDS.DATE_NAV.NEXT}
			>
				Next
			</Button>
		</div>
	);
};

export { DateNavigation };
