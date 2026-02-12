import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Order as OrderType } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const OrderPage: React.FC = () => {
    const navigate = useNavigate();
    // Dashboard typically won't have an ID, but keeping logic compatible if used elsewhere
    const { id } = useParams<{ id: string }>();
    const { addOrder, updateOrder, getOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const location = useLocation();

    const [formData, setFormData] = useState<Omit<OrderType, 'id'>>({
        name: `Order #${Math.floor(Math.random() * 10000)}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        items: [],
        status: 'pending',
        totalCost: 0
    });

    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (id) {
            const existing = getOrder(id);
            if (existing) {
                setFormData({
                    ...existing,
                    date: format(new Date(existing.date), 'yyyy-MM-dd')
                });
            }
        }
    }, [id, getOrder]);

    // Handle returned selection from RecipeSelection page
    useEffect(() => {
        if (location.state?.selectedRecipeIds) {
            const selectedIds = location.state.selectedRecipeIds as string[];
            setFormData(prev => {
                const newItems = [...prev.items];

                // Add new recipes that are not in the list
                selectedIds.forEach(recipeId => {
                    if (!newItems.find(i => i.recipeId === recipeId)) {
                        newItems.push({ recipeId, quantity: 1 });
                    }
                });

                // Remove recipes that were deselected
                return {
                    ...prev,
                    items: newItems.filter(item => selectedIds.includes(item.recipeId))
                };
            });
            // Clear location state to avoid re-triggering
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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

    const calculatedTotal = useMemo(() => {
        return formData.items.reduce((total, item) => {
            const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);
            return total + (unitCost * item.quantity);
        }, 0);
    }, [formData.items, recipes, getIngredient]);

    useEffect(() => {
        if (formData.totalCost !== calculatedTotal) {
            setFormData(prev => ({ ...prev, totalCost: calculatedTotal }));
        }
    }, [calculatedTotal]);


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

    const removeItem = (index: number) => {
        setFormData(prev => {
            return { ...prev, items: prev.items.filter((_, i) => i !== index) };
        });
    };

    const handleSubmit = () => {
        if (formData.items.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        const orderData = {
            ...formData,
        };

        if (id) {
            updateOrder(id, orderData);
            navigate('/orders');
        } else {
            const newId = uuidv4();
            addOrder({ ...orderData, id: newId, date: new Date(formData.date).toISOString() });
            navigate(`/orders/${newId}`);
        }
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the form?")) {
            setFormData({
                name: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                items: [],
                status: 'pending',
                totalCost: 0
            });
            setNotes('');
        }
    };

    const getPlaceholderImage = (name: string) => {
        if (name.toLowerCase().includes('burger')) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwyMiEbTZLwjp5rbP8fohWijwTZmSDyuO1FY3VHz-X8EhOB9dnyPrDF-orfE1P9dHDDUZQCjfzO3rg9jI_OP5CXMVKsQeWBDFNjjcOBXNzNoLp5FV5TbXiWf18eFaC2qZ9bpwUOPRjEEF9Gtdi3rWE0ekTvORvzVVgIPBXgJoZdqqsFGohLEB4MfuX8s2LwlIfcg85tHeqTNFX4vOjGmJLGCd5I2ZD6mKlMtzHBQ0mKGwjTlFtE1sRx8nEuk575J4cUphWB53KEeM';
        if (name.toLowerCase().includes('cake')) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmeAt6a0LTDbw2NQhXUSi3STFQxZXhZc0vPKhG2JJ4ZXjyW8SCUHVBYjkhPYOeAHKNbVEvRkzEDQxVUJeO3jvAOXwFDCZDKJmaam4xD59nwyiwr21UJLLP6kjBYSrNg9NtPMd_Oyk08WKHVu-jRTnAC7YZFKP9MHFOuyeEsGbCW-S6_GlkjwJ2HQnon6Jt_PH8mDTbUPic5bjTzEggyq7VB7vTjIeUC4PnZqey7s99aDAXiAfVBaRyHEKzsKHoJyiSCd_tvMcfqUg';
        return 'https://via.placeholder.com/150';
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
                    New Order
                </h1>
                <button
                    onClick={handleReset}
                    className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm"
                    title="Reset Form"
                >
                    <span className="material-symbols-outlined text-red-400 text-xl font-bold">restart_alt</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 pb-48 max-w-lg mx-auto w-full">
                <section className="flex flex-col gap-6">
                    <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Order Details</h2>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Order Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">edit_note</span>
                            </div>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                className="block w-full pl-10 pr-3 py-3.5 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all"
                                placeholder="e.g. Wedding Catering"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Order Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-white">calendar_today</span>
                            </div>
                            <input
                                value={formData.date}
                                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                className="block w-full pl-10 pr-3 py-3.5 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all"
                                type="date"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="block w-full px-4 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all resize-none"
                            placeholder="Allergies, packaging preferences, delivery instructions..."
                            rows={3}
                        ></textarea>
                    </div>
                </section>

                <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Selected Recipes</h3>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                            {formData.items.length} Items
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/orders/select-recipes', {
                            state: {
                                selectedRecipeIds: formData.items.map(i => i.recipeId),
                                returnPath: '/'
                            }
                        })}
                        className="w-full py-4 border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold transition-all active:scale-[0.99]"
                    >
                        <span className="material-symbols-outlined font-bold">add_circle</span>
                        Add / Select Recipes
                    </button>

                    <div className="grid grid-cols-1 gap-3">
                        {formData.items.map((item, index) => {
                            const recipe = recipes.find(r => r.id === item.recipeId);
                            const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);
                            const subtotal = unitCost * item.quantity;

                            return (
                                <div key={index} className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative overflow-hidden">
                                    <div
                                        className="h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-800 bg-cover bg-center shrink-0 shadow-inner"
                                        style={{ backgroundImage: `url('${getPlaceholderImage(recipe?.name || '')}')` }}
                                    ></div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-base text-slate-900 dark:text-white truncate pr-6">{recipe?.name || 'Unknown'}</h4>
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                            <div className="text-xs font-bold text-primary mt-0.5">
                                                Rp {Math.round(unitCost).toLocaleString()} <span className="text-gray-400 font-normal">/ portion</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total: Rp {Math.round(subtotal).toLocaleString()}</div>
                                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-600 h-8">
                                                <button
                                                    onClick={() => updateItemQuantity(index, -1)}
                                                    className="w-8 h-full rounded-md text-gray-500 hover:text-primary flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-700"
                                                >
                                                    <span className="material-symbols-outlined text-base">remove</span>
                                                </button>
                                                <input
                                                    className="w-8 text-center bg-transparent border-none p-0 text-sm font-bold text-slate-800 dark:text-white focus:ring-0"
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => updateItemQuantity(index, 1)}
                                                    className="w-8 h-full rounded-md text-gray-500 hover:text-primary flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-700"
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Sticky Total Cost Footer */}
                <div className="fixed bottom-[80px] left-0 right-0 z-30 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 pb-2 pt-4 px-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl transform transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total Cost Estimation</p>
                            <div className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Rp {Math.round(formData.totalCost).toLocaleString()}</div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2 active:scale-95"
                        >
                            {id ? 'Update Order' : 'Create Order'}
                        </button>
                    </div>
                </div>
            </main>
        </div >
    );
};
