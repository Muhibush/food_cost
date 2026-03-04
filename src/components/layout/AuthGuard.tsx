import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useConfigStore } from '../../store/useConfigStore';
import { useIngredientsStore } from '../../pages/ingredient_list/store/useIngredientsStore';
import { useRecipesStore } from '../../pages/recipe_list/store/useRecipesStore';
import { useOrdersStore } from '../../pages/order_list/store/useOrdersStore';
import { generateDummyData } from '../../utils/dummyData';
import { SplashScreen } from '../ui/SplashScreen';
import { WelcomePopup } from '../ui/WelcomePopup';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading, initialize } = useAuthStore();
    const { hasSeenIntro } = useConfigStore();
    const location = useLocation();

    const { ingredients, isReady: ingredientsReady, addIngredient } = useIngredientsStore();
    const { recipes, isReady: recipesReady, addRecipe } = useRecipesStore();
    const { addOrder } = useOrdersStore();

    const [showWelcome, setShowWelcome] = useState(false);
    // Track which user UID we've already evaluated so popup doesn't re-trigger on re-renders
    const evaluatedUidRef = useRef<string | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Show welcome popup once Firestore has loaded and the user has no data (brand new user)
    useEffect(() => {
        if (!user || isLoading) return;
        if (!ingredientsReady || !recipesReady) return;
        // Only evaluate once per user session
        if (evaluatedUidRef.current === user.uid) return;

        evaluatedUidRef.current = user.uid;

        const isNewUser = ingredients.length === 0 && recipes.length === 0;
        if (isNewUser) {
            const timer = setTimeout(() => setShowWelcome(true), 600);
            return () => clearTimeout(timer);
        }
    }, [user, isLoading, ingredientsReady, recipesReady, ingredients.length, recipes.length]);

    const handleImportDummyData = () => {
        const data = generateDummyData();
        data.ingredients.forEach((ing) => addIngredient(ing));
        data.recipes.forEach((rec) => addRecipe(rec));
        data.orders.forEach((ord) => addOrder(ord));
        setShowWelcome(false);
    };

    const handleSkip = () => {
        setShowWelcome(false);
    };

    if (isLoading) {
        return <SplashScreen onFinish={() => { }} />;
    }

    if (!user) {
        if (!hasSeenIntro) {
            return <Navigate to="/intro" replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <>
            {children}
            <WelcomePopup
                isOpen={showWelcome}
                onImport={handleImportDummyData}
                onSkip={handleSkip}
            />
        </>
    );
};
