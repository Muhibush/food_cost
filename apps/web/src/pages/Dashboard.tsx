import { useOrdersStore } from '../store/useOrdersStore';
import { useRecipesStore } from '../store/useRecipesStore';
import { useIngredientsStore } from '../store/useIngredientsStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { ingredients } = useIngredientsStore();

    const activeOrders = orders.filter(o => o.status === 'pending').length;
    const totalRecipes = recipes.length;
    const lowStockIngredients = ingredients.filter(i => i.stock < (i.minStock || 0)).length;

    return (
        <div className="p-6 flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold">Dashboard</h1>
                    <p className="text-text-muted text-sm">Welcome back, Chef!</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center">
                    <Icon name="notifications" />
                </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary text-white border-none">
                    <h3 className="text-3xl font-extrabold mb-1">{activeOrders}</h3>
                    <p className="text-xs font-bold uppercase tracking-wide opacity-90">Active Orders</p>
                </Card>
                <Card>
                    <h3 className="text-3xl font-extrabold mb-1 text-primary">{totalRecipes}</h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Total Recipes</p>
                </Card>
            </div>

            <section>
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/orders/new')}>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Icon name="add_shopping_cart" />
                        </div>
                        <span className="text-xs font-bold">New Order</span>
                    </Button>
                    <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/recipes/new')}>
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                            <Icon name="restaurant_menu" />
                        </div>
                        <span className="text-xs font-bold">New Recipe</span>
                    </Button>
                </div>
            </section>

            {lowStockIngredients > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-4 text-danger flex items-center gap-2">
                        <Icon name="warning" /> Low Stock Alert
                    </h2>
                    <Card className="border-danger/20 bg-danger/5">
                        <p className="text-sm">
                            <span className="font-bold">{lowStockIngredients} ingredients</span> are running low on stock. Check inventory immediately.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 pl-0 text-danger hover:bg-danger/10" onClick={() => navigate('/ingredients')}>
                            View Inventory →
                        </Button>
                    </Card>
                </section>
            )}
        </div>
    );
};
