import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface HeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    rightElement?: React.ReactNode;
    leftElement?: React.ReactNode;
    bottomElement?: React.ReactNode;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    showBackButton = false,
    rightElement,
    leftElement,
    bottomElement,
    className
}) => {
    const navigate = useNavigate();

    return (
        <header className={cn(
            "sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex flex-col gap-4",
            className
        )}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 min-w-0">
                    {showBackButton && (
                        <button
                            onClick={() => navigate(-1)}
                            className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                        >
                            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                        </button>
                    )}
                    {leftElement && !showBackButton && leftElement}
                    <div className="min-w-0">
                        <h1 className="text-xl font-extrabold text-white tracking-tight truncate leading-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                {rightElement && (
                    <div className="flex items-center gap-2">
                        {rightElement}
                    </div>
                )}
            </div>
            {bottomElement && (
                <div className="w-full">
                    {bottomElement}
                </div>
            )}
        </header>
    );
};
