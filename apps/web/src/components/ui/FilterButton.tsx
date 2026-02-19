import React from 'react';
import { cn } from '../../utils/cn';

interface FilterButtonProps {
    isActive: boolean;
    onClick: () => void;
    icon?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    isActive,
    onClick,
    icon = "calendar_month"
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-[0.95] shadow-sm",
                isActive
                    ? "bg-primary border-primary text-white"
                    : "bg-surface-dark border-white/5 text-white hover:bg-white/10"
            )}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
        </button>
    );
};
