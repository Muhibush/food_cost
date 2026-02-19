import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderItem, IngredientOverride } from '../types';
import { format } from 'date-fns';

interface OrderEditState {
    name: string;
    date: string;
    items: OrderItem[];
    notes: string;
    status: Order['status'];
    ingredientOverrides: IngredientOverride[];
    totalCost: number;
    editingId: string | null;
    setName: (name: string) => void;
    setDate: (date: string) => void;
    setNotes: (notes: string) => void;
    setItems: (items: OrderItem[]) => void;
    setIngredientOverrides: (overrides: IngredientOverride[]) => void;
    setStatus: (status: Order['status']) => void;
    syncItemsFromIds: (ids: string[]) => void;
    setTotalCost: (cost: number) => void;
    setEditingId: (id: string | null) => void;
    setDraft: (order: Order) => void;
    resetDraft: () => void;
}

export const useOrderEditStore = create<OrderEditState>()(
    persist(
        (set) => ({
            name: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            items: [],
            notes: '',
            status: 'pending',
            ingredientOverrides: [],
            totalCost: 0,
            editingId: null,
            setName: (name) => set({ name }),
            setDate: (date) => set({ date }),
            setNotes: (notes) => set({ notes }),
            setItems: (items) => set({ items }),
            setIngredientOverrides: (ingredientOverrides) => set({ ingredientOverrides }),
            setStatus: (status) => set({ status }),
            syncItemsFromIds: (selectedIds) => set((state) => {
                const newItems = [...state.items];

                // Add new recipes that are not in the list
                selectedIds.forEach(recipeId => {
                    if (!newItems.find(i => i.recipeId === recipeId)) {
                        newItems.push({ recipeId, quantity: 1 });
                    }
                });

                // Remove recipes that were deselected
                return {
                    items: newItems.filter(item => selectedIds.includes(item.recipeId))
                };
            }),
            setTotalCost: (totalCost) => set({ totalCost }),
            setEditingId: (editingId) => set({ editingId }),
            setDraft: (order) => set({
                name: order.name,
                date: format(new Date(order.date), 'yyyy-MM-dd'),
                items: JSON.parse(JSON.stringify(order.items)),
                notes: order.notes || '',
                status: order.status,
                ingredientOverrides: JSON.parse(JSON.stringify(order.ingredientOverrides || [])),
                totalCost: order.totalCost,
                editingId: order.id
            }),
            resetDraft: () => set({
                name: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                items: [],
                notes: '',
                status: 'pending',
                ingredientOverrides: [],
                totalCost: 0,
                editingId: null
            }),
        }),
        {
            name: 'order-edit-storage',
        }
    )
);
