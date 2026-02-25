import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { Icon } from '../../../components/ui/Icon';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { useOrderDraftStore } from '../../order_entry/store/useOrderDraftStore';
import { useOrderEditStore } from '../../order_detail/store/useOrderEditStore';
import { formatCurrency } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { Recipe } from '../../../types';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';

interface SelectionState {
    selectedRecipeIds: string[];
    returnPath: string;
    storeType?: 'draft' | 'edit'; // New prop to determine which store to update
    orderData?: any;
}

export const RecipeSelection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as SelectionState;
    const storeType = state?.storeType || 'draft';

    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();

    // Choose the correct store based on storeType
    const draftStore = useOrderDraftStore();
    const editStore = useOrderEditStore();

    const store = storeType === 'edit' ? editStore : draftStore;
    const { syncItemsFromIds } = store;

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
        syncItemsFromIds(selectedIds);
        navigate(-1);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-32">
            <Header
                title="Select Recipes"
                showBackButton
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search recipes..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                }
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                <section className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">Available Recipes</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRecipes.map(recipe => {
                            const isSelected = selectedIds.includes(recipe.id);
                            const cost = getRecipeCost(recipe);
                            const iconConfig = getRecipeIconConfig(recipe.name);

                            return (
                                <div
                                    key={recipe.id}
                                    onClick={() => toggleSelection(recipe.id)}
                                    className={cn(
                                        "bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border-2 relative overflow-hidden group active:scale-[0.99] transition-all cursor-pointer",
                                        isSelected ? "border-primary shadow-lg shadow-primary/5" : "border-gray-100 dark:border-gray-700"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div
                                            className={cn(
                                                "h-24 w-24 rounded-xl bg-cover bg-center shrink-0 shadow-inner flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800",
                                                !recipe.image && iconConfig.bgClass,
                                                !recipe.image && iconConfig.colorClass
                                            )}
                                            style={recipe.image ? { backgroundImage: `url('${recipe.image}')` } : {}}
                                        >
                                            {!recipe.image && (
                                                <Icon name={iconConfig.icon} size="xl" className={iconConfig.colorClass} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-base text-slate-900 dark:text-white truncate pr-6">{recipe.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{recipe.description || 'No description'}</p>
                                            </div>
                                            <div className="flex items-end justify-between mt-2">
                                                <div className={cn(
                                                    "text-sm font-extrabold",
                                                    isSelected ? "text-primary" : "text-slate-700 dark:text-gray-200"
                                                )}>
                                                    Rp {formatCurrency(Math.round(cost))} <span className="text-xs font-normal text-gray-400">/ portion</span>
                                                </div>
                                                <button className={cn(
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
                <div className={cn(
                    "bg-white dark:bg-white text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-300 pointer-events-auto border border-gray-100",
                    selectedIds.length > 0 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white h-11 w-11 rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-primary/40 ring-4 ring-white">
                            {selectedIds.length}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Recipes Selected</span>
                            <span className="font-extrabold text-slate-900 text-[15px]">Est. Base Cost: Rp {formatCurrency(Math.round(totalBaseCost))}</span>
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
