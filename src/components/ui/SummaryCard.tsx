import React from 'react';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

interface SummaryCardProps {
    label: string;
    value: string | number;
    icon?: string;
    badge?: string;
    className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    label,
    value,
    icon = 'payments',
    badge,
    className
}) => {
    return (
        <div className={cn(
            "flex items-center justify-between bg-surface-dark/50 rounded-2xl p-4 border border-white/5 mx-1 overflow-hidden",
            className
        )}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name={icon} className="text-primary text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-60">{label}</p>
                    <div className="text-lg font-extrabold font-display text-white truncate">
                        {value}
                    </div>
                </div>
            </div>
            {badge && (
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xs font-bold shrink-0 ml-4">
                    {badge}
                </div>
            )}
        </div>
    );
};
