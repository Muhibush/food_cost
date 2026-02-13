import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from './Button';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, className }) => {
    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            {label && (
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <div className="absolute inset-0 pl-4 pr-10 py-3.5 flex items-center pointer-events-none text-slate-900 dark:text-white sm:text-sm font-medium z-10">
                    {value ? format(parseISO(value), 'd MMMM yyyy') : 'Select Date'}
                </div>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="block w-full pl-4 pr-10 py-3.5 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-transparent dark:text-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:appearance-none relative z-20 cursor-pointer"
                    type="date"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                    <span className="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors">
                        calendar_today
                    </span>
                </div>
            </div>
        </div>
    );
};
