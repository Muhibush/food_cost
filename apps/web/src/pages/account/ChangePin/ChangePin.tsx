import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChangePin: React.FC = () => {
    const navigate = useNavigate();
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleUpdatePin = () => {
        // Validation and logic to update PIN would go here
        navigate('/profile');
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-safe">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-10 w-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-[0.95]"
                    >
                        <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-extrabold tracking-tight">Change PIN</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-5 py-8 gap-8">
                <section>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        Please enter your current PIN to verify your identity, then create a new secure PIN to protect your account data.
                    </p>
                </section>

                <section className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Current PIN</label>
                        <div className="relative group">
                            <input
                                className="w-full bg-surface-dark border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-xl tracking-[0.5em] font-black shadow-xl"
                                id="current-pin"
                                maxLength={6}
                                name="current-pin"
                                placeholder="••••••"
                                type="password"
                                value={currentPin}
                                onChange={(e) => setCurrentPin(e.target.value)}
                            />
                            {currentPin.length === 6 && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-success group-focus-within:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-xl font-bold">check_circle</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">New PIN</label>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-dark border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-xl tracking-[0.5em] font-black shadow-xl"
                                id="new-pin"
                                maxLength={6}
                                name="new-pin"
                                placeholder="••••••"
                                type="password"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Confirm New PIN</label>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-dark border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-xl tracking-[0.5em] font-black shadow-xl"
                                id="confirm-pin"
                                maxLength={6}
                                name="confirm-pin"
                                placeholder="••••••"
                                type="password"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-surface-dark/40 rounded-2xl p-5 flex gap-4 border border-white/5 shadow-inner">
                    <div className="shrink-0 text-gray-500 mt-0.5">
                        <span className="material-symbols-outlined text-xl">security</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            <span className="text-white font-bold">Security Tip:</span> Avoid using sequential numbers (e.g., 123456) or repeated digits (e.g., 000000) for better protection.
                        </p>
                    </div>
                </section>

                <div className="flex-1"></div>

                <div className="pt-6 pb-8 sticky bottom-0 bg-background-dark/95 backdrop-blur-sm -mx-5 px-5 border-t border-white/5 z-10">
                    <button
                        onClick={handleUpdatePin}
                        disabled={newPin !== confirmPin || newPin.length < 4}
                        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        Update PIN
                    </button>
                    {newPin !== confirmPin && confirmPin.length > 0 && (
                        <p className="text-[10px] text-danger font-bold text-center mt-3 uppercase tracking-wider">PINs do not match</p>
                    )}
                </div>
            </main>
        </div>
    );
};
