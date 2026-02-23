import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ingredient } from '../../../types';

interface IngredientsState {
    ingredients: Ingredient[];
    addIngredient: (ingredient: Ingredient) => void;
    updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
    removeIngredient: (id: string) => void;
    getIngredient: (id: string) => Ingredient | undefined;
    clearAllIngredients: () => void;
}

export const useIngredientsStore = create<IngredientsState>()(
    persist(
        (set, get) => ({
            ingredients: [],
            addIngredient: (ingredient) =>
                set((state) => ({ ingredients: [...state.ingredients, ingredient] })),
            updateIngredient: (id, updates) =>
                set((state) => ({
                    ingredients: state.ingredients.map((ing) =>
                        ing.id === id ? { ...ing, ...updates } : ing
                    ),
                })),
            removeIngredient: (id) =>
                set((state) => ({
                    ingredients: state.ingredients.filter((ing) => ing.id !== id),
                })),
            getIngredient: (id) => get().ingredients.find((ing) => ing.id === id),
            clearAllIngredients: () => set({ ingredients: [] }),
        }),
        {
            name: 'food-cost-ingredients',
        }
    )
);
