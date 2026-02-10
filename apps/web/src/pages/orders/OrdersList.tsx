import React, { useState } from 'react';
import { useOrdersStore } from '../../store/useOrdersStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
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
        <div className="p-6 pb-24 flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold">Orders</h1>
                <Button size="icon" onClick={() => navigate('/orders/new')}>
                    <Icon name="add" />
                </Button>
            </header>

            <div className="sticky top-0 z-10 bg-background-dark py-2">
                <Input
                    placeholder="Search orders..."
                    icon="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-4">
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
                                    {format(new Date(order.date), 'dd MMM yyyy, HH:mm')}
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
