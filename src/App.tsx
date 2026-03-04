import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DesignSystem } from './pages/design_system/view/DesignSystem';
import { OrderPage as Order } from './pages/order_entry/view/OrderEntry';
import { Layout } from './components/layout/Layout';
import { IngredientsList } from './pages/ingredient_list/view/IngredientsList';
import { IngredientForm } from './pages/ingredient_form/view/IngredientForm';
import { RecipesList } from './pages/recipe_list/view/RecipesList';
import { RecipeForm } from './pages/recipe_form/view/RecipeForm';
import { OrdersList } from './pages/order_list/view/OrdersList';
import { HistoryPage } from './pages/order_history/view/HistoryPage';
import { OrderDetail } from './pages/order_detail/view/OrderDetail';
import { EditProfile } from './pages/edit_profile/view/EditProfile';
import { Login } from './pages/auth_login/view/Login';
import { RecipeSelection } from './pages/recipe_selection/view/RecipeSelection';
import { Profile } from './pages/profile_detail/view/Profile';
import { IntroPage } from './pages/intro/view/IntroPage';
import { DeveloperPage } from './pages/developer_page/view/DeveloperPage';
import { AuthGuard } from './components/layout/AuthGuard';

const router = createBrowserRouter([
    {
        path: '/design-system',
        element: <DesignSystem />,
    },
    {
        path: '/intro',
        element: <IntroPage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [
            {
                path: '/',
                element: <Order />,
            },
            {
                path: '/history',
                element: <HistoryPage />,
            },
            {
                path: '/ingredients',
                element: <IngredientsList />,
            },
            {
                path: '/ingredients/new',
                element: <IngredientForm />,
            },
            {
                path: '/ingredients/:id',
                element: <IngredientForm />,
            },
            {
                path: '/recipes',
                element: <RecipesList />,
            },
            {
                path: '/recipes/new',
                element: <RecipeForm />,
            },
            {
                path: '/recipes/:id',
                element: <RecipeForm />,
            },
            {
                path: '/orders',
                element: <OrdersList />,
            },
            {
                path: '/orders/select-recipes',
                element: <RecipeSelection />,
            },
            {
                path: '/orders/:id',
                element: <OrderDetail />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/profile/edit',
                element: <EditProfile />,
            },
            {
                path: '/developer',
                element: <DeveloperPage />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            }
        ],
    },
]);

import { useState } from 'react';
import { SplashScreen } from './components/ui/SplashScreen';

function App() {
    const [showSplash, setShowSplash] = useState(true);


    return (
        <>
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
