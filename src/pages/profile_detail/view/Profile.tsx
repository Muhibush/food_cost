import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/ui/Header';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useOrdersStore } from '../../order_list/store/useOrdersStore';
import { useProfileStore } from '../../edit_profile/store/useProfileStore';
import { useConfigStore } from '../../../store/useConfigStore';
import { exportAppData, importAppData } from '../../../utils/dataUtils';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [clickCount, setClickCount] = useState(0);
    const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    const [isResetAppOpen, setIsResetAppOpen] = useState(false);
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const { ingredients, addIngredient, clearAllIngredients } = useIngredientsStore();
    const { recipes, addRecipe, clearAllRecipes } = useRecipesStore();
    const { orders, addOrder, clearAllOrders } = useOrdersStore();
    const { profile, resetProfile } = useProfileStore();
    const { setHasBeenSeeded } = useConfigStore();

    const handleResetApp = () => {
        clearAllOrders();
        clearAllRecipes();
        clearAllIngredients();
        resetProfile();
        setHasBeenSeeded(true); // Prevent re-seeding on next load
        setIsResetAppOpen(false);
        navigate('/'); // Redirect to home/login after reset
    };

    const handleExportData = () => {
        exportAppData(ingredients, recipes, orders);
        setStatusModal({
            isOpen: true,
            title: 'Export Successful',
            message: 'Your data has been exported as a JSON file.',
            type: 'success'
        });
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        importAppData(file)
            .then((data) => {
                // Clear existing data before importing
                clearAllIngredients();
                clearAllRecipes();
                clearAllOrders();

                // Add imported data
                data.ingredients.forEach((ing) => addIngredient(ing));
                data.recipes.forEach((rec) => addRecipe(rec));
                data.orders.forEach((ord) => addOrder(ord));

                setStatusModal({
                    isOpen: true,
                    title: 'Import Successful',
                    message: 'All your ingredients, recipes, and orders have been imported.',
                    type: 'success'
                });
            })
            .catch((error) => {
                console.error('Import failed:', error);
                setStatusModal({
                    isOpen: true,
                    title: 'Import Failed',
                    message: 'Please make sure the file is a valid JSON backup.',
                    type: 'error'
                });
            });
    };

    const handleVersionClick = () => {
        const newCount = clickCount + 1;

        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

        if (newCount >= 7) {
            setClickCount(0);
            navigate('/developer');
        } else {
            setClickCount(newCount);
            clickTimerRef.current = setTimeout(() => {
                setClickCount(0);
            }, 2000); // Reset after 2 seconds of inactivity
        }
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-4">
            <Header title="Profile" />

            <main className="flex-1 flex flex-col px-6 py-8 pb-4 gap-10">
                {/* Profile Section */}
                <section className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-surface-dark border-[3px] border-primary p-1.5 shadow-2xl shadow-primary/20">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${profile.avatar}')` }}
                            ></div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mb-1">{profile.name}</h2>
                    <p className="text-gray-500 text-sm font-bold tracking-wide mb-2">@{profile.username}</p>
                    <p className="text-gray-400 text-sm font-medium bg-surface-dark px-4 py-1.5 rounded-full border border-white/5">{profile.description}</p>
                </section>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Profile Settings</h3>
                        <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group active:bg-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">edit_note</span>
                                    </div>
                                    <span className="font-bold text-base">Edit Profile</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="space-y-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Data Management</h3>
                        <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportData}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-xl font-bold">file_upload</span>
                                        </div>
                                        <span className="font-bold text-base">Import Data</span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                                </button>
                            </div>
                            <button
                                onClick={handleExportData}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group active:bg-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-bold">file_download</span>
                                    </div>
                                    <span className="font-bold text-base">Export Data</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </section>


                    {/* Footer Actions */}
                    <div className="pt-4 flex flex-col items-center gap-8">
                        <button
                            onClick={() => setIsResetAppOpen(true)}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-8 py-5 rounded-2xl font-black text-base shadow-lg shadow-red-500/5 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl font-bold">restart_alt</span>
                            Reset App
                        </button>
                        <div
                            onClick={handleVersionClick}
                            className="flex flex-col items-center gap-1 opacity-40 active:opacity-100 transition-opacity cursor-pointer select-none"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">App Version 2.4.0</p>
                            <p className="text-[9px] font-bold text-gray-500">Build 102 • Production</p>
                        </div>
                    </div>
                </div>
            </main>

            <AlertDialog
                isOpen={isResetAppOpen}
                title="Reset Application?"
                message="This will permanently delete all recipes, ingredients, orders, and reset your profile. This action cannot be undone."
                cancelLabel="Cancel"
                confirmLabel="Reset App"
                onCancel={() => setIsResetAppOpen(false)}
                onConfirm={handleResetApp}
                isDestructive
            />

            <AlertDialog
                isOpen={statusModal.isOpen}
                title={statusModal.title}
                message={statusModal.message}
                confirmLabel="Got it"
                onCancel={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                showCancelButton={false}
                type={statusModal.type === 'success' ? 'success' : 'error'}
            />
        </div>
    );
};
