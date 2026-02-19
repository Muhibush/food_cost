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
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <Icon name={icon} size="xl" className="text-gray-600 opacity-50" />
            <div className="text-center">
                <p className="text-sm font-bold text-white mb-1">{title}</p>
                {message && <p className="text-xs font-medium text-gray-500">{message}</p>}
            </div>
            {action && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={action.onClick}
                    className="mt-2 text-primary hover:text-primary-dark font-bold underline decoration-primary/30 underline-offset-4"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
};
