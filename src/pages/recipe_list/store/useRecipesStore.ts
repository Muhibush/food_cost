import { create } from 'zustand';
import { Recipe } from '../../../types';
import { db, auth } from '../../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, getDocs } from 'firebase/firestore';

import { getIngredientIconConfig } from '../../../utils/ingredientIcons';
import { sanitizeData } from '../../../utils/sanitize';

interface RecipesState {
    recipes: Recipe[];
    isReady: boolean;
    addRecipe: (recipe: Recipe) => Promise<void>;
    updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
    removeRecipe: (id: string) => Promise<void>;
    getRecipe: (id: string) => Recipe | undefined;
    clearAllRecipes: () => Promise<void>;
    initListener: () => () => void;
}

export const useRecipesStore = create<RecipesState>((set, get) => ({
    recipes: [],
    isReady: false,
    addRecipe: async (recipe) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        // Auto-generate icon and color if not provided
        if (!recipe.icon || !recipe.color) {
            const config = getIngredientIconConfig(recipe.name);
            recipe.icon = recipe.icon || config.icon;
            recipe.color = recipe.color || config.colorClass.replace('text-', '').replace('-400', '');
        }

        const docRef = doc(db, `users/${uid}/recipes`, recipe.id);
        await setDoc(docRef, sanitizeData(recipe));
    },
    updateRecipe: async (id, updates) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/recipes`, id);
        await setDoc(docRef, sanitizeData(updates), { merge: true });
    },
    removeRecipe: async (id) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/recipes`, id);
        await deleteDoc(docRef);
    },
    getRecipe: (id) => get().recipes.find((rec) => rec.id === id),
    clearAllRecipes: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            set({ recipes: [] });
            return;
        }
        const q = query(collection(db, `users/${uid}/recipes`));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        set({ recipes: [] });
    },
    initListener: () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return () => { };
        const q = query(collection(db, `users/${uid}/recipes`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipes: Recipe[] = [];
            snapshot.forEach((doc) => {
                recipes.push(doc.data() as Recipe);
            });
            set({ recipes, isReady: true });
        });
        return unsubscribe;
    }
}));
