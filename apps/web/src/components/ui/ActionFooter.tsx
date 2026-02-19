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
            "fixed bottom-[72px] left-0 right-0 z-30 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 pb-2 pt-4 px-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl transform transition-transform",
            className
        )}>
            <div className="flex items-center justify-between mb-2 max-w-lg mx-auto w-full">
                {summary && (
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                            {summary.label}
                        </p>
                        <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                            {summary.value}
                        </div>
                    </div>
                )}
                {!summary && <div />}
                <button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.isLoading || primaryAction.isDisabled}
                    className={cn(
                        "text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50",
                        primaryAction.variant === 'secondary'
                            ? "bg-surface-dark text-white border border-white/10"
                            : primaryAction.variant === 'danger'
                                ? "bg-danger text-white shadow-danger/10"
                                : "bg-primary text-white shadow-primary/10"
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
