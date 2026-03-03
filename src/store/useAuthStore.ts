import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useIngredientsStore } from '../pages/ingredient_list/store/useIngredientsStore';
import { useRecipesStore } from '../pages/recipe_list/store/useRecipesStore';
import { useOrdersStore } from '../pages/order_list/store/useOrdersStore';
import { useProfileStore } from '../pages/edit_profile/store/useProfileStore';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    initialize: () => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    let unsubs: (() => void)[] = [];

    return {
        user: null,
        isLoading: true,
        initialize: () => {
            onAuthStateChanged(auth, (user) => {
                set({ user, isLoading: false });

                // Cleanup previous listeners if any
                unsubs.forEach(unsub => unsub());
                unsubs = [];

                if (user) {
                    unsubs.push(useIngredientsStore.getState().initListener());
                    unsubs.push(useRecipesStore.getState().initListener());
                    unsubs.push(useOrdersStore.getState().initListener());
                    unsubs.push(useProfileStore.getState().initListener(user));
                } else {
                    useIngredientsStore.getState().clearAllIngredients();
                    useRecipesStore.getState().clearAllRecipes();
                    useOrdersStore.getState().clearAllOrders();
                    useProfileStore.getState().resetProfile();
                }
            });
        },
        logout: async () => {
            const { signOut } = await import('firebase/auth');
            await signOut(auth);
        }
    };
});
