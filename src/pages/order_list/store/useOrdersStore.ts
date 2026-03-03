import { create } from 'zustand';
import { Order } from '../../../types';
import { db, auth } from '../../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, getDocs } from 'firebase/firestore';
import { sanitizeData } from '../../../utils/sanitize';

interface OrdersState {
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
    removeOrder: (id: string) => Promise<void>;
    getOrder: (id: string) => Order | undefined;
    clearAllOrders: () => Promise<void>;
    initListener: () => () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: [],
    addOrder: async (order) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/orders`, order.id);
        await setDoc(docRef, sanitizeData(order));
    },
    updateOrder: async (id, updates) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/orders`, id);
        await setDoc(docRef, sanitizeData(updates), { merge: true });
    },
    removeOrder: async (id) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const docRef = doc(db, `users/${uid}/orders`, id);
        await deleteDoc(docRef);
    },
    getOrder: (id) => get().orders.find((ord) => ord.id === id),
    clearAllOrders: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            set({ orders: [] });
            return;
        }
        const q = query(collection(db, `users/${uid}/orders`));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        set({ orders: [] });
    },
    initListener: () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return () => { };
        const q = query(collection(db, `users/${uid}/orders`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const orders: Order[] = [];
            snapshot.forEach((doc) => {
                orders.push(doc.data() as Order);
            });
            // Sort by date mostly, but we'll prepend conceptually in UI or by timestamp
            set({ orders });
        });
        return unsubscribe;
    }
}));
