import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, icon, error, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide ml-1">
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
                    <input
                        ref={ref}
                        className={cn(
                            "block w-full py-3.5 bg-surface-dark border border-white/10 rounded-xl text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm",
                            icon ? "pl-11 pr-4" : "px-4",
                            error && "border-danger focus:ring-danger focus:border-danger",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-danger ml-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
