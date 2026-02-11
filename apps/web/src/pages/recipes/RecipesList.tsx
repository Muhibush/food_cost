import React, { useState } from 'react';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types';

export const RecipesList: React.FC = () => {
    const navigate = useNavigate();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredRecipes = recipes.filter(rec =>
        rec.name.toLowerCase().includes(search.toLowerCase())
    );

    const calculateCost = (recipe: Recipe) => {
        if (recipe.manualCost) return recipe.manualCost;

        return recipe.ingredients.reduce((total, item) => {
            const ingredient = getIngredient(item.ingredientId);
            if (!ingredient) return total;
            // simplified cost: (price * quantity) assuming unit consistency.
            // We will improve this logic in the "Cost Calculation Logic" phase
            // Assuming price is PER UNIT.
            return total + (ingredient.price * item.quantity);
        }, 0);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-32 -mx-5 -mt-4">
            <header className="sticky top-0 z-50 bg-background-dark px-5 pt-8 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-5">
                    <button className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <h1 className="text-xl font-bold text-white absolute left-1/2 -translate-x-1/2">Recipes</h1>
                    <div className="w-10"></div>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                    </div>
                    <input
                        className="block w-full pl-12 pr-4 py-4 bg-surface-dark border-none ring-1 ring-white/5 rounded-2xl text-[15px] focus:ring-2 focus:ring-primary outline-none text-white placeholder-gray-500 transition-shadow"
                        placeholder="Search recipes..."
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-6 pb-20">
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Recipes</h3>
                        <span className="text-xs text-gray-500 font-medium">{filteredRecipes.length} items</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {filteredRecipes.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                <span className="material-symbols-outlined text-6xl opacity-20 mb-4 block">menu_book</span>
                                <p>No recipes found.</p>
                                <button
                                    onClick={() => navigate('/recipes/new')}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Create your first recipe
                                </button>
                            </div>
                        ) : (
                            filteredRecipes.map((rec) => {
                                const totalCost = calculateCost(rec);
                                const costPerPortion = totalCost / (rec.yield || 1);

                                return (
                                    <div
                                        key={rec.id}
                                        onClick={() => navigate(`/recipes/${rec.id}`)}
                                        className="bg-surface-dark p-4 rounded-2xl shadow-sm border border-white/5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                                    >
                                        <div className="flex gap-4">
                                            <div
                                                className="h-24 w-24 rounded-xl bg-gray-800 bg-cover bg-center shrink-0 shadow-inner flex items-center justify-center overflow-hidden"
                                                style={rec.image ? { backgroundImage: `url('${rec.image}')` } : {}}
                                            >
                                                {!rec.image && (
                                                    <span className="material-symbols-outlined text-gray-600 text-3xl opacity-50">fastfood</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="font-bold text-[17px] text-white truncate pr-2 leading-tight">{rec.name}</h4>
                                                    <p className="text-xs text-gray-400 line-clamp-1 mt-1.5 font-medium">
                                                        {rec.description || `${rec.ingredients.length} ingredients • Yields ${rec.yield} portions`}
                                                    </p>
                                                </div>
                                                <div className="flex items-end justify-between mt-2">
                                                    <div className="text-[15px] font-extrabold text-white">
                                                        Rp {Math.round(costPerPortion).toLocaleString()}
                                                        <span className="text-[11px] font-medium text-gray-500 ml-1 tracking-tight">/ portion</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>

            <div className="fixed bottom-28 right-6 z-40">
                <button
                    onClick={() => navigate('/recipes/new')}
                    className="bg-primary hover:bg-primary-dark text-white h-14 w-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ring-4 ring-background-dark"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>
        </div>
    );
};
