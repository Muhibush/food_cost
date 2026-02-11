import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DesignSystem } from './pages/design/DesignSystem';
import { OrderPage as Order } from './pages/orders/OrderPage';
import { Layout } from './components/layout/Layout';
import { IngredientsList } from './pages/ingredients/IngredientsList';
import { IngredientForm } from './pages/ingredients/IngredientForm';
import { RecipesList } from './pages/recipes/RecipesList';
import { RecipeForm } from './pages/recipes/RecipeForm';
import { OrdersList } from './pages/orders/OrdersList';
import { OrderForm } from './pages/orders/OrderForm';
import { HistoryPage } from './pages/orders/HistoryPage';
import { OrderDetail } from './pages/orders/OrderDetail';
import { EditProfile } from './pages/account/EditProfile';
import { ChangePin } from './pages/account/ChangePin';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { RecipeSelection } from './pages/orders/RecipeSelection';
import { Profile } from './pages/account/Profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<Layout />}>
                    <Route path="/" element={<Order />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/ingredients" element={<IngredientsList />} />
                    <Route path="/ingredients/new" element={<IngredientForm />} />
                    <Route path="/ingredients/:id" element={<IngredientForm />} />
                    <Route path="/recipes" element={<RecipesList />} />
                    <Route path="/recipes/new" element={<RecipeForm />} />
                    <Route path="/recipes/:id" element={<RecipeForm />} />
                    <Route path="/orders" element={<OrdersList />} />
                    <Route path="/orders/new" element={<OrderForm />} />
                    <Route path="/orders/select-recipes" element={<RecipeSelection />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/profile/change-pin" element={<ChangePin />} />
                    {/* Add other routes here later */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
