// 🔒 LOCKED FILE: Do not modify this file without explicit double confirmation from the user.
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrdersStore } from '../../order_list/store/useOrdersStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/format';
import { useOrderDraftStore } from '../store/useOrderDraftStore';
import { useProfileStore } from '../../edit_profile/store/useProfileStore';
import { OrderItem } from '../../../types';
import { Header } from '../../../components/ui/Header';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { QuantitySelector } from '../../../components/ui/QuantitySelector';
import { MediaCard } from '../../../components/ui/MediaCard';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { SectionHeader } from '../../../components/ui/SectionHeader';

export const OrderPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const { profile } = useProfileStore();

    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

    const {
        name: draftName,
        date: draftDate,
        items: draftItems,
        notes: draftNotes,
        setName,
        setDate,
        setNotes,
        setItems,
        editingId,
        setEditingId,
        resetDraft
    } = useOrderDraftStore();

    useEffect(() => {
        if (id && id !== editingId) {
            const existing = getOrder(id);
            if (existing) {
                setName(existing.name);
                setDate(format(new Date(existing.date), 'yyyy-MM-dd'));
                setItems(existing.items);
                setNotes(existing.notes || '');
                setEditingId(id);
            }
        }
    }, [id, editingId, getOrder, setName, setDate, setItems, setNotes, setEditingId]);

    const getRecipeCost = (recipeId: string) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return 0;
        if (recipe.manualCost) return recipe.manualCost;

        const total = recipe.ingredients.reduce((acc: number, item) => {
            const ing = getIngredient(item.ingredientId);
            return acc + (ing ? ing.price * item.quantity : 0);
        }, 0);
        return total / (recipe.yield || 1);
    }

    const calculatedTotal = useMemo(() => {
        return draftItems.reduce((total: number, item: OrderItem) => {
            const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);
            return total + (unitCost * item.quantity);
        }, 0);
    }, [draftItems, recipes, getIngredient]);

    const isFormValid = useMemo(() => {
        return draftName.trim().length > 0 && draftItems.length > 0;
    }, [draftName, draftItems]);

    const setItemQuantity = (index: number, quantity: number) => {
        const newItems = [...draftItems];
        newItems[index].quantity = quantity;
        if (newItems[index].quantity <= 0) {
            setItems(newItems.filter((_, i) => i !== index));
        } else {
            setItems(newItems);
        }
    };

    const updateItemQuantity = (index: number, delta: number) => {
        setItemQuantity(index, draftItems[index].quantity + delta);
    };

    const removeItem = (index: number) => {
        setItems(draftItems.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (draftItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        let targetId = id;
        if (!targetId) {
            targetId = uuidv4();
            setEditingId(targetId);
        }

        // Navigate to OrderDetail without saving to OrdersStore yet
        // Pass the draft data to be picked up by the OrderEditStore in OrderDetail
        navigate(`/orders/${targetId}`, {
            state: {
                from: 'entry',
                draft: {
                    name: draftName,
                    date: draftDate,
                    items: draftItems,
                    notes: draftNotes,
                    status: 'pending',
                    ingredientOverrides: []
                }
            }
        });

        // Reset the entry draft immediately as data has been handed over to OrderEditStore
        resetDraft();
    };

    const handleReset = () => {
        setIsResetDialogOpen(true);
    };

    const confirmReset = () => {
        resetDraft();
        setIsResetDialogOpen(false);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <Header
                title="Order Page"
                subtitle={profile.name}
                leftElement={
                    <div
                        className="h-10 w-10 rounded-full bg-surface-dark bg-cover bg-center border border-white/10 shadow-sm"
                        style={{ backgroundImage: `url('${profile.avatar}')` }}
                    ></div>
                }
                rightElement={
                    <button
                        onClick={handleReset}
                        className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm"
                        title="Reset Form"
                    >
                        <span className="material-symbols-outlined text-red-400 text-xl font-bold">restart_alt</span>
                    </button>
                }
            />

            <main className="flex-1 flex flex-col px-6 pt-8 pb-40 max-w-lg mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight whitespace-nowrap">
                        {id ? 'Edit Order' : 'New Order'}
                    </h1>
                </div>

                <section className="flex flex-col gap-6">
                    <Input
                        label="Order Name"
                        icon="edit_note"
                        value={draftName}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Wedding Catering"
                    />

                    <DatePicker
                        label="Order Date"
                        value={draftDate}
                        onChange={setDate}
                    />

                    <Textarea
                        label="Notes"
                        value={draftNotes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Allergies, packaging preferences, delivery instructions..."
                        rows={3}
                    />
                </section>

                <section className="flex flex-col gap-3 mt-8">
                    <SectionHeader
                        title="Selected Recipes"
                        rightElement={`${draftItems.length} Items`}
                    />

                    {draftItems.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {draftItems.map((item, index) => {
                                const recipe = recipes.find(r => r.id === item.recipeId);
                                const unitCost = item.customPrice ?? getRecipeCost(item.recipeId);
                                const subtotal = unitCost * item.quantity;

                                return (
                                    <MediaCard
                                        key={index}
                                        image={recipe?.image}
                                        title={recipe?.name || 'Unknown'}
                                        subtitle={
                                            <div className="text-xs font-bold text-white">
                                                Rp {formatCurrency(Math.round(unitCost))} <span className="text-gray-400 font-normal">/ portion</span>
                                            </div>
                                        }
                                        rightElement={
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        }
                                        bottomElement={
                                            <div className="flex items-center justify-between w-full">
                                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total: <span className="text-primary">Rp {formatCurrency(Math.round(subtotal))}</span></div>
                                                <QuantitySelector
                                                    value={item.quantity}
                                                    onChange={(val) => setItemQuantity(index, val)}
                                                    onIncrement={() => updateItemQuantity(index, 1)}
                                                    onDecrement={() => updateItemQuantity(index, -1)}
                                                />
                                            </div>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/orders/select-recipes', {
                            state: {
                                selectedRecipeIds: draftItems.map(i => i.recipeId),
                                returnPath: '/',
                                storeType: 'draft'
                            }
                        })}
                        className="w-full py-4 border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold transition-all active:scale-[0.99]"
                    >
                        <span className="material-symbols-outlined font-bold">add_circle</span>
                        Add / Select Recipes
                    </button>
                </section>

                <ActionFooter
                    className="bottom-[88px]"
                    summary={{
                        label: "Total Cost Estimation",
                        value: `Rp ${formatCurrency(Math.round(calculatedTotal))}`
                    }}
                    primaryAction={{
                        label: 'Order Detail',
                        onClick: handleSubmit,
                        isDisabled: !isFormValid
                    }}
                />
            </main>

            <AlertDialog
                isOpen={isResetDialogOpen}
                title="Reset Order?"
                message="This will clear all items and details you've entered. This action cannot be undone."
                confirmLabel="Reset"
                cancelLabel="Cancel"
                isDestructive
                onCancel={() => setIsResetDialogOpen(false)}
                onConfirm={confirmReset}
            />
        </div>
    );
};
