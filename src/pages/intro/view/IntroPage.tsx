import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';

export const IntroPage: React.FC = () => {
    React.useLayoutEffect(() => {
        window.scrollTo(0, 0);
        // Backup for some mobile browsers that fight the scroll
        const timer = setTimeout(() => window.scrollTo(0, 0), 100);
        return () => clearTimeout(timer);
    }, []);

    const navigate = useNavigate();


    return (
        <div className="bg-[#0F111A] text-white min-h-screen font-display selection:bg-primary/30 antialiased overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/intro/hero_chef.png"
                        alt="Professional Chef"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F111A] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F111A]/60 via-transparent to-transparent" />
                </div>

                <div className="z-10 max-w-lg">
                    {/* Logo */}
                    <div className="mb-8 inline-flex bg-primary rounded-2xl p-4 shadow-2xl shadow-primary/40 animate-bounce-subtle">
                        <Icon name="restaurant" className="text-white !text-5xl" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                        Cook<span className="text-primary">Cost</span>
                    </h1>
                    <p className="text-xl text-white/70 font-medium leading-relaxed mb-10 px-4">
                        Master your kitchen's profitability with professional-grade food costing and recipe management.
                    </p>


                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <Icon name="keyboard_arrow_down" className="!text-3xl" />
                </div>
            </div>

            {/* Feature 1: Recipe Costing */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                            <img
                                src="/assets/intro/recipe_data.png"
                                alt="Recipe Costing Dashboard"
                                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F111A]/40 to-transparent" />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="inline-flex bg-primary/10 text-primary p-3 rounded-2xl">
                            <Icon name="analytics" className="!text-3xl" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">Precise Costing</h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed">
                            Stop guessing your margins. Calculate every plate cost down to the gram with our automated ingredient tracking system.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                { icon: 'done_all', text: 'Real-time margin calculation' },
                                { icon: 'done_all', text: 'Automated portion scaling' },
                                { icon: 'done_all', text: 'Profitability snapshots' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/80 font-bold">
                                    <Icon name={item.icon} className="text-primary !text-xl" />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Feature 2: Ingredients */}
            <section className="py-24 px-6 bg-[#161925]">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex bg-primary/10 text-primary p-3 rounded-2xl">
                            <Icon name="inventory_2" className="!text-3xl" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight">Smart Inventory</h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed">
                            Manage your pantry with ease. Track unit conversions and price fluctuations automatically across all your recipes.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-[#0F111A] p-4 rounded-2xl border border-white/5">
                                <h4 className="font-black text-primary text-2xl mb-1">100%</h4>
                                <p className="text-xs text-white/40 uppercase font-black tracking-widest">Accuracy</p>
                            </div>
                            <div className="bg-[#0F111A] p-4 rounded-2xl border border-white/5">
                                <h4 className="font-black text-primary text-2xl mb-1">2x</h4>
                                <p className="text-xs text-white/40 uppercase font-black tracking-widest">Efficiency</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative z-10 group">
                            <img
                                src="/assets/intro/ingredients.png"
                                alt="Ingredients Management"
                                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#0F111A]/20" />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="max-w-2xl mx-auto z-10 relative">
                    <h2 className="text-5xl font-black tracking-tight mb-8">Ready to Scale Your Kitchen?</h2>
                    <p className="text-xl text-white/60 mb-12 font-medium leading-relaxed">
                        Join thousands of chefs managing their costs professionally with CookCost.
                    </p>
                    <Button
                        onClick={() => navigate('/login')}
                        className="h-20 px-16 rounded-3xl text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Launch Now
                        <Icon name="rocket_launch" className="ml-3 group-hover:rotate-12 transition-transform" />
                    </Button>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-x-1/2" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full translate-x-1/2" />
            </section>

            <footer className="py-12 border-t border-white/5 text-center px-6">
                <p className="text-sm font-bold text-white/20 uppercase tracking-[0.2em]">
                    &copy; 2026 CookCost &bull; Professional Food Costing Solutions
                </p>
            </footer>
        </div>
    );
};
