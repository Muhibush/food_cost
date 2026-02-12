import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Profile</h1>
                <button
                    className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm">
                    <span className="material-symbols-outlined text-white text-xl">notifications</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col px-6 py-8 pb-32 gap-10">
                {/* Profile Section */}
                <section className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-surface-dark border-[3px] border-primary p-1.5 shadow-2xl shadow-primary/20">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh_wtIoQQkw7stwg6_dUbYwzRyj2JDYeuICxZ5vfvLYDunXRddDZNvt_PJrG_5LBOCORVFSs2vBYKeFDEWhZepFLX7ZWPedAVfpfZhov945Uni5JvkmStFuABKLhQ-jD1maP_jIpf9dV49Qk3YtkyQ4eOCI3oI6ttqN3o7anDnjg4eDU9QZ5-rImasTSSrfEkhK6eORC-six3CmewhQiV8-4Vegqbu3ZTOyQ4-03cdyJU69S23LB_zJaVpeqwdHqVOgOadH4CWM')" }}
                            ></div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mb-1">Thomas Chef</h2>
                    <p className="text-gray-500 text-sm font-bold tracking-wide mb-2">@thomaschef</p>
                    <p className="text-gray-400 text-sm font-medium bg-surface-dark px-4 py-1.5 rounded-full border border-white/5">Head Chef at La Bistro</p>
                </section>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Profile Settings</h3>
                        <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">edit_note</span>
                                    </div>
                                    <span className="font-bold text-base">Edit Profile</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                            <button
                                onClick={() => navigate('/profile/change-pin')}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group active:bg-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">lock</span>
                                    </div>
                                    <span className="font-bold text-base">Change PIN</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Data Management</h3>
                        <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                            <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">file_upload</span>
                                    </div>
                                    <span className="font-bold text-base">Import CSV</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">file_download</span>
                                    </div>
                                    <span className="font-bold text-base">Export CSV</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">delete_sweep</span>
                                    </div>
                                    <span className="font-bold text-base text-red-400/90">Clear All Recipes</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group active:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">delete_forever</span>
                                    </div>
                                    <span className="font-bold text-base text-red-400/90">Clear All Ingredients</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Preferences</h3>
                        <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                    <span className="material-symbols-outlined text-xl font-bold">dark_mode</span>
                                </div>
                                <span className="font-bold text-base">Dark Mode</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isDarkMode}
                                    onChange={() => setIsDarkMode(!isDarkMode)}
                                />
                                <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="pt-8 flex flex-col items-center gap-8">
                        <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-8 py-5 rounded-2xl font-black text-base shadow-lg shadow-red-500/5 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-xl font-bold">logout</span>
                            Logout Account
                        </button>
                        <div className="flex flex-col items-center gap-1 opacity-40">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">App Version 2.4.0</p>
                            <p className="text-[9px] font-bold text-gray-500">Build 102 • Production</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
