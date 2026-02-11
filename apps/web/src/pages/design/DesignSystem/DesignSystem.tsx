import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';
import { BottomNav } from '../../../components/layout/BottomNav';

export const DesignSystem: React.FC = () => {
    return (
        <div className="bg-background-dark min-h-screen text-white font-display">
            {/* Header - Standard Pattern */}
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight">Design System</h1>
                    <button className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm">
                        <span className="material-symbols-outlined text-white text-xl">settings</span>
                    </button>
                </div>
            </header>

            <main className="px-6 py-8 flex flex-col gap-12 pb-40">
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

                {/* 02. Typography */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">02. Typography</h3>
                    <div className="bg-surface-dark p-6 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <p className="text-3xl font-black mb-1">Heading 3XL</p>
                            <p className="text-xs text-text-muted">Manrope Black • 30px</p>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold mb-1">Heading 2XL</p>
                            <p className="text-xs text-text-muted">Manrope Extrabold • 24px</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold mb-1">Body Large</p>
                            <p className="text-xs text-text-muted">Manrope Bold • 18px</p>
                        </div>
                        <div>
                            <p className="text-base font-medium mb-1">Body Text</p>
                            <p className="text-xs text-text-muted">Manrope Medium • 16px</p>
                        </div>
                    </div>
                </section>

                {/* 03. Buttons */}
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
                        <div className="flex gap-4 items-center justify-center">
                            <Button size="icon" className="rounded-full"><Icon name="add" /></Button>
                            <Button size="icon" variant="secondary" className="rounded-full"><Icon name="more_vert" /></Button>
                            <Button isLoading className="px-8">Saving...</Button>
                        </div>
                    </div>
                </section>

                {/* 04. Form Fields */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">04. Data Entry</h3>
                    <div className="space-y-6 bg-surface-dark/50 p-6 rounded-3xl border border-white/5">
                        <Input label="Order Name" placeholder="e.g. Wedding Event" icon="edit_note" />
                        <Input label="Secure PIN" type="password" placeholder="••••••" icon="lock" className="tracking-[0.5em] font-black" />
                        <Input label="Search Field" placeholder="Search components..." icon="search" />
                        <Input label="Error State" value="Invalid Value" error="Verification failed" icon="warning" />
                    </div>
                </section>

                {/* 05. Cards & Badges */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">05. Content Containers</h3>
                    <div className="space-y-4">
                        <Card hoverEffect className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-base mb-0.5">Premium Card Component</h4>
                                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Category • Today</p>
                                </div>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">Cards use a rounded-2xl corner radius with a subtle border and depth shadow.</p>
                            <div className="flex gap-2">
                                <Badge variant="warning">Pending</Badge>
                                <Badge variant="danger">Critical</Badge>
                                <Badge>Default</Badge>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 06. Sticky Footer Example */}
                <section className="space-y-4 pt-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">06. Footer Sticky Bottom</h3>
                    <div className="bg-surface-dark border-t border-white/5 -mx-6 px-6 py-6 mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Total Estimation</p>
                                <div className="text-2xl font-extrabold text-white">Rp 2.500.000</div>
                            </div>
                            <Button size="lg" className="rounded-2xl px-8 shadow-2xl">Confirm Action</Button>
                        </div>
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};
