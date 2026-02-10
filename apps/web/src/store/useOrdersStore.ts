import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '../types';

interface OrdersState {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    removeOrder: (id: string) => void;
    getOrder: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
            updateOrder: (id, updates) =>
                set((state) => ({
                    orders: state.orders.map((ord) =>
                        ord.id === id ? { ...ord, ...updates } : ord
                    ),
                })),
            removeOrder: (id) =>
                set((state) => ({
                    orders: state.orders.filter((ord) => ord.id !== id),
                })),
            getOrder: (id) => get().orders.find((ord) => ord.id === id),
        }),
        {
            name: 'food-cost-orders',
        }
    )
);
