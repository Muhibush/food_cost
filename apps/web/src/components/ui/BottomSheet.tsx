import React, { useEffect, useState } from 'react';
import { cn } from './Button';
import { Icon } from './Icon';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isMounted) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-[70] bg-navy-charcoal rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col font-display",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Handle */}
                <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-gray-600/50 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-5 pb-4 border-b border-gray-700/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Icon name="close" size="md" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {children}
                </div>

                {/* Safe Area Spacer */}
                <div className="pb-safe bg-navy-charcoal" />
            </div>
        </>
    );
};
