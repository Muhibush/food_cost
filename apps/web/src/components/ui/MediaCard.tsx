import React from 'react';
import { cn } from './Button';

interface MediaCardProps {
    image?: string;
    title: string;
    subtitle?: React.ReactNode;
    description?: React.ReactNode;
    rightElement?: React.ReactNode;
    bottomElement?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
    image,
    title,
    subtitle,
    description,
    rightElement,
    bottomElement,
    onClick,
    className
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative overflow-hidden transition-all",
                onClick && "active:scale-[0.98] cursor-pointer",
                className
            )}
        >
            <div
                className="h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-800 bg-cover bg-center shrink-0 shadow-inner flex items-center justify-center overflow-hidden"
                style={image ? { backgroundImage: `url('${image}')` } : {}}
            >
                {!image && (
                    <span className="material-symbols-outlined text-gray-600 text-3xl opacity-30">image</span>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="relative">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white truncate pr-6">
                            {title}
                        </h4>
                        {rightElement && (
                            <div className="shrink-0">
                                {rightElement}
                            </div>
                        )}
                    </div>
                    {subtitle && (
                        <div className="mt-0.5">
                            {subtitle}
                        </div>
                    )}
                    {description && (
                        <div className="mt-1">
                            {description}
                        </div>
                    )}
                </div>
                {bottomElement && (
                    <div className="mt-2 text-xs">
                        {bottomElement}
                    </div>
                )}
            </div>
        </div>
    );
};
