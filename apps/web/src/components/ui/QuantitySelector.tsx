import React from 'react';
import { cn } from '../../utils/cn';

interface QuantitySelectorProps {
    value: number;
    onChange?: (newValue: number) => void;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    value,
    onIncrement,
    onDecrement,
    className
}) => {
    return (
        <div className={cn(
            "flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-600 h-8",
            className
        )}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDecrement();
                }}
                className="w-8 h-full rounded-md text-gray-500 hover:text-primary flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
                <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <div className="w-8 text-center bg-transparent border-none p-0 text-sm font-bold text-slate-800 dark:text-white">
                {value}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onIncrement();
                }}
                className="w-8 h-full rounded-md text-gray-500 hover:text-primary flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
                <span className="material-symbols-outlined text-base">add</span>
            </button>
        </div>
    );
};
