import React, { useState } from 'react';
import { useRecipesStore } from '../store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format';
import { Recipe } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Header } from '../../../components/ui/Header';
import { MediaCard } from '../../../components/ui/MediaCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';
import { cn } from '../../../utils/cn';

export const RecipesList: React.FC = () => {
    const navigate = useNavigate();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredRecipes = recipes
        .filter(rec => rec.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const calculateCost = (recipe: Recipe) => {
        if (recipe.manualCost) return recipe.manualCost;

        return recipe.ingredients.reduce((total, item) => {
            const ingredient = getIngredient(item.ingredientId);
            if (!ingredient) return total;
            return total + (ingredient.price * item.quantity);
        }, 0);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-32 -mx-5 -mt-4">
            <Header
                title="Recipes"
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search recipes..."
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                }
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredRecipes.length === 0 ? (
                    <EmptyState
                        icon="menu_book"
                        title="No recipes found"
                        message={search ? "Try a different search term" : "Start by creating your first recipe"}
                        action={{
                            label: search ? "Clear search" : "Create first recipe",
                            onClick: () => search ? setSearch('') : navigate('/recipes/new')
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRecipes.map((rec) => {
                            const totalCost = calculateCost(rec);
                            const costPerPortion = totalCost / (rec.yield || 1);
                            const iconConfig = getRecipeIconConfig(rec.name);

                            return (
                                <MediaCard
                                    key={rec.id}
                                    onClick={() => navigate(`/recipes/${rec.id}`)}
                                    image={rec.image}
                                    icon={iconConfig.icon}
                                    title={rec.name}
                                    iconContainerClassName={cn(
                                        !rec.image && iconConfig.bgClass,
                                        !rec.image && iconConfig.colorClass
                                    )}
                                    subtitle={
                                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 font-medium">
                                            <span>{rec.ingredients.length} Ingredients</span>
                                            <span className="size-1 bg-white/10 rounded-full"></span>
                                            <span>{rec.yield || 0} Base Yield</span>
                                        </div>
                                    }
                                    bottomElement={
                                        <div className="text-[15px] font-extrabold text-white">
                                            <span className="text-primary">Rp {formatCurrency(Math.round(costPerPortion))}</span>
                                            <span className="text-[11px] font-medium text-text-muted ml-1 tracking-tight">/ portion</span>
                                        </div>
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <FAB
                icon="add"
                onClick={() => navigate('/recipes/new')}
            />
        </div>
    );
};
