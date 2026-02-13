import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { Header } from '../../../components/ui/Header';
import { DatePicker } from '../../../components/ui/DatePicker';
import { QuantitySelector } from '../../../components/ui/QuantitySelector';
import { MediaCard } from '../../../components/ui/MediaCard';
import { ActionFooter } from '../../../components/ui/ActionFooter';

export const DesignSystem: React.FC = () => {
    const [date, setDate] = useState('2026-02-13');
    const [quantity, setQuantity] = useState(12);

    return (
        <div className="bg-background-dark min-h-screen text-white font-display">
            <Header
                title="Design System"
                showBackButton
                rightElement={
                    <button className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm">
                        <span className="material-symbols-outlined text-white text-xl">settings</span>
                    </button>
                }
            />

            <main className="px-6 py-8 flex flex-col gap-12 pb-60">
                {/* 01. Colors */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">01. Brand Colors</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-primary mb-3 shadow-lg shadow-primary/25"></div>
                            <p className="font-bold text-sm">Primary</p>
                            <p className="text-xs text-text-muted">#FF6B35</p>
                        </div>
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-surface-dark border border-white/10 mb-3"></div>
                            <p className="font-bold text-sm">Surface</p>
                            <p className="text-xs text-text-muted">#1C1F2E</p>
                        </div>
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-success mb-3 shadow-lg shadow-success/20"></div>
                            <p className="font-bold text-sm">Success</p>
                            <p className="text-xs text-text-muted">#22C55E</p>
                        </div>
                        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-card">
                            <div className="h-16 rounded-xl bg-danger mb-3 shadow-lg shadow-danger/20"></div>
                            <p className="font-bold text-sm">Danger</p>
                            <p className="text-xs text-text-muted">#EF4444</p>
                        </div>
                    </div>
                </section>

                {/* 02. Navigation & Layout */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">02. Navigation & Headers</h3>
                    <div className="space-y-4">
                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-surface-dark/30">
                            <Header title="Master Page Title" subtitle="Subtitle Text" />
                            <div className="h-20 flex items-center justify-center text-xs text-text-muted">Master Page Content</div>
                        </div>
                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-surface-dark/30">
                            <Header title="Detail Page Title" showBackButton />
                            <div className="h-20 flex items-center justify-center text-xs text-text-muted">Detail Page Content</div>
                        </div>
                    </div>
                </section>

                {/* 03. Interactive Buttons */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">03. Interactive Buttons</h3>
                    <div className="flex flex-col gap-4">
                        <Button className="w-full h-14 text-lg">Primary Large</Button>
                        <div className="flex gap-4">
                            <Button className="flex-1">Normal</Button>
                            <Button variant="secondary" className="flex-1">Secondary</Button>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" className="flex-1">Ghost</Button>
                            <Button variant="danger" className="flex-1">Danger</Button>
                        </div>
                    </div>
                </section>

                {/* 04. Data Entry */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">04. Data Entry</h3>
                    <div className="space-y-6 bg-surface-dark/50 p-6 rounded-3xl border border-white/5">
                        <Input label="Text Input" placeholder="e.g. Wedding Event" icon="edit_note" />
                        <DatePicker label="Date Picker" value={date} onChange={setDate} />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">Quantity Selector</span>
                            <QuantitySelector
                                value={quantity}
                                onIncrement={() => setQuantity(q => q + 1)}
                                onDecrement={() => setQuantity(q => q > 0 ? q - 1 : 0)}
                            />
                        </div>
                    </div>
                </section>

                {/* 05. List Items & Cards */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">05. Content Media Cards</h3>
                    <div className="space-y-3">
                        <MediaCard
                            title="Indonesian Nasi Goreng"
                            image="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400"
                            subtitle={<Badge variant="success">Recipe Item</Badge>}
                            bottomElement={<div className="font-extrabold text-primary">Rp 45.000 / portion</div>}
                        />
                        <MediaCard
                            title="Catering Package A"
                            subtitle={<p className="text-xs text-text-muted">15 Ingredients • Yields 10</p>}
                            rightElement={<Icon name="delete" className="text-gray-500" />}
                            bottomElement={
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-bold">Rp 1.250.000</span>
                                    <QuantitySelector value={5} onIncrement={() => { }} onDecrement={() => { }} />
                                </div>
                            }
                        />
                    </div>
                </section>

                {/* 06. Action Footers */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">06. Action Footers</h3>
                    <div className="relative border border-white/5 rounded-3xl h-48 bg-surface-dark/20 overflow-hidden">
                        <div className="p-4 text-xs text-text-muted">Sticky footer preview area</div>
                        <ActionFooter
                            className="absolute bottom-0 rounded-none border-x-0 border-b-0"
                            summary={{ label: "Current Subtotal", value: "Rp 2.500.000" }}
                            primaryAction={{ label: "Proceed to Checkout", onClick: () => alert("Clicked!") }}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};
