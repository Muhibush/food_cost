import React from 'react';
import { cn } from '../../utils/cn';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    ({ className, name, size = 'md', ...props }, ref) => {
        const sizes = {
            sm: 'text-[16px]',
            md: 'text-[20px]',
            lg: 'text-[24px]',
            xl: 'text-[32px]',
        };

        return (
            <span
                ref={ref}
                className={cn("material-symbols-outlined", sizes[size], className)}
                {...props}
            >
                {name}
            </span>
        );
    }
);

Icon.displayName = 'Icon';
