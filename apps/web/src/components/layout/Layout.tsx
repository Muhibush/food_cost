import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/';

    // Main Tabs (Core) where BNB should be visible
    const MAIN_TABS = ['/', '/history', '/recipes', '/ingredients', '/profile'];
    const isMainTab = MAIN_TABS.includes(location.pathname);

    return (
        <div className={clsx(
            "bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col",
            isMainTab ? "pb-32" : "pb-safe"
        )}>
            {isDashboard && (
                <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark px-5 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center border-2 border-primary shadow-sm"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS04F1_8gxS_wh5p8aadS4dOwrUTeJEYiGA29E6WWvTahXdLcS9SdZPmZ2-S_ouAkT9R935-35Snl_Mi0eUDPq4ejBGgmISnmOVE85mnQf_P9BaIEhX-EpzKfrNtul39Crc0rQbXp1WXXMTzDGlV7dIXmtnTACD7TxEtO-r2IPVmcO1QmIvpAVwNRNydjD9f-krF--SW_R0_ZoY2Y9nw_ffRVBSAmcXHrEyejUi-osHG5cqA7ZGMOLU-7M_ha8lDCYiMzq373_qzc')" }}
                            ></div>
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-800 dark:text-white leading-none">Chef Anderson</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Kitchen Manager</p>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className="flex-1 flex flex-col px-5 pt-4">
                <Outlet />
            </main>

            {isMainTab && <BottomNav />}
        </div>
    );
};
