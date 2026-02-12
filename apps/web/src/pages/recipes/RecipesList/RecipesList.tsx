import React, { useState } from 'react';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../../types';
import { Input } from '../../../components/ui/Input';

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
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Recipes</h1>
                    <button
                        onClick={() => navigate('/recipes/new')}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark text-white border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                <Input
                    icon="search"
                    placeholder="Search recipes..."
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>

            <main className="flex-1 flex flex-col px-6 pt-6 pb-20">
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">My Recipes</h3>
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
