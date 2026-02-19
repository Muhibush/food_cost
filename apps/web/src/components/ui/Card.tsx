import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-surface-dark rounded-2xl border border-white/5 shadow-card overflow-hidden p-4",
                    hoverEffect && "transition-transform active:scale-[0.99] cursor-pointer",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
