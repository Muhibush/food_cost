import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'danger' | 'default';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-white/5 text-text-muted',
            success: 'bg-success/10 text-success border-success/20',
            warning: 'bg-primary/10 text-primary border-primary/20',
            danger: 'bg-danger/10 text-danger border-danger/20',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border border-transparent",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
