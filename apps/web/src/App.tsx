import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
                    <Route path="/developer" element={<DeveloperPage />} />
                    {/* Add other routes here later */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
