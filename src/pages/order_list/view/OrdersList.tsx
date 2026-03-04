import React, { useState } from 'react';
import { Order, OrderItem } from '../../../types';
import { useOrdersStore } from '../store/useOrdersStore';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { Badge } from '../../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/format';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { EmptyState } from '../../../components/ui/EmptyState';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';
import { cn } from '../../../utils/cn';
import { MediaCard } from '../../../components/ui/MediaCard';

export const OrdersList: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useOrdersStore();
    const { recipes } = useRecipesStore();
    const [search, setSearch] = useState('');

    const filteredOrders = orders.filter(ord =>
        ord.name.toLowerCase().includes(search.toLowerCase()) ||
        ord.id.includes(search)
    );

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-32 -mx-5 -mt-4">
            <Header
                title="Orders"
                rightElement={
                    <button
                        onClick={() => navigate('/orders/new')}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark text-white border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                }
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                }
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredOrders.length === 0 ? (
                    <EmptyState
                        icon="receipt_long"
                        title={search ? "No matching orders" : "No orders recorded"}
                        message={search
                            ? `We couldn't find any orders matching "${search}". Try search by name or ID.`
                            : "Start recording your customer orders to track total costs and manage your kitchen profitability."
                        }
                        action={{
                            label: search ? "Clear search" : "Create first order",
                            onClick: () => search ? setSearch('') : navigate('/orders/new')
                        }}
                    />
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map((order: Order) => {
                            const firstItem = order.items[0];
                            const recipe = firstItem ? recipes.find(r => r.id === firstItem.recipeId) : null;
                            const iconConfig = getRecipeIconConfig(order.name);

                            return (
                                <MediaCard
                                    key={order.id}
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    image={recipe?.image}
                                    icon={recipe?.icon || iconConfig.icon}
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span className="truncate">{order.name}</span>
                                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </div>
                                    }
                                    iconContainerClassName={cn(
                                        !recipe?.image && (recipe?.color ? `bg-${recipe.color}-500/10` : iconConfig.bgClass),
                                        !recipe?.image && (recipe?.color ? `text-${recipe.color}-400` : iconConfig.colorClass)
                                    )}
                                    subtitle={
                                        <div className="flex flex-col gap-0.5 mt-0.5">
                                            <p className="text-xs text-text-muted">
                                                {format(new Date(order.date), 'd MMMM yyyy')}
                                            </p>
                                            <p className="text-xs text-text-muted font-medium">
                                                {order.items.reduce((acc: number, item: OrderItem) => acc + item.quantity, 0)} Items
                                            </p>
                                        </div>
                                    }
                                    bottomElement={
                                        <span className="text-white font-bold text-[15px]">
                                            Rp {formatCurrency(order.totalCost)}
                                        </span>
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};
