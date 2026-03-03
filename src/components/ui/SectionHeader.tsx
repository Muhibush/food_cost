import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
    title: string;
    icon?: string;
    rightElement?: React.ReactNode;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    icon,
    rightElement,
    className
}) => {
    return (
        <div className={cn("flex items-center justify-between mb-4 px-1", className)}>
            <div className="flex items-center gap-3">
                {icon && (
                    <span className="material-symbols-outlined text-primary text-xl">
                        {icon}
                    </span>
                )}
                <h2 className="font-bold text-lg text-white">{title}</h2>
            </div>
            {rightElement && (
                <div className="flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
