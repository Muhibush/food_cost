import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Order, Recipe } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

export const OrderForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addOrder, updateOrder, getOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Order, 'id'>>({
        name: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        items: [],
        status: 'pending',
        totalCost: 0
    });

    const [notes, setNotes] = useState(''); // New field from design

    const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

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
            // Store notes in a custom field if we update the type, or just ignore for now if type prevents it
            // For now, assuming Order type doesn't support notes yet, so just logging it or skipping
        };

        if (id) {
            updateOrder(id, orderData);
        } else {
            addOrder({ ...orderData, id: uuidv4(), date: new Date(formData.date).toISOString() });
        }
        navigate('/orders');
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

    // Helper for placeholder images based on recipe name (hashing)
    const getPlaceholderImage = (name: string) => {
        // Just returning consistent placeholder URLs from the design
        if (name.toLowerCase().includes('burger')) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwyMiEbTZLwjp5rbP8fohWijwTZmSDyuO1FY3VHz-X8EhOB9dnyPrDF-orfE1P9dHDDUZQCjfzO3rg9jI_OP5CXMVKsQeWBDFNjjcOBXNzNoLp5FV5TbXiWf18eFaC2qZ9bpwUOPRjEEF9Gtdi3rWE0ekTvORvzVVgIPBXgJoZdqqsFGohLEB4MfuX8s2LwlIfcg85tHeqTNFX4vOjGmJLGCd5I2ZD6mKlMtzHBQ0mKGwjTlFtE1sRx8nEuk575J4cUphWB53KEeM';
        if (name.toLowerCase().includes('cake')) return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmeAt6a0LTDbw2NQhXUSi3STFQxZXhZc0vPKhG2JJ4ZXjyW8SCUHVBYjkhPYOeAHKNbVEvRkzEDQxVUJeO3jvAOXwFDCZDKJmaam4xD59nwyiwr21UJLLP6kjBYSrNg9NtPMd_Oyk08WKHVu-jRTnAC7YZFKP9MHFOuyeEsGbCW-S6_GlkjwJ2HQnon6Jt_PH8mDTbUPic5bjTzEggyq7VB7vTjIeUC4PnZqey7s99aDAXiAfVBaRyHEKzsKHoJyiSCd_tvMcfqUg';
        return 'https://via.placeholder.com/150';
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </button>
                <h1 className="text-2xl font-extrabold text-white absolute left-1/2 -translate-x-1/2 tracking-tight whitespace-nowrap">
                    {id ? 'Edit Order' : 'New Order'}
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
                            <div className="absolute inset-0 pl-4 pr-10 py-3.5 flex items-center pointer-events-none text-slate-900 dark:text-white sm:text-sm font-medium">
                                {formData.date ? format(parseISO(formData.date), 'd MMMM yyyy') : ''}
                            </div>
                            <input
                                value={formData.date}
                                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                className="block w-full pl-4 pr-10 py-3.5 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-white dark:bg-surface-dark text-transparent dark:text-transparent placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm shadow-sm font-medium transition-all appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:appearance-none"
                                type="date"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-white/50">calendar_today</span>
                            </div>
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

                <section className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Selected Recipes</h3>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                            {formData.items.length} Items
                        </span>
                    </div>

                    <button
                        onClick={() => setIsProductSelectorOpen(true)}
                        className="w-full py-4 border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold transition-all active:scale-[0.99]"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
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

                {/* Validating Product Selector reused from previous implementation but styled simpler? */}
                {isProductSelectorOpen && (
                    <div className="fixed inset-0 z-50 bg-background-dark/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[80vh] flex flex-col">
                            <header className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h2 className="font-bold text-lg dark:text-white">Select Recipe</h2>
                                <button onClick={() => setIsProductSelectorOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </header>
                            <div className="p-2 flex-1 overflow-y-auto gap-2 flex flex-col">
                                {recipes.map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => handleAddItem(recipe)}
                                        className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                    >
                                        <span className="font-bold dark:text-white group-hover:text-primary transition-colors">{recipe.name}</span>
                                        <span className="text-primary font-bold">Rp {Math.round(getRecipeCost(recipe.id)).toLocaleString()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
