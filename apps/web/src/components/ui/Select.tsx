import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    icon?: string;
    error?: string;
    options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, icon, error, options, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-text-muted text-[20px] group-focus-within:text-primary transition-colors">
                                {icon}
                            </span>
                        </div>
                    )}
                    <select
                        ref={ref}
                        className={cn(
                            "appearance-none block w-full py-3.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl sm:text-sm font-medium text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm",
                            icon ? "pl-11 pr-10" : "px-4 pr-10",
                            error && "border-danger focus:ring-danger focus:border-danger",
                            className
                        )}
                        {...props}
                    >
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                </div>
                {error && <p className="text-xs text-danger ml-1">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
