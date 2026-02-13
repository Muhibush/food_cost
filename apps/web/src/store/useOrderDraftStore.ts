import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '../types';
import { format } from 'date-fns';

interface OrderDraftState {
    name: string;
    date: string;
    items: OrderItem[];
    notes: string;
    totalCost: number;
    editingId: string | null;
    setName: (name: string) => void;
    setDate: (date: string) => void;
    setNotes: (notes: string) => void;
    setItems: (items: OrderItem[]) => void;
    syncItemsFromIds: (ids: string[]) => void;
    setTotalCost: (cost: number) => void;
    setEditingId: (id: string | null) => void;
    resetDraft: () => void;
}

export const useOrderDraftStore = create<OrderDraftState>()(
    persist(
        (set) => ({
            name: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            items: [],
            notes: '',
            totalCost: 0,
            editingId: null,
            setName: (name) => set({ name }),
            setDate: (date) => set({ date }),
            setNotes: (notes) => set({ notes }),
            setItems: (items) => set({ items }),
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
            resetDraft: () => set({
                name: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                items: [],
                notes: '',
                totalCost: 0,
                editingId: null
            }),
        }),
        {
            name: 'order-draft-storage',
        }
    )
);
