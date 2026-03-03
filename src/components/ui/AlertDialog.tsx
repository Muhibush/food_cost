import React from 'react';
import { cn } from '../../utils/cn';

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel: () => void;
    onConfirm: () => void;
    isDestructive?: boolean;
    showCancelButton?: boolean;
    type?: 'info' | 'success' | 'warning' | 'error';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    message,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    onCancel,
    onConfirm,
    isDestructive = false,
    showCancelButton = true,
    type = 'info'
}) => {
    if (!isOpen) return null;

    const iconMap = {
        info: 'info',
        success: 'check_circle',
        warning: 'warning',
        error: 'error'
    };

    const typeColorMap = {
        info: 'bg-primary/10 text-primary',
        success: 'bg-green-500/10 text-green-500',
        warning: 'bg-orange-500/10 text-orange-500',
        error: 'bg-red-500/10 text-red-500'
    };

    const activeType = isDestructive ? 'error' : type;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Dialog Card */}
            <div className="relative w-full max-w-sm bg-surface-dark border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                <div className="p-8 text-center">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4",
                        typeColorMap[activeType]
                    )}>
                        <span className="material-symbols-outlined text-2xl font-bold">
                            {iconMap[activeType]}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed px-2">
                        {message}
                    </p>
                </div>

                <div className="flex border-t border-white/5 h-16">
                    {showCancelButton && (
                        <button
                            onClick={onCancel}
                            className="flex-1 font-bold text-gray-400 hover:bg-white/5 active:bg-white/10 transition-colors border-r border-white/5"
                        >
                            {cancelLabel}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "flex-1 font-bold transition-colors active:opacity-80",
                            isDestructive || activeType === 'error' ? "text-red-500 hover:bg-red-500/10" : "text-primary hover:bg-primary/10"
                        )}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
