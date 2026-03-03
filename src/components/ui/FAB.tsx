import React from 'react';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
}

export const FAB: React.FC<FABProps> = ({ icon, className, ...props }) => {
    return (
        <button
            className={cn(
                "fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-card active:scale-[0.95] transition-all z-40 border border-white/5",
                className
            )}
            {...props}
        >
            <Icon name={icon} size="lg" />
        </button>
    );
};
