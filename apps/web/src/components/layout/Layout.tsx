import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { clsx } from 'clsx';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
    const location = useLocation();

    // Main Tabs (Core) where BNB should be visible
    const MAIN_TABS = ['/', '/history', '/recipes', '/ingredients', '/profile'];
    const isMainTab = MAIN_TABS.includes(location.pathname);
    const navigationType = useNavigationType();

    // Scroll to top on every route change, EXCEPT when using back/forward (POP)
    useEffect(() => {
        if (navigationType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navigationType]);

    return (
        <div className={clsx(
            "bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col",
            isMainTab ? "pb-32" : "pb-safe"
        )}>


            <main className="flex-1 flex flex-col px-5 pt-4">
                <Outlet />
            </main>

            {isMainTab && <BottomNav />}
        </div>
    );
};
