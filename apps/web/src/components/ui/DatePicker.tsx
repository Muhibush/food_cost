import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { cn } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Icon } from './Icon';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Parse the ISO string value into a Date object for the calendar
    const date = value ? parseISO(value) : undefined;
    const isValidDate = date && isValid(date);

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // Pass back the ISO string to the store (yyyy-MM-dd)
            onChange(format(selectedDate, 'yyyy-MM-dd'));
            setIsOpen(false);
        }
    };

    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            {label && (
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                    {label}
                </label>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "relative group w-full bg-white dark:bg-surface-dark rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm transition-all hover:ring-primary focus:ring-2 focus:ring-primary overflow-hidden text-left py-3.5 pl-4 pr-10",
                            isOpen && "ring-2 ring-primary"
                        )}
                    >
                        <span className={cn(
                            "block sm:text-sm font-medium transition-colors",
                            isValidDate ? "text-slate-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                        )}>
                            {isValidDate ? format(date, 'd MMM yyyy') : 'Select Date'}
                        </span>

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Icon
                                name="calendar_today"
                                className={cn(
                                    "text-white/50 transition-colors",
                                    isOpen && "text-primary"
                                )}
                                size="md"
                            />
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent className="p-0 border-none bg-surface-dark shadow-2xl rounded-3xl overflow-hidden" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
