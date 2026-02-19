import { format } from "date-fns";
import { DayPicker, ChevronProps } from "react-day-picker";
import { cn } from "../../utils/cn";
import { Icon } from "./Icon";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    // Ensure the calendar opens at the selected date's month by default
    const defaultMonth =
        props.mode === "single" && props.selected instanceof Date
            ? props.selected
            : props.defaultMonth;

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            fixedWeeks
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2040, 11)}
            defaultMonth={defaultMonth}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
                month: "space-y-4 relative",
                month_caption: "flex justify-center pt-1 items-center h-10 mb-4",
                caption_label: "text-sm font-bold text-white hidden", // Hide when dropdown is active
                nav: "flex items-center justify-between absolute inset-x-0 top-1 px-1 z-10",
                button_previous: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity text-white flex items-center justify-center rounded-lg hover:bg-white/5"
                ),
                button_next: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity text-white flex items-center justify-center rounded-lg hover:bg-white/5"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex",
                weekday: "text-gray-500 rounded-md w-8 font-bold text-[10px] uppercase tracking-wider h-8 flex items-center justify-center",
                week: "flex w-full mt-2",
                day: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                ),
                day_button: cn(
                    "h-8 w-8 p-0 font-medium transition-colors flex items-center justify-center rounded-xl",
                    "hover:bg-white/5"
                ),
                selected: "[&_button]:bg-primary [&_button]:text-white [&_button]:opacity-100 [&_button]:shadow-lg [&_button]:shadow-primary/25 [&_button]:hover:bg-primary [&_button]:rounded-xl",
                today: "text-primary font-black underline underline-offset-4",
                outside: "text-gray-600 opacity-50 day-outside",
                disabled: "text-gray-600 opacity-50",
                range_middle: "aria-selected:bg-primary/10 aria-selected:text-white",
                hidden: "invisible",
                // Dropdown styles
                caption_dropdowns: "flex justify-center gap-1",
                dropdown: "bg-surface-dark border-none text-sm font-bold text-white focus:ring-0 cursor-pointer hover:text-primary transition-colors appearance-none px-2 py-1 rounded-md",
                dropdown_month: "",
                dropdown_year: "",
                // Footer styles
                footer: "pt-4 mt-4 border-t border-white/5 text-center text-xs font-bold text-primary tracking-widest uppercase",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }: ChevronProps) => (
                    <Icon
                        name={orientation === "left" ? "chevron_left" : "chevron_right"}
                        size="sm"
                    />
                ),
            }}
            footer={
                props.mode === "single" && props.selected instanceof Date ? (
                    <div>{format(props.selected, "d MMM yyyy")}</div>
                ) : null
            }
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
