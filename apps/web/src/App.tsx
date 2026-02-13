import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DesignSystem } from './pages/design/DesignSystem/DesignSystem';
import { OrderPage as Order } from './pages/orders/OrderEntry/OrderEntry';
import { Layout } from './components/layout/Layout';
import { IngredientsList } from './pages/ingredients/IngredientsList/IngredientsList';
import { IngredientForm } from './pages/ingredients/IngredientForm/IngredientForm';
import { RecipesList } from './pages/recipes/RecipesList/RecipesList';
import { RecipeForm } from './pages/recipes/RecipeForm/RecipeForm';
import { OrdersList } from './pages/orders/OrdersList/OrdersList';
import { OrderForm } from './pages/orders/OrderForm/OrderForm';
import { HistoryPage } from './pages/orders/History/HistoryPage';
import { OrderDetail } from './pages/orders/OrderDetail/OrderDetail';
import { EditProfile } from './pages/account/EditProfile/EditProfile';
import { ChangePin } from './pages/account/ChangePin/ChangePin';
import { Login } from './pages/auth/Login/Login';
import { Register } from './pages/auth/Register/Register';
import { RecipeSelection } from './pages/orders/RecipeSelection/RecipeSelection';
import { Profile } from './pages/account/Profile/Profile';
import { DeveloperPage } from './pages/developer/DeveloperPage';

const router = createBrowserRouter([
    {
        path: '/design-system',
        element: <DesignSystem />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: <Layout />,
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
                path: '/orders/new',
                element: <OrderForm />,
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
                path: '/profile/change-pin',
                element: <ChangePin />,
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

function App() {
    return <RouterProvider router={router} />;
}

export default App;
