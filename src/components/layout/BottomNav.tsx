import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export const BottomNav: React.FC = () => {
    const navItems = [
        { label: 'Order', icon: 'calculate', path: '/' },
        { label: 'History', icon: 'history', path: '/history' },
        { label: 'Recipes', icon: 'menu_book', path: '/recipes' },
        { label: 'Ingredients', icon: 'grocery', path: '/ingredients' },
        { label: 'Account', icon: 'person', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12141D] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around h-[88px] px-2 pb-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full gap-1.5 group relative transition-colors",
                            isActive ? "text-primary" : "text-gray-500 hover:text-white"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute -top-[1px] w-12 h-[3px] bg-primary rounded-b-full shadow-[0_0_10px_rgba(255,107,53,0.5)]"></div>
                                )}
                                <span className={clsx("material-symbols-outlined text-[24px] transition-transform group-active:scale-90", isActive && "fill-1")}>
                                    {item.icon}
                                </span>
                                <span className={clsx("text-[11px]", isActive ? "font-bold" : "font-medium")}>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
