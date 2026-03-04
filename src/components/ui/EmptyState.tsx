import React from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
    icon: string;
    title: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in zoom-in duration-500 mt-10">
            <div className="w-24 h-24 rounded-3xl bg-surface-dark border border-white/5 flex items-center justify-center mb-6 shadow-card rotate-3">
                <Icon name={icon} className="text-[48px] text-primary/20 -rotate-3" />
            </div>

            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
                {title}
            </h3>

            {message && (
                <p className="text-[14px] text-text-muted max-w-[260px] mb-8 font-medium leading-relaxed">
                    {message}
                </p>
            )}

            {action && (
                <Button
                    onClick={action.onClick}
                    className="rounded-2xl px-8 py-6 font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
};
