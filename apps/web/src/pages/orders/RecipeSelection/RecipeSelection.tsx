import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Icon } from '../../../components/ui/Icon';
import { clsx } from 'clsx';
import { Recipe } from '../../../types';

interface SelectionState {
    selectedRecipeIds: string[];
    returnPath: string;
    orderData?: any; // To preserve partial form data if needed
}

export const RecipeSelection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as SelectionState;

    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>(state?.selectedRecipeIds || []);

    const filteredRecipes = useMemo(() => {
        return recipes.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [recipes, searchQuery]);

    const getRecipeCost = (recipe: Recipe) => {
        if (recipe.manualCost) return recipe.manualCost;
        return recipe.ingredients.reduce((acc, item) => {
            const ing = getIngredient(item.ingredientId);
            return acc + (ing ? ing.price * item.quantity : 0);
        }, 0) / (recipe.yield || 1);
    };

    const toggleSelection = (recipeId: string) => {
        setSelectedIds(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const selectedRecipes = useMemo(() => {
        return recipes.filter(r => selectedIds.includes(r.id));
    }, [recipes, selectedIds]);

    const totalBaseCost = useMemo(() => {
        return selectedRecipes.reduce((sum, r) => sum + getRecipeCost(r), 0);
    }, [selectedRecipes, getIngredient]);

    const handleConfirm = () => {
        navigate(state?.returnPath || '/', {
            state: {
                ...state,
                selectedRecipeIds: selectedIds
            }
        });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-32">
            <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-5 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-slate-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined font-bold">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Select Recipes</h1>
                    <div className="w-8"></div>
                </div>
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all"
                        placeholder="Search recipes..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-5 pt-4">
                <section className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">Available Recipes</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRecipes.map(recipe => {
                            const isSelected = selectedIds.includes(recipe.id);
                            const cost = getRecipeCost(recipe);

                            return (
                                <div
                                    key={recipe.id}
                                    onClick={() => toggleSelection(recipe.id)}
                                    className={clsx(
                                        "bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border-2 relative overflow-hidden group active:scale-[0.99] transition-all cursor-pointer",
                                        isSelected ? "border-primary shadow-lg shadow-primary/5" : "border-gray-100 dark:border-gray-700"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div
                                            className="h-24 w-24 rounded-xl bg-gray-100 dark:bg-gray-800 bg-cover bg-center shrink-0 shadow-inner"
                                            style={{ backgroundImage: `url('${recipe.image || 'https://via.placeholder.com/150'}')` }}
                                        ></div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-base text-slate-900 dark:text-white truncate pr-6">{recipe.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{recipe.description || 'No description'}</p>
                                            </div>
                                            <div className="flex items-end justify-between mt-2">
                                                <div className={clsx(
                                                    "text-sm font-extrabold",
                                                    isSelected ? "text-primary" : "text-slate-700 dark:text-gray-200"
                                                )}>
                                                    Rp {Math.round(cost).toLocaleString()} <span className="text-xs font-normal text-gray-400">/ portion</span>
                                                </div>
                                                <button className={clsx(
                                                    "h-8 px-4 rounded-lg text-xs font-bold flex items-center gap-1 transition-all",
                                                    isSelected
                                                        ? "bg-primary text-white shadow-sm"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                )}>
                                                    {isSelected && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                                    {isSelected ? 'Added' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                                            Selected
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {filteredRecipes.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3 text-center">
                                <Icon name="search_off" size="xl" className="opacity-20" />
                                <p className="text-sm font-medium">No recipes found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Selection Summary Overlay */}
            <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-4 pointer-events-none bg-gradient-to-t from-background-light dark:from-background-dark to-transparent">
                <div className={clsx(
                    "bg-white dark:bg-white text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-300 pointer-events-auto border border-gray-100",
                    selectedIds.length > 0 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white h-11 w-11 rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-primary/40 ring-4 ring-white">
                            {selectedIds.length}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Recipes Selected</span>
                            <span className="font-extrabold text-slate-900 text-[15px]">Est. Base Cost: Rp {Math.round(totalBaseCost).toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center h-12 w-12 active:scale-90 group"
                    >
                        <span className="material-symbols-outlined font-black group-hover:scale-110 transition-transform">check</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
