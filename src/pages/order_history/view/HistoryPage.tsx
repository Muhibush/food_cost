// 🔒 LOCKED FILE: Do not modify this file without explicit double confirmation from the user.
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '../../order_list/store/useOrdersStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
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
import { cn } from '../../../utils/cn';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Icon } from '../../../components/ui/Icon';

export const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { orders, removeOrder } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
    const touchStartRef = useRef<{ x: number, y: number } | null>(null);

    const handlePressStart = (id: string) => {
        if (selectionMode) return;
        const timer = setTimeout(() => {
            setSelectionMode(true);
            setSelectedIds([id]);
        }, 500);
        setPressTimer(timer);
    };

    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        handlePressStart(id);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartRef.current || !pressTimer) return;
        const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
        if (deltaX > 10 || deltaY > 10) {
            clearTimeout(pressTimer);
            setPressTimer(null);
            touchStartRef.current = null;
        }
    };

    const handlePressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
        touchStartRef.current = null;
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedIds([]);
        setSearchQuery('');
    };

    const handleDeleteSelected = async () => {
        setIsDeleteDialogOpen(false);
        await Promise.all(selectedIds.map(id => removeOrder(id)));
        exitSelectionMode();
    };

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
                title={selectionMode ? "Select Orders" : "History"}
                leftElement={
                    selectionMode ? (
                        <button onClick={exitSelectionMode} className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    ) : undefined
                }
                rightElement={
                    !selectionMode ? (
                        <FilterButton
                            isActive={isFilterActive}
                            onClick={() => setIsFilterOpen(true)}
                        />
                    ) : undefined
                }
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search past orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={selectionMode ? "opacity-50 pointer-events-none" : ""}
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
                                    {group.orders.map((order) => {
                                        const firstItem = order.items[0];
                                        const recipe = firstItem ? recipes.find(r => r.id === firstItem.recipeId) : null;
                                        const iconConfig = getRecipeIconConfig(order.name);

                                        return (
                                            <MediaCard
                                                key={order.id}
                                                onContextMenu={(e: React.MouseEvent) => { e.preventDefault(); }}
                                                onTouchStart={(e: React.TouchEvent) => handleTouchStart(e, order.id)}
                                                onTouchMove={handleTouchMove}
                                                onTouchEnd={handlePressEnd}
                                                onTouchCancel={handlePressEnd}
                                                onMouseDown={() => handlePressStart(order.id)}
                                                onMouseUp={handlePressEnd}
                                                onMouseLeave={handlePressEnd}
                                                onClick={() => {
                                                    if (selectionMode) {
                                                        toggleSelection(order.id);
                                                    } else {
                                                        navigate(`/orders/${order.id}`);
                                                    }
                                                }}
                                                className={cn(
                                                    "select-none transition-all duration-200",
                                                    selectionMode && selectedIds.includes(order.id) && "ring-2 ring-primary !bg-primary/20"
                                                )}
                                                image={recipe?.image}
                                                icon={recipe?.icon || iconConfig.icon}
                                                title={order.name}
                                                iconContainerClassName={cn(
                                                    !recipe?.image && (recipe?.color ? `bg-${recipe.color}-500/10` : iconConfig.bgClass),
                                                    !recipe?.image && (recipe?.color ? `text-${recipe.color}-400` : iconConfig.colorClass)
                                                )}
                                                subtitle={
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 font-medium">
                                                        <span>{format(parseISO(order.date), 'd MMMM yyyy')}</span>
                                                        <span className="size-1 bg-gray-600 rounded-full"></span>
                                                        <span>{getTotalPortions(order)} Portions</span>
                                                    </div>
                                                }
                                                bottomElement={
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="text-primary font-bold text-[15px]">
                                                            Rp {formatCurrency(Math.round(order.totalCost))}
                                                        </p>
                                                    </div>
                                                }
                                                rightElement={
                                                    selectionMode ? (
                                                        <div className="flex-shrink-0 text-primary self-center ml-2">
                                                            <Icon
                                                                name={selectedIds.includes(order.id) ? "check_circle" : "radio_button_unchecked"}
                                                                className={cn(
                                                                    selectedIds.includes(order.id) ? "text-primary" : "text-gray-500",
                                                                    "transition-colors"
                                                                )}
                                                            />
                                                        </div>
                                                    ) : undefined
                                                }
                                            />
                                        );
                                    })}
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

            {selectionMode && (
                <ActionFooter
                    className="bottom-[88px]"
                    summary={{
                        label: "Selected Orders",
                        value: `${selectedIds.length} Items`
                    }}
                    primaryAction={{
                        label: 'Delete',
                        onClick: () => setIsDeleteDialogOpen(true),
                        isDisabled: selectedIds.length === 0,
                        variant: 'danger'
                    }}
                />
            )}

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Orders?"
                message={`Are you sure you want to delete ${selectedIds.length} orders? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isDestructive
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteSelected}
            />

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
