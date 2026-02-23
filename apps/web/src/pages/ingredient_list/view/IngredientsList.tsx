import React, { useState } from 'react';
import { useIngredientsStore } from '../store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { Input } from '../../../components/ui/Input';
import { Header } from '../../../components/ui/Header';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/format';
import { Card } from '../../../components/ui/Card';
import { FAB } from '../../../components/ui/FAB';

export const IngredientsList: React.FC = () => {
    const navigate = useNavigate();
    const { ingredients } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredIngredients = ingredients
        .filter(ing => ing.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

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
            <Header
                title="Ingredients"
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search ingredients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                }
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredIngredients.length === 0 ? (
                    <EmptyState
                        icon="inventory_2"
                        title="No ingredients found"
                        message={search ? "Try a different search term" : "Start by adding your first ingredient"}
                        action={{
                            label: search ? "Clear search" : "Add ingredient",
                            onClick: () => search ? setSearch('') : navigate('/ingredients/new')
                        }}
                    />
                ) : (
                    filteredIngredients.map((ing) => (
                        <Card
                            key={ing.id}
                            hoverEffect
                            onClick={() => navigate(`/ingredients/${ing.id}`)}
                            className="flex items-center gap-4"
                        >
                            <div className={cn("h-12 w-12 rounded-xl bg-[#2A2D3A] flex-shrink-0 flex items-center justify-center", getIconColor(ing.name))}>
                                <span className="material-symbols-outlined text-2xl font-light">{getIcon(ing.name)}</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <h3 className="font-bold text-white text-[17px] leading-tight truncate">{ing.name}</h3>
                                <div className="text-[14px] text-text-muted mt-0.5 font-medium truncate">
                                    Rp {formatCurrency(ing.price)} <span className="text-[12px] opacity-70">/ {ing.unit}</span>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </main>

            <FAB
                icon="add"
                onClick={() => navigate('/ingredients/new')}
            />
        </div>
    );
};
