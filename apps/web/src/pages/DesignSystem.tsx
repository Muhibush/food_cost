import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { BottomNav } from '../components/layout/BottomNav';

export const DesignSystem: React.FC = () => {
    return (
        <div className="bg-background-dark min-h-screen text-white pb-32">
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-sm px-6 pt-8 pb-4 border-b border-white/5">
                <h1 className="text-xl font-extrabold tracking-tight">Design System</h1>
            </header>

            <main className="px-6 py-6 flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">01. Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-primary mb-3 shadow-lg shadow-primary/20"></div>
                            <p className="font-bold text-sm">Primary</p>
                            <p className="text-xs text-text-muted">#FF6B35</p>
                        </div>
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-surface-dark border border-white/10 mb-3"></div>
                            <p className="font-bold text-sm">Surface</p>
                            <p className="text-xs text-text-muted">#1C1F2E</p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">02. Buttons</h3>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button>Primary Action</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                        <Button size="icon"><Icon name="add" /></Button>
                        <Button isLoading>Loading</Button>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">03. Inputs</h3>
                    <div className="space-y-4">
                        <Input label="Username" placeholder="Enter username" icon="person" />
                        <Input label="Password" type="password" placeholder="••••••" icon="lock" />
                        <Input label="Error State" placeholder="Invalid input" error="This field is required" />
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">04. Cards & Badges</h3>
                    <Card hoverEffect>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-base">Order #1234</h4>
                            <Badge variant="success">Completed</Badge>
                        </div>
                        <p className="text-xs text-text-muted mb-3">Oct 24, 2023 • 150 Portions</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="warning">Pending</Badge>
                            <Badge variant="danger">Cancelled</Badge>
                        </div>
                    </Card>
                </section>
            </main>

            <BottomNav
                items={[
                    { icon: 'grid_view', label: 'System', isActive: true },
                    { icon: 'restaurant_menu', label: 'Recipes' },
                    { icon: 'inventory_2', label: 'Inventory' },
                ]}
            />
        </div>
    );
};
