import React from 'react';
import { cn } from '../../utils/cn';

interface ActionFooterProps {
    primaryAction: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
        isLoading?: boolean;
        isDisabled?: boolean;
    };
    summary?: {
        label: string;
        value: string | number;
    };
    className?: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
    primaryAction,
    summary,
    className
}) => {
    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-30 bg-background-dark/80 backdrop-blur-md border-t border-white/5 pb-safe pt-4 px-5 shadow-lg rounded-t-2xl transform transition-transform",
            className
        )}>
            <div className={cn(
                "flex items-center gap-4 max-w-lg mx-auto w-full mb-2",
                summary ? "justify-between" : "justify-center"
            )}>
                {summary && (
                    <div className="flex-1 min-w-0 mr-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-60 mb-0.5 mt-1">
                            {summary.label}
                        </p>
                        <div className="text-xl font-extrabold font-display text-white truncate leading-tight">
                            {summary.value}
                        </div>
                    </div>
                )}
                <button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.isLoading || primaryAction.isDisabled}
                    className={cn(
                        "font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
                        !summary ? "w-full py-4 text-lg rounded-2xl" : "py-3 px-6 text-sm rounded-xl",
                        primaryAction.variant === 'secondary'
                            ? "bg-surface-dark text-white border border-white/10"
                            : primaryAction.variant === 'danger'
                                ? "bg-danger text-white shadow-danger/20"
                                : "bg-primary text-white shadow-primary/20 hover:bg-primary-dark"
                    )}
                >
                    {primaryAction.isLoading && (
                        <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                    )}
                    {primaryAction.label}
                </button>
            </div>
        </div>
    );
};
