import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrdersStore } from '../../store/useOrdersStore';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Order, OrderItem, Recipe } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const OrderForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addOrder, updateOrder, getOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Order, 'id'>>({
        name: `Order #${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        items: [],
        status: 'pending',
        totalCost: 0
    });

    const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const existing = getOrder(id);
            if (existing) {
                setFormData(existing);
            }
        }
    }, [id, getOrder]);

    // Calculate recipe cost (helper)
    const getRecipeCost = (recipeId: string) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return 0;
        if (recipe.manualCost) return recipe.manualCost;

        const total = recipe.ingredients.reduce((acc, item) => {
            const ing = getIngredient(item.ingredientId);
            return acc + (ing ? ing.price * item.quantity : 0);
        }, 0);
        return total / (recipe.yield || 1);
    }

    // Recalculate total cost whenever items change
    const calculatedTotal = useMemo(() => {
        return formData.items.reduce((total, item) => {
            const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);
            return total + (unitCost * item.quantity);
        }, 0);
    }, [formData.items, recipes, getIngredient]);

    // Update total cost in state if it differs
    useEffect(() => {
        if (formData.totalCost !== calculatedTotal) {
            setFormData(prev => ({ ...prev, totalCost: calculatedTotal }));
        }
    }, [calculatedTotal]);


    const handleAddItem = (recipe: Recipe) => {
        setFormData(prev => {
            const existingItemIndex = prev.items.findIndex(i => i.recipeId === recipe.id);
            if (existingItemIndex >= 0) {
                const newItems = [...prev.items];
                newItems[existingItemIndex].quantity += 1;
                return { ...prev, items: newItems };
            } else {
                return {
                    ...prev,
                    items: [...prev.items, { recipeId: recipe.id, quantity: 1, customPrice: undefined }]
                };
            }
        });
        setIsProductSelectorOpen(false);
    };

    const updateItemQuantity = (index: number, delta: number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index].quantity += delta;
            if (newItems[index].quantity <= 0) {
                return { ...prev, items: newItems.filter((_, i) => i !== index) };
            }
            return { ...prev, items: newItems };
        });
    };

    const updateItemPrice = (index: number, price: number) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index].customPrice = price;
            return { ...prev, items: newItems };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.items.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        if (id) {
            updateOrder(id, formData);
        } else {
            addOrder({ ...formData, id: uuidv4(), date: new Date().toISOString() });
        }
        navigate('/orders');
    };

    return (
        <div className="flex flex-col h-screen bg-background-dark">
            <header className="p-4 bg-surface-dark border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
                        <Icon name="arrow_back" />
                    </Button>
                    <div>
                        <input
                            className="bg-transparent font-bold text-lg focus:outline-none w-full"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <p className="text-xs text-text-muted">{new Date(formData.date).toDateString()}</p>
                    </div>
                </div>
                <Badge variant={formData.status === 'completed' ? 'success' : 'warning'}>
                    {formData.status}
                </Badge>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="flex flex-col gap-3">
                    {formData.items.map((item, index) => {
                        const recipe = recipes.find(r => r.id === item.recipeId);
                        const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);

                        return (
                            <Card key={index} className="flex justify-between items-center p-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{recipe?.name || 'Unknown Recipe'}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-text-muted">@ Rp {Math.round(unitCost).toLocaleString()}</span>
                                        {item.customPrice && <Badge variant="warning">Custom Price</Badge>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-background-dark rounded-lg p-1 border border-white/5">
                                        <button onClick={() => updateItemQuantity(index, -1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5 text-white transition-colors">
                                            <Icon name="remove" size="sm" />
                                        </button>
                                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateItemQuantity(index, 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white shadow-sm transition-colors">
                                            <Icon name="add" size="sm" />
                                        </button>
                                    </div>
                                    <div className="text-right w-20">
                                        <span className="font-bold text-sm">Rp {(unitCost * item.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {formData.items.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <Icon name="shopping_cart" size="xl" className="mb-2" />
                            <p>Cart is empty</p>
                        </div>
                    )}

                    <Button variant="ghost" className="border border-dashed border-white/20 py-4" onClick={() => setIsProductSelectorOpen(true)}>
                        <Icon name="add" className="mr-2" /> Add Item
                    </Button>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-surface-dark border-t border-white/5 p-4 z-40">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-text-muted">Total Estimate</span>
                    <span className="text-2xl font-extrabold text-primary">Rp {Math.round(formData.totalCost).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}>Save Draft</Button>
                    <Button onClick={handleSubmit}>{id ? 'Update Order' : 'Checkout'}</Button>
                </div>
            </footer>

            {/* Product Selector Modal (Simplified as absolute overlay) */}
            {isProductSelectorOpen && (
                <div className="fixed inset-0 z-50 bg-background-dark flex flex-col animate-in slide-in-from-bottom-10">
                    <header className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Select Recipe</h2>
                        <Button size="icon" variant="ghost" onClick={() => setIsProductSelectorOpen(false)}>
                            <Icon name="close" />
                        </Button>
                    </header>
                    <div className="p-4 flex-1 overflow-y-auto gap-3 flex flex-col">
                        {recipes.map(recipe => (
                            <Card key={recipe.id} hoverEffect onClick={() => handleAddItem(recipe)} className="flex justify-between items-center p-4">
                                <span className="font-bold">{recipe.name}</span>
                                <span className="text-primary font-bold">Rp {Math.round(getRecipeCost(recipe.id)).toLocaleString()}</span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
