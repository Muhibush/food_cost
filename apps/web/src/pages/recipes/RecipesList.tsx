import React, { useState } from 'react';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types';

export const RecipesList: React.FC = () => {
    const navigate = useNavigate();
    const { recipes, removeRecipe } = useRecipesStore();
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
            // Logic to convert units would be needed here for perfect accuracy,
            // but for now assuming unit consistency or simplistic calc
            // We will improve this logic in the "Cost Calculation Logic" phase
            // simplified cost: (price / stock * quantity) is risky if units mismatch.
            // Assuming price is PER UNIT.
            return total + (ingredient.price * item.quantity);
        }, 0);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this recipe?')) {
            removeRecipe(id);
        }
    };

    return (
        <div className="p-6 pb-24 flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold">Recipes</h1>
                <Button size="icon" onClick={() => navigate('/recipes/new')}>
                    <Icon name="add" />
                </Button>
            </header>

            <div className="sticky top-0 z-10 bg-background-dark py-2">
                <Input
                    placeholder="Search recipes..."
                    icon="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-4">
                {filteredRecipes.length === 0 ? (
                    <div className="text-center text-text-muted py-10">
                        <Icon name="menu_book" size="xl" className="opacity-20 mb-4" />
                        <p>No recipes found.</p>
                        <Button variant="ghost" onClick={() => navigate('/recipes/new')}>Create your first recipe</Button>
                    </div>
                ) : (
                    filteredRecipes.map((rec) => {
                        const totalCost = calculateCost(rec);
                        const costPerPortion = totalCost / (rec.yield || 1);

                        return (
                            <Card
                                key={rec.id}
                                hoverEffect
                                onClick={() => navigate(`/recipes/${rec.id}`)}
                                className="flex justify-between items-start"
                            >
                                <div>
                                    <h3 className="font-bold text-base">{rec.name}</h3>
                                    <p className="text-xs text-text-muted mt-1">
                                        Yields: {rec.yield} portions
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                            {rec.ingredients.length} Ingred.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-right">
                                        <span className="font-bold text-base">Rp {Math.round(costPerPortion).toLocaleString()}</span>
                                        <span className="text-[10px] text-text-muted block uppercase">/portion</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-text-muted hover:text-danger -mr-2 h-8 w-8"
                                        onClick={(e) => handleDelete(rec.id, e)}
                                    >
                                        <Icon name="delete" size="sm" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};
