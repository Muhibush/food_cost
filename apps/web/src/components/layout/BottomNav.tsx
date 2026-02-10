import React from 'react';
import { Icon } from '../ui/Icon';
import { cn } from '../ui/Button';

interface NavItem {
    icon: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

interface BottomNavProps {
    items: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-white/5 pb-safe z-30">
            <div className="flex items-center justify-around h-16 px-2">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                            item.isActive ? "text-primary" : "text-text-muted hover:text-white"
                        )}
                    >
                        <Icon name={item.icon} size="lg" className={cn(item.isActive && "fill-current")} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};
