import { create } from 'zustand';
import { Ingredient } from '../../../types';
import { db, auth } from '../../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, getDocs } from 'firebase/firestore';

import { getIngredientIconConfig } from '../../../utils/ingredientIcons';
import { sanitizeData } from '../../../utils/sanitize';

interface IngredientsState {
    ingredients: Ingredient[];
    addIngredient: (ingredient: Ingredient) => Promise<void>;
    updateIngredient: (id: string, updates: Partial<Ingredient>) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>;
    getIngredient: (id: string) => Ingredient | undefined;
    clearAllIngredients: () => Promise<void>;
    initListener: () => () => void;
}

export const useIngredientsStore = create<IngredientsState>((set, get) => ({
    ingredients: [],
    addIngredient: async (ingredient) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        // Auto-generate icon and color if not provided
        if (!ingredient.icon || !ingredient.color) {
            const config = getIngredientIconConfig(ingredient.name);
            ingredient.icon = ingredient.icon || config.icon;
            ingredient.color = ingredient.color || config.colorClass.replace('text-', '').replace('-400', '');
        }

        const docRef = doc(db, `users/${uid}/ingredients`, ingredient.id);
        await setDoc(docRef, sanitizeData(ingredient));
    },
    updateIngredient: async (id, updates) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/ingredients`, id);
        await setDoc(docRef, sanitizeData(updates), { merge: true });
    },
    removeIngredient: async (id) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/ingredients`, id);
        await deleteDoc(docRef);
    },
    getIngredient: (id) => get().ingredients.find((ing) => ing.id === id),
    clearAllIngredients: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            set({ ingredients: [] });
            return;
        }
        const q = query(collection(db, `users/${uid}/ingredients`));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        set({ ingredients: [] });
    },
    initListener: () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return () => { };
        const q = query(collection(db, `users/${uid}/ingredients`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ingredients: Ingredient[] = [];
            snapshot.forEach((doc) => {
                ingredients.push(doc.data() as Ingredient);
            });
            set({ ingredients });
        });
        return unsubscribe;
    }
}));
