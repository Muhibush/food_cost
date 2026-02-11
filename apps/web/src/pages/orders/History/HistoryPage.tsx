import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { Icon } from '../../../components/ui/Icon';
import { Input } from '../../../components/ui/Input';
import { format, parseISO, startOfMonth, isSameMonth } from 'date-fns';
import { useRecipesStore } from '../../../store/useRecipesStore';

export const HistoryPage: React.FC = () => {
    const { orders } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [orders, searchQuery]);

    const groupedOrders = useMemo(() => {
        const groups: { month: Date; orders: typeof filteredOrders }[] = [];

        filteredOrders.forEach(order => {
            const date = parseISO(order.date);
            const monthStart = startOfMonth(date);

            let group = groups.find(g => isSameMonth(g.month, monthStart));
            if (!group) {
                group = { month: monthStart, orders: [] };
                groups.push(group);
            }
            group.orders.push(order);
        });

        // Sort months descending
        return groups.sort((a, b) => b.month.getTime() - a.month.getTime());
    }, [filteredOrders]);

    const getOrderImage = (order: any) => {
        if (order.items.length > 0) {
            const firstRecipe = recipes.find(r => r.id === order.items[0].recipeId);
            if (firstRecipe?.image) return firstRecipe.image;
        }
        return null;
    };

    const getTotalPortions = (order: any) => {
        return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-20">
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-extrabold tracking-tight">Order History</h1>
                    <button className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm">
                        <span className="material-symbols-outlined text-white text-xl">calendar_month</span>
                    </button>
                </div>
                <Input
                    icon="search"
                    placeholder="Search past orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </header>

            <div className="flex-1 space-y-8 mt-4 pb-20">
                {groupedOrders.length > 0 ? (
                    groupedOrders.map((group) => (
                        <div key={group.month.toISOString()}>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-1">
                                {format(group.month, 'MMMM yyyy')}
                            </h3>
                            <div className="space-y-3">
                                {group.orders.map((order) => {
                                    const image = getOrderImage(order);
                                    return (
                                        <Link
                                            key={order.id}
                                            to={`/orders/${order.id}`}
                                            className="bg-surface-dark rounded-2xl p-4 shadow-sm border border-white/5 active:scale-[0.98] transition-transform duration-200 flex gap-4 items-start block"
                                        >
                                            <div className="relative shrink-0 size-[72px] rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
                                                {image ? (
                                                    <img src={image} alt={order.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Icon name="restaurant_menu" size="xl" className="text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col h-full justify-between py-0.5">
                                                <div>
                                                    <h3 className="text-base font-bold text-white truncate mb-1">{order.name}</h3>
                                                    <p className="text-primary font-bold text-sm mb-1.5">
                                                        Rp {Math.round(order.totalCost).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span>{format(parseISO(order.date), 'MMM dd, yyyy')}</span>
                                                    <span className="size-1 bg-gray-600 rounded-full"></span>
                                                    <span>{getTotalPortions(order)} Portions</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
                        <Icon name="history_toggle_off" size="xl" className="text-gray-600" />
                        <p className="text-sm font-medium">No order history found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
