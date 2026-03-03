import React from 'react';
import { cn } from '../../utils/cn';

interface InfoBannerProps {
    message: string;
    icon?: string;
    variant?: 'info' | 'success' | 'warning';
    className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
    message,
    icon = 'info',
    variant = 'info',
    className
}) => {
    const variants = {
        info: 'bg-blue-900/20 border-blue-500/20 text-blue-200',
        success: 'bg-green-900/20 border-green-500/20 text-green-200',
        warning: 'bg-orange-900/20 border-orange-500/20 text-orange-200',
    };

    const iconColors = {
        info: 'text-blue-400',
        success: 'text-green-400',
        warning: 'text-orange-400',
    };

    return (
        <div className={cn(
            "border rounded-xl p-4 flex items-start gap-3 transition-all",
            variants[variant],
            className
        )}>
            <span className={cn("material-symbols-outlined text-lg mt-0.5", iconColors[variant])}>
                {icon}
            </span>
            <p className="text-xs leading-relaxed font-medium">
                {message}
            </p>
        </div>
    );
};
