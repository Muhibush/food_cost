import React, { useState } from 'react';
import { useOrdersStore } from '../../../store/useOrdersStore';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { Badge } from '../../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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
            <header className="sticky top-0 z-30 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Orders</h1>
                    <button
                        onClick={() => navigate('/orders/new')}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark text-white border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-[20px]">search</span>
                    <input
                        className="w-full pl-11 pr-4 py-3.5 bg-surface-dark border-none ring-1 ring-white/5 rounded-2xl text-[15px] focus:ring-2 focus:ring-primary outline-none text-white placeholder-gray-500 transition-shadow"
                        placeholder="Search orders..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredOrders.length === 0 ? (
                    <div className="text-center text-text-muted py-10">
                        <Icon name="receipt_long" size="xl" className="opacity-20 mb-4" />
                        <p>No orders found.</p>
                        <Button variant="ghost" onClick={() => navigate('/orders/new')}>Create new order</Button>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
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
                                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-base block">Rp {order.totalCost.toLocaleString()}</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
