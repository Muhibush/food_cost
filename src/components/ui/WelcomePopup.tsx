import React from 'react';

interface WelcomePopupProps {
    isOpen: boolean;
    onImport: () => void;
    onSkip: () => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onImport, onSkip }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onSkip}
            />

            {/* Dialog Card */}
            <div className="relative w-full max-w-sm bg-surface-dark border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
                {/* Header Gradient Banner */}
                <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-7 pt-8 pb-6 border-b border-white/5">
                    {/* Decorative background circles */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-secondary/10 blur-xl pointer-events-none" />

                    <div className="flex items-center gap-4 mb-4">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-3xl">
                                menu_book
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-primary mb-0.5">
                                Welcome to CookCost
                            </p>
                            <h2 className="text-xl font-black text-white leading-tight">
                                Want some sample recipes?
                            </h2>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                        We've prepared <span className="text-white font-bold">15+ recipes</span> and{' '}
                        <span className="text-white font-bold">50+ ingredients</span> to help you explore the app right away.
                    </p>
                </div>

                {/* Info tip */}
                <div className="flex items-start gap-3 px-7 py-5 border-b border-white/5">
                    <div className="w-7 h-7 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-secondary text-base">
                            lightbulb
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        You can always do this later from{' '}
                        <span className="text-white font-bold">Profile</span>
                        {' → '}
                        <span className="text-white font-bold">Import Dummy Data</span>.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex h-16">
                    <button
                        onClick={onSkip}
                        className="flex-1 font-bold text-gray-400 hover:bg-white/5 active:bg-white/10 transition-colors border-r border-white/5 text-sm"
                    >
                        Skip for Now
                    </button>
                    <button
                        onClick={onImport}
                        className="flex-1 font-black text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">
                            download
                        </span>
                        Yes, Import!
                    </button>
                </div>
            </div>
        </div>
    );
};
