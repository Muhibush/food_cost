import React from 'react';
import { cn } from './Button';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        "block w-full px-4 py-3.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl leading-5 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm font-medium resize-none",
                        error && "border-danger focus:ring-danger focus:border-danger",
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-danger ml-1">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
