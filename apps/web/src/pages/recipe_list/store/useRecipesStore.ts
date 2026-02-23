import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '../../../types';

interface RecipesState {
    recipes: Recipe[];
    addRecipe: (recipe: Recipe) => void;
    updateRecipe: (id: string, updates: Partial<Recipe>) => void;
    removeRecipe: (id: string) => void;
    getRecipe: (id: string) => Recipe | undefined;
    clearAllRecipes: () => void;
}

export const useRecipesStore = create<RecipesState>()(
    persist(
        (set, get) => ({
            recipes: [],
            addRecipe: (recipe) =>
                set((state) => ({ recipes: [...state.recipes, recipe] })),
            updateRecipe: (id, updates) =>
                set((state) => ({
                    recipes: state.recipes.map((rec) =>
                        rec.id === id ? { ...rec, ...updates } : rec
                    ),
                })),
            removeRecipe: (id) =>
                set((state) => ({
                    recipes: state.recipes.filter((rec) => rec.id !== id),
                })),
            getRecipe: (id) => get().recipes.find((rec) => rec.id === id),
            clearAllRecipes: () => set({ recipes: [] }),
        }),
        {
            name: 'food-cost-recipes',
        }
    )
);
