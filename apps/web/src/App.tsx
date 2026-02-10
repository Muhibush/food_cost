import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DesignSystem } from './pages/DesignSystem';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { IngredientsList } from './pages/ingredients/IngredientsList';
import { IngredientForm } from './pages/ingredients/IngredientForm';
import { RecipesList } from './pages/recipes/RecipesList';
import { RecipeForm } from './pages/recipes/RecipeForm';
import { OrdersList } from './pages/orders/OrdersList';
import { OrderForm } from './pages/orders/OrderForm';
import { Profile } from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/design-system" element={<DesignSystem />} />

                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/ingredients" element={<IngredientsList />} />
                    <Route path="/ingredients/new" element={<IngredientForm />} />
                    <Route path="/ingredients/:id" element={<IngredientForm />} />
                    <Route path="/recipes" element={<RecipesList />} />
                    <Route path="/recipes/new" element={<RecipeForm />} />
                    <Route path="/recipes/:id" element={<RecipeForm />} />
                    <Route path="/orders" element={<OrdersList />} />
                    <Route path="/orders/new" element={<OrderForm />} />
                    <Route path="/orders/:id" element={<OrderForm />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Add other routes here later */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
