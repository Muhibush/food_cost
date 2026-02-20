import React, { useState } from 'react';
import { Order, OrderItem } from '../../../types';
import { useOrdersStore } from '../store/useOrdersStore';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/format';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { EmptyState } from '../../../components/ui/EmptyState';

export const OrdersList: React.FC = () => {
    const navigate = useNavigate();
    const { orders } = useOrdersStore();
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
                        title="No orders found"
                        message={search ? "Try a different search term" : "You haven't placed any orders yet"}
                        action={{
                            label: search ? "Clear search" : "Create new order",
                            onClick: () => search ? setSearch('') : navigate('/orders/new')
                        }}
                    />
                ) : (
                    filteredOrders.map((order: Order) => (
                        <Card
                            key={order.id}
                            hoverEffect
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="flex justify-between items-start"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-base">{order.name}</h3>
                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                </div>
                                <p className="text-xs text-text-muted">
                                    {format(new Date(order.date), 'd MMMM yyyy')}
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                    {order.items.reduce((acc: number, item: OrderItem) => acc + item.quantity, 0)} Items
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-base block">Rp {formatCurrency(order.totalCost)}</span>
                            </div>
                        </Card>
                    ))
                )}
            </main>
        </div>
    );
};
