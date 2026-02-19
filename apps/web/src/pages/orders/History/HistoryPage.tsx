// 🔒 LOCKED FILE: Do not modify this file without explicit double confirmation from the user.
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { formatCurrency } from '../../../utils/format';
import { format, parseISO, startOfMonth, isSameMonth, compareDesc, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Input } from '../../../components/ui/Input';
import { Header } from '../../../components/ui/Header';
import { MediaCard } from '../../../components/ui/MediaCard';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { DatePicker } from '../../../components/ui/DatePicker';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FilterButton } from '../../../components/ui/FilterButton';

export const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase());

                if (!matchesSearch) return false;

                if (startDate || endDate) {
                    const orderDate = parseISO(order.date);
                    const rangeStart = startDate ? startOfDay(parseISO(startDate)) : new Date(0);
                    const rangeEnd = endDate ? endOfDay(parseISO(endDate)) : new Date(8640000000000000);

                    return isWithinInterval(orderDate, { start: rangeStart, end: rangeEnd });
                }

                return true;
            })
            .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
    }, [orders, searchQuery, startDate, endDate]);

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
        return undefined;
    };

    const getTotalPortions = (order: any) => {
        return order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    };

    const isFilterActive = !!(startDate || endDate);

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col -mx-5 -mt-4 pb-20">
            <Header
                title="History"
                rightElement={
                    <FilterButton
                        isActive={isFilterActive}
                        onClick={() => setIsFilterOpen(true)}
                    />
                }
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search past orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                }
            />

            <main className="flex-1 flex flex-col px-6 pt-6 pb-20">
                <div className="flex-1 space-y-8">
                    {groupedOrders.length > 0 ? (
                        groupedOrders.map((group) => (
                            <div key={group.month.toISOString()}>
                                <SectionHeader
                                    title={format(group.month, 'MMMM yyyy')}
                                    rightElement={`${group.orders.length} orders`}
                                />

                                <div className="grid grid-cols-1 gap-4">
                                    {group.orders.map((order) => (
                                        <MediaCard
                                            key={order.id}
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            image={getOrderImage(order)}
                                            title={order.name}
                                            subtitle={
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 font-medium">
                                                    <span>{format(parseISO(order.date), 'd MMMM yyyy')}</span>
                                                    <span className="size-1 bg-gray-600 rounded-full"></span>
                                                    <span>{getTotalPortions(order)} Portions</span>
                                                </div>
                                            }
                                            bottomElement={
                                                <p className="text-primary font-bold text-[15px]">
                                                    Rp {formatCurrency(Math.round(order.totalCost))}
                                                </p>
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            icon="history_toggle_off"
                            title="No order history found"
                            message={isFilterActive ? "Try adjusting your search or filters" : "You haven't placed any orders yet"}
                            action={isFilterActive ? {
                                label: "Clear date filters",
                                onClick: clearFilters
                            } : undefined}
                        />
                    )}
                </div>
            </main>

            <BottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Filter by Date"
            >
                <div className="px-6 py-6 space-y-6 pb-12">
                    <div className="grid grid-cols-2 gap-4">
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={setEndDate}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={clearFilters}
                            className="flex-1 h-12 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
};
