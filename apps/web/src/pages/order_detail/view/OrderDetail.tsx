// 🔒 LOCKED FILE: Do not modify this file without explicit double confirmation from the user.
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation, useBlocker } from 'react-router-dom';
import { useOrdersStore } from '../../order_list/store/useOrdersStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { Order } from '../../../types';
import { clsx } from 'clsx';
import { formatCurrency } from '../../../utils/format';
import { format } from 'date-fns';
import { useOrderEditStore } from '../store/useOrderEditStore';
import { useOrderDraftStore } from '../../order_entry/store/useOrderDraftStore';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Header } from '../../../components/ui/Header';
import { OrderItem, RecipeIngredient } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { InfoBanner } from '../../../components/ui/InfoBanner';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getOrder, updateOrder, addOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const {
        name: draftName,
        date: draftDate,
        items: draftItems,
        notes: draftNotes,
        ingredientOverrides: draftOverrides,
        status: draftStatus,
        editingId,
        setName,
        setDate,
        setItems,
        setNotes,
        setIngredientOverrides,
        setDraft,
        resetDraft
    } = useOrderEditStore();

    const { resetDraft: resetDraftEntry } = useOrderDraftStore();

    const [originalOrder, setOriginalOrder] = useState<Order | null>(null);

    // Construct a reactive order object from draft store state
    const currentOrder = useMemo(() => {
        if (!id) return null;
        return {
            id,
            name: draftName,
            date: draftDate,
            items: draftItems,
            notes: draftNotes,
            ingredientOverrides: draftOverrides,
            status: draftStatus,
            totalCost: 0 // Calculated separately
        } as Order;
    }, [id, draftName, draftDate, draftItems, draftNotes, draftOverrides, draftStatus]);

    const isDirty = useMemo(() => {
        if (!currentOrder) return false;

        // If we arrived from entry flow and the order isn't in the store yet, it's definitively "unsaved"
        if (location.state?.from === 'entry' && !originalOrder) return true;

        if (!originalOrder) return false;

        // Simple property comparison for performance/reliability
        const hasNameChanged = draftName !== originalOrder.name;
        const hasDateChanged = draftDate !== format(new Date(originalOrder.date), 'yyyy-MM-dd');
        const hasItemsChanged = JSON.stringify(draftItems) !== JSON.stringify(originalOrder.items);
        const hasNotesChanged = draftNotes !== (originalOrder.notes || '');
        const hasOverridesChanged = JSON.stringify(draftOverrides) !== JSON.stringify(originalOrder.ingredientOverrides || []);

        const dirty = hasNameChanged || hasDateChanged || hasItemsChanged || hasNotesChanged || hasOverridesChanged;

        if (dirty) {
            console.log('[OrderDetail] State comparison:', {
                name: hasNameChanged,
                date: hasDateChanged,
                items: hasItemsChanged,
                notes: hasNotesChanged,
                overrides: hasOverridesChanged
            });
        }
        return dirty;
    }, [currentOrder, originalOrder, draftName, draftDate, draftItems, draftNotes, draftOverrides, location.state]);

    const isSavingRef = React.useRef(false);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            !isSavingRef.current &&
            isDirty &&
            currentLocation.pathname !== nextLocation.pathname &&
            nextLocation.pathname !== '/orders/select-recipes'
    );

    // Removal of useEffect with window.confirm

    useEffect(() => {
        if (id) {
            const foundStoreOrder = getOrder(id);
            const isEditingThisOrder = editingId === id;

            if (!isEditingThisOrder && foundStoreOrder) {
                // First time loading this specific order into draft
                console.log('[OrderDetail] Loading order into Draft store:', foundStoreOrder.name);
                setDraft(foundStoreOrder);
                setOriginalOrder(JSON.parse(JSON.stringify(foundStoreOrder)));
            } else if (!isEditingThisOrder && location.state?.from === 'entry' && location.state?.draft) {
                // Incoming draft from OrderEntry (New Order flow)
                console.log('[OrderDetail] Loading new order draft from OrderEntry');
                const draftData = location.state.draft;
                setDraft({
                    id: id || 'temp-id',
                    ...draftData,
                    totalCost: 0 // Will be calculated by useMemo
                } as Order);
                setOriginalOrder(null);
            } else if (foundStoreOrder && !originalOrder) {
                // Already editing, but need original for dirty check
                setOriginalOrder(JSON.parse(JSON.stringify(foundStoreOrder)));
            }
        }
    }, [id, getOrder, editingId, setDraft, originalOrder, location.state]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Note: The previous sync logic using location.state is no longer needed 
    // because RecipeSelection now syncs directly with useOrderDraftStore 
    // before navigating back.

    const aggregatedIngredients = useMemo(() => {
        if (!currentOrder) return [];

        const agg: Record<string, {
            ingredientId: string;
            quantity: number;
            originRecipes: { name: string; qty: number }[]
        }> = {};

        draftItems.forEach((item: OrderItem) => {
            const recipe = recipes.find(r => r.id === item.recipeId);
            if (!recipe) return;

            recipe.ingredients.forEach((ri: RecipeIngredient) => {
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
            const override = draftOverrides?.find(o => o.ingredientId === a.ingredientId);
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
    }, [draftItems, draftOverrides, recipes, getIngredient]);

    const totalCost = useMemo(() => {
        return aggregatedIngredients.reduce((sum, ing) => sum + ing.total, 0);
    }, [aggregatedIngredients]);

    const handleUpdateOrder = () => {
        if (!currentOrder) return;
        isSavingRef.current = true;
        const finalOrder = { ...currentOrder, totalCost };

        const existingOrder = getOrder(currentOrder.id);
        if (existingOrder) {
            updateOrder(currentOrder.id, finalOrder);
        } else {
            addOrder(finalOrder);
        }

        resetDraft();
        if (location.state?.from === 'entry') {
            resetDraftEntry();
        }
        navigate('/history');
    };

    const handleIngredientPriceChange = (ingredientId: string, newPrice: number) => {
        const overrides = [...(draftOverrides || [])];
        const existingIndex = overrides.findIndex(o => o.ingredientId === ingredientId);

        // Enforce minimum price of 1
        const validatedPrice = Math.max(1, newPrice);

        if (existingIndex >= 0) {
            overrides[existingIndex].customPrice = validatedPrice;
        } else {
            overrides.push({ ingredientId, customPrice: validatedPrice });
        }

        setIngredientOverrides(overrides);
    };

    const updateItemQuantity = (recipeId: string, delta: number) => {
        const newItems = draftItems.map(item => {
            if (item.recipeId === recipeId) {
                // Enforce minimum quantity of 1
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });

        setItems(newItems);
    };

    const removeItem = (recipeId: string) => {
        setItems(draftItems.filter(i => i.recipeId !== recipeId));
    };


    if (!currentOrder) return null;

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-10">
            <Header
                title="Order Detail"
                showBackButton
                rightElement={isDirty && (
                    <Badge
                        variant="warning"
                        rounded="full"
                        className="animate-pulse tracking-widest"
                    >
                        Unsaved
                    </Badge>
                )}
                bottomElement={(
                    <div className="flex items-center justify-between bg-surface-dark/50 rounded-2xl p-4 border border-white/5 mx-1 overflow-hidden">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-60">Total Cost</p>
                                <div className="text-lg font-extrabold font-display text-white truncate">
                                    Rp {formatCurrency(Math.round(totalCost))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-xs font-bold shrink-0 ml-4">
                            Estimated
                        </div>
                    </div>
                )}
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6">
                {/* Order Information */}
                <section className="grid grid-cols-1 gap-4">
                    <Input
                        label="Order Name"
                        icon="edit_note"
                        value={draftName}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter order name"
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

                {/* Selected Recipes */}
                <section>
                    <SectionHeader
                        title="Selected Recipes"
                        icon="receipt_long"
                        rightElement={
                            <button
                                onClick={() => navigate('/orders/select-recipes', {
                                    state: {
                                        selectedRecipeIds: draftItems.map(i => i.recipeId),
                                        returnPath: `/orders/${id}`,
                                        storeType: 'edit'
                                    }
                                })}
                                className="flex items-center gap-1.5 bg-surface-dark hover:bg-gray-750 border border-white/10 px-3 py-1.5 rounded-lg transition-colors group"
                            >
                                <span className="material-symbols-outlined text-lg text-primary group-hover:text-white transition-colors">add</span>
                                <span className="text-xs font-bold text-white">Add</span>
                            </button>
                        }
                    />
                    <div className="flex flex-col gap-4">
                        {draftItems.map((item) => {
                            const recipe = recipes.find(r => r.id === item.recipeId);
                            if (!recipe) return null;

                            return (
                                <div key={item.recipeId} className="bg-surface-dark rounded-2xl p-5 border border-white/5 relative shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors cursor-default">{recipe.name}</h3>
                                            <p className="text-xs text-gray-400 mb-4">Portion scale: x{item.quantity}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-background-dark/50 rounded-xl px-4 py-2 border border-white/10 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm">
                                                    <span className="text-[10px] text-gray-500 mr-3 font-bold uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">Qty</span>
                                                    <input
                                                        className="w-16 bg-transparent border-none p-0 text-center font-bold text-white focus:ring-0 focus:outline-none text-base"
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                                            if (val.length <= 4) {
                                                                const numVal = parseInt(val) || 1;
                                                                const validatedVal = Math.max(1, numVal);
                                                                updateItemQuantity(item.recipeId, validatedVal - item.quantity);
                                                            }
                                                        }}
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
                    <SectionHeader
                        title="Total Order Ingredients"
                        icon="grocery"
                        className="mt-4"
                    />

                    <InfoBanner
                        message="This list aggregates ingredients from all selected recipes. You can override unit prices for this specific order."
                        className="mx-1"
                    />

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
                                            {ing.quantity.toLocaleString('id-ID', { maximumFractionDigits: 2 })} <span className="text-sm font-medium text-gray-500">{ing.unit}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className={clsx(
                                    "bg-background-dark rounded-xl p-4 border transition-all flex flex-col gap-3 ring-1",
                                    ing.isOverridden ? "border-primary ring-primary" : "border-white/5 ring-white/5 focus-within:border-primary focus-within:ring-primary"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 w-full relative">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Price / Unit ({ing.unit})</label>
                                            <div className="relative group w-full flex items-center mt-1">
                                                <span className="text-sm font-bold text-gray-400 mr-2 shrink-0">Rp</span>
                                                <input
                                                    className="w-full bg-transparent border-none p-0 text-lg font-bold text-white focus:ring-0 shadow-none focus:outline-none"
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={ing.currentPrice}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                                        if (val.length <= 8) {
                                                            const numVal = parseFloat(val) || 1;
                                                            handleIngredientPriceChange(ing.ingredientId, Math.max(1, numVal));
                                                        }
                                                    }}
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
                                        <span className="text-sm font-bold text-primary">Rp {formatCurrency(Math.round(ing.total))}</span>
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
                    {location.state?.from === 'entry' ? 'Save Order' : 'Update Order'}
                </button>
            </div>

            <AlertDialog
                isOpen={blocker.state === 'blocked'}
                title={!originalOrder ? "Discard New Order?" : "Discard Changes?"}
                message={!originalOrder
                    ? "This order hasn't been saved to your history yet. If you leave now, all details will be lost."
                    : "You have unsaved modifications to this order. If you leave now, these changes will be lost."
                }
                confirmLabel="Discard"
                cancelLabel="Keep Editing"
                isDestructive
                onCancel={() => blocker.state === 'blocked' && blocker.reset()}
                onConfirm={() => {
                    if (blocker.state === 'blocked') {
                        resetDraft();
                        blocker.proceed();
                    }
                }}
            />
        </div>
    );
};
