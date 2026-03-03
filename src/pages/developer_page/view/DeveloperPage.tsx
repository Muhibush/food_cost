import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useOrdersStore } from '../../order_list/store/useOrdersStore';
import { generateDummyData } from '../../../utils/dummyData';
import { Ingredient, Recipe, Order } from '../../../types';

export const DeveloperPage: React.FC = () => {
    const navigate = useNavigate();
    const { addIngredient, ingredients } = useIngredientsStore();
    const { addRecipe, recipes } = useRecipesStore();
    const { addOrder, orders } = useOrdersStore();
    const [isImporting, setIsImporting] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);

    const handleImportDummyData = () => {
        setIsImporting(true);
        const { ingredients: dummyIngredients, recipes: dummyRecipes, orders: dummyOrders } = generateDummyData();

        // Add only if not already present (checking by name for simplicity in dev tool)
        dummyIngredients.forEach((ing: Ingredient) => {
            if (!ingredients.find(i => i.name === ing.name)) {
                addIngredient(ing);
            }
        });

        dummyRecipes.forEach((rec: Recipe) => {
            if (!recipes.find(r => r.name === rec.name)) {
                addRecipe(rec);
            }
        });

        dummyOrders.forEach((ord: Order) => {
            if (!orders.find(o => o.name === ord.name)) {
                addOrder(ord);
            }
        });

        setTimeout(() => {
            setIsImporting(false);
            setImportSuccess(true);
            setTimeout(() => setImportSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-20">
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center gap-4">
                <button
                    onClick={() => navigate('/profile')}
                    className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </button>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Developer Settings</h1>
            </header>

            <main className="flex-1 flex flex-col px-6 py-8 gap-8">
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Tools</h3>
                    <div className="bg-surface-dark rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                        <button
                            onClick={() => navigate('/design-system')}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group border-b border-white/5 active:bg-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-xl font-bold">palette</span>
                                </div>
                                <div>
                                    <span className="font-bold text-base block">Design System</span>
                                    <span className="text-xs text-gray-500">Preview UI components and styles</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">chevron_right</span>
                        </button>

                        <button
                            onClick={handleImportDummyData}
                            disabled={isImporting}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group active:bg-white/5 disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/10 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-xl font-bold">
                                        {importSuccess ? 'check_circle' : 'database'}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-bold text-base block">
                                        {isImporting ? 'Importing...' : importSuccess ? 'Data Imported!' : 'Import Dummy Data'}
                                    </span>
                                    <span className="text-xs text-gray-500">Populate stores with test content</span>
                                </div>
                            </div>
                            {isImporting ? (
                                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1"></div>
                            ) : (
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all">download</span>
                            )}
                        </button>
                    </div>
                </section>

                <div className="bg-surface-dark/50 border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 leading-relaxed italic">
                        Note: Importing dummy data will only add missing items (checked by name). It will not delete your existing data.
                    </p>
                </div>
            </main>
        </div>
    );
};
