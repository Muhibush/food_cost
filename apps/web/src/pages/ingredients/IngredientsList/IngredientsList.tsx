import React, { useState } from 'react';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Input } from '../../../components/ui/Input';

export const IngredientsList: React.FC = () => {
    const navigate = useNavigate();
    const { ingredients } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredIngredients = ingredients.filter(ing =>
        ing.name.toLowerCase().includes(search.toLowerCase())
    );

    // Helpers for coloring logic based on the HTML reference
    // We can randomize or hash the color based on the name if we want to stick to the design's variety
    const getIconColor = (name: string) => {
        const colors = [
            'text-orange-400', 'text-red-400', 'text-green-400',
            'text-yellow-400', 'text-blue-400', 'text-purple-400'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('egg')) return 'egg_alt';
        if (n.includes('beef') || n.includes('meat')) return 'set_meal';
        if (n.includes('basil') || n.includes('plant') || n.includes('veg')) return 'potted_plant';
        if (n.includes('flour') || n.includes('grain')) return 'grain';
        if (n.includes('water') || n.includes('liquid')) return 'water_drop';
        if (n.includes('extract') || n.includes('oil')) return 'science';
        return 'grocery';
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-32 -mx-5 -mt-4">
            <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-5 border-b border-white/5">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Ingredients</h1>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark text-white border border-white/5 hover:bg-white/10 transition-all active:scale-[0.95] shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">tune</span>
                    </button>
                </div>
                <Input
                    icon="search"
                    placeholder="Search ingredients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredIngredients.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <span className="material-symbols-outlined text-6xl opacity-20 mb-4">inventory_2</span>
                        <p>No ingredients found.</p>
                    </div>
                ) : (
                    filteredIngredients.map((ing) => (
                        <div
                            key={ing.id}
                            onClick={() => navigate(`/ingredients/${ing.id}`)}
                            className="bg-surface-dark p-4 rounded-2xl ring-1 ring-white/5 relative group active:scale-[0.99] transition-transform duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className={clsx("h-12 w-12 rounded-xl bg-[#2A2D3A] flex-shrink-0 flex items-center justify-center", getIconColor(ing.name))}>
                                    <span className="material-symbols-outlined text-2xl font-light">{getIcon(ing.name)}</span>
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <h3 className="font-bold text-white text-[17px] leading-tight truncate">{ing.name}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-white text-[15px]">Rp {ing.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase bg-white/5 px-2 py-0.5 rounded-md">/{ing.unit}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            <button
                className="fixed bottom-[100px] right-5 h-14 w-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all z-30 active:scale-95 ring-4 ring-background-dark"
                onClick={() => navigate('/ingredients/new')}
            >
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>
        </div>
    );
};
