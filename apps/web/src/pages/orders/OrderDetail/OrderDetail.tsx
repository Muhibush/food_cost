import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Order } from '../../../types';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getOrder, updateOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();

    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (id) {
            const foundOrder = getOrder(id);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                navigate('/history');
            }
        }
    }, [id, getOrder, navigate]);

    // Handle returned selection from RecipeSelection page
    useEffect(() => {
        if (location.state?.selectedRecipeIds && order) {
            const selectedIds = location.state.selectedRecipeIds as string[];
            const newItems = [...order.items];

            // Add new recipes
            selectedIds.forEach(recipeId => {
                if (!newItems.find(i => i.recipeId === recipeId)) {
                    newItems.push({ recipeId, quantity: 1 });
                }
            });

            // Note: On the detail page, we might NOT want to auto-remove recipes if they were dselected, 
            // or maybe we should? The reference says "Select Recipes" so if they deselected it, it should be removed.
            const updatedItems = newItems.filter(item => selectedIds.includes(item.recipeId));

            setOrder({ ...order, items: updatedItems });
            // Clear location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state, order]);

    const aggregatedIngredients = useMemo(() => {
        if (!order) return [];

        const agg: Record<string, {
            ingredientId: string;
            quantity: number;
            originRecipes: { name: string; qty: number }[]
        }> = {};

        order.items.forEach(item => {
            const recipe = recipes.find(r => r.id === item.recipeId);
            if (!recipe) return;

            recipe.ingredients.forEach(ri => {
                const totalQty = (ri.quantity * item.quantity) / (recipe.yield || 1);
                if (!agg[ri.ingredientId]) {
                    agg[ri.ingredientId] = {
                        ingredientId: ri.ingredientId,
                        quantity: 0,
                        originRecipes: []
                    };
                }
                agg[ri.ingredientId].quantity += totalQty;

                const existingOrigin = agg[ri.ingredientId].originRecipes.find(o => o.name === recipe.name);
                if (existingOrigin) {
                    existingOrigin.qty += item.quantity;
                } else {
                    agg[ri.ingredientId].originRecipes.push({ name: recipe.name, qty: item.quantity });
                }
            });
        });

        return Object.values(agg).map(a => {
            const ingredient = getIngredient(a.ingredientId);
            const override = order.ingredientOverrides?.find(o => o.ingredientId === a.ingredientId);
            const basePrice = ingredient?.price || 0;
            const currentPrice = override ? override.customPrice : basePrice;

            return {
                ...a,
                name: ingredient?.name || 'Unknown',
                unit: ingredient?.unit || 'gr',
                currentPrice,
                isOverridden: !!override,
                total: currentPrice * a.quantity
            };
        });
    }, [order, recipes, getIngredient]);

    const totalCost = useMemo(() => {
        return aggregatedIngredients.reduce((sum, ing) => sum + ing.total, 0);
    }, [aggregatedIngredients]);

    const handleUpdateOrder = () => {
        if (!order) return;
        updateOrder(order.id, { ...order, totalCost });
        navigate('/history');
    };

    const handleIngredientPriceChange = (ingredientId: string, newPrice: number) => {
        if (!order) return;
        const overrides = [...(order.ingredientOverrides || [])];
        const existingIndex = overrides.findIndex(o => o.ingredientId === ingredientId);

        if (existingIndex >= 0) {
            overrides[existingIndex].customPrice = newPrice;
        } else {
            overrides.push({ ingredientId, customPrice: newPrice });
        }

        setOrder({ ...order, ingredientOverrides: overrides });
    };

    const updateItemQuantity = (recipeId: string, delta: number) => {
        if (!order) return;
        const newItems = order.items.map(item => {
            if (item.recipeId === recipeId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0);

        setOrder({ ...order, items: newItems });
    };

    const removeItem = (recipeId: string) => {
        if (!order) return;
        setOrder({ ...order, items: order.items.filter(i => i.recipeId !== recipeId) });
    };


    if (!order) return null;

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-10">
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </button>
                <h1 className="text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
                    Order Details
                </h1>
                <div className="flex-1"></div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-0.5 opacity-60">Total Cost</p>
                    <div className="text-xl font-extrabold font-display text-primary">Rp {Math.round(totalCost).toLocaleString()}</div>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6">
                {/* Order Information */}
                <section className="grid grid-cols-1 gap-4">
                    <div className="bg-surface-dark rounded-2xl p-4 border border-white/5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Order Name</label>
                        <div className="flex items-center gap-3 bg-surface-dark/50 rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-colors ring-1 ring-white/5">
                            <span className="material-symbols-outlined text-gray-400 text-xl">edit_note</span>
                            <input
                                className="w-full bg-transparent border-0 p-0 text-base font-semibold text-white focus:ring-0 placeholder-gray-500"
                                type="text"
                                value={order.name}
                                onChange={(e) => setOrder({ ...order, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="bg-surface-dark rounded-2xl p-4 border border-white/5">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Order Date</label>
                        <div className="flex items-center gap-3 bg-surface-dark/50 rounded-xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-colors ring-1 ring-white/5">
                            <span className="material-symbols-outlined text-gray-400 text-xl">calendar_today</span>
                            <input
                                className="w-full bg-transparent border-0 p-0 text-base font-semibold text-white focus:ring-0 placeholder-gray-500"
                                type="date"
                                value={format(parseISO(order.date), 'yyyy-MM-dd')}
                                onChange={(e) => setOrder({ ...order, date: new Date(e.target.value).toISOString() })}
                            />
                        </div>
                    </div>
                </section>

                {/* Selected Recipes */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                            <h2 className="font-bold text-lg text-white">Selected Recipes</h2>
                        </div>
                        <button
                            onClick={() => navigate('/orders/select-recipes', {
                                state: {
                                    selectedRecipeIds: order.items.map(i => i.recipeId),
                                    returnPath: `/orders/${order.id}`
                                }
                            })}
                            className="flex items-center gap-1.5 bg-surface-dark hover:bg-gray-750 border border-white/10 px-3 py-1.5 rounded-lg transition-colors group"
                        >
                            <span className="material-symbols-outlined text-lg text-primary group-hover:text-white transition-colors">add</span>
                            <span className="text-xs font-bold text-white">Add</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {order.items.map((item) => {
                            const recipe = recipes.find(r => r.id === item.recipeId);
                            if (!recipe) return null;

                            return (
                                <div key={item.recipeId} className="bg-surface-dark rounded-2xl p-5 border border-white/5 relative shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors cursor-default">{recipe.name}</h3>
                                            <p className="text-xs text-gray-400 mb-4">Portion scale: x{item.quantity}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-background-dark rounded-lg px-3 py-1.5 border border-white/5 h-10 ring-1 ring-white/5">
                                                    <span className="text-[10px] text-gray-400 mr-2 font-bold uppercase">Qty</span>
                                                    <input
                                                        className="w-10 bg-transparent border-none p-0 text-center font-bold text-white focus:ring-0 text-sm"
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItemQuantity(item.recipeId, parseInt(e.target.value) - item.quantity)}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium tracking-tight">portions</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 h-full justify-between min-h-[90px]">
                                            <button
                                                onClick={() => removeItem(item.recipeId)}
                                                className="w-8 h-8 rounded-full bg-background-dark flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all absolute top-4 right-4 ring-1 ring-white/5"
                                            >
                                                <span className="material-symbols-outlined text-sm font-bold">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Aggregated Ingredients */}
                <section className="flex flex-col gap-4 pb-32">
                    <div className="flex items-center gap-3 mt-4 px-1">
                        <span className="material-symbols-outlined text-primary text-xl">grocery</span>
                        <h2 className="font-bold text-lg text-white">Total Order Ingredients</h2>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 mx-1">
                        <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">info</span>
                        <p className="text-xs text-blue-200 leading-relaxed font-medium">
                            This list aggregates ingredients from all selected recipes. You can override unit prices for this specific order.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        {aggregatedIngredients.map((ing) => (
                            <div key={ing.ingredientId} className="bg-surface-dark p-5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="max-w-[70%]">
                                        <h3 className="font-bold text-base text-white truncate">{ing.name}</h3>
                                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                                            From: {ing.originRecipes.map(o => `${o.qty}x ${o.name}`).join(', ')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-lg text-white">
                                            {ing.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-medium text-gray-500">{ing.unit}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-background-dark rounded-xl p-4 border border-white/5 flex flex-col gap-3 ring-1 ring-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 w-full relative">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Price / Unit ({ing.unit})</label>
                                            <div className="relative group w-full flex items-center mt-1">
                                                <span className="text-sm font-bold text-gray-400 mr-2 shrink-0">Rp</span>
                                                <input
                                                    className="w-full bg-transparent border-none p-0 text-lg font-bold text-white focus:ring-0 shadow-none"
                                                    type="number"
                                                    value={ing.currentPrice}
                                                    onChange={(e) => handleIngredientPriceChange(ing.ingredientId, parseFloat(e.target.value) || 0)}
                                                />
                                                <span className={clsx(
                                                    "material-symbols-outlined text-sm ml-2 transition-colors",
                                                    ing.isOverridden ? "text-primary" : "text-gray-600"
                                                )}>
                                                    {ing.isOverridden ? 'check_circle' : 'edit'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 w-full"></div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total</span>
                                        <span className="text-sm font-bold text-primary">Rp {Math.round(ing.total).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Sticky Update Button */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-dark/80 backdrop-blur-md px-6 pt-4 pb-safe border-t border-white/5">
                <button
                    onClick={handleUpdateOrder}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
                >
                    Update Order
                </button>
            </div>
        </div>
    );
};
