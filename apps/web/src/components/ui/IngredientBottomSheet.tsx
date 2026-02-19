import React, { useState, useMemo } from 'react';
import { Ingredient } from '../../types';
import { useIngredientsStore } from '../../pages/ingredient_list/store/useIngredientsStore';
import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { Input } from './Input';
import { formatCurrency } from '../../utils/format';

interface IngredientBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ingredient: Ingredient) => void;
}

export const IngredientBottomSheet: React.FC<IngredientBottomSheetProps> = ({
    isOpen,
    onClose,
    onSelect
}) => {
    const { ingredients } = useIngredientsStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIngredients = useMemo(() => {
        return ingredients.filter((ing: Ingredient) =>
            ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [ingredients, searchQuery]);

    const getIngredientIcon = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('egg')) return 'egg';
        if (lowerName.includes('beef') || lowerName.includes('meat') || lowerName.includes('chicken')) return 'lunch_dining';
        if (lowerName.includes('basil') || lowerName.includes('leaf') || lowerName.includes('veggie') || lowerName.includes('herb')) return 'eco';
        if (lowerName.includes('flour') || lowerName.includes('grain') || lowerName.includes('rice')) return 'grain';
        if (lowerName.includes('water') || lowerName.includes('oil') || lowerName.includes('milk') || lowerName.includes('liquid')) return 'water_drop';
        return 'inventory_2';
    };

    const getIconColorClass = (icon: string): string => {
        switch (icon) {
            case 'egg': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'lunch_dining': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'eco': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'grain': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'water_drop': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Ingredient">
            <div className="p-4 bg-surface-dark flex flex-col gap-5">
                {/* Search Input */}
                <Input
                    icon="search"
                    placeholder="Search master list..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Create New Shortcut */}
                <button className="text-primary font-bold text-sm flex items-center justify-center gap-2 hover:text-primary-dark transition-colors py-2">
                    <Icon name="add" size="md" className="font-bold" />
                    Create New Master Ingredient
                </button>

                {/* Ingredient List */}
                <div className="space-y-3 pb-8">
                    {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ing: Ingredient) => {
                            const icon = getIngredientIcon(ing.name);
                            return (
                                <button
                                    key={ing.id}
                                    onClick={() => onSelect(ing)}
                                    className="w-full flex items-center justify-between p-4 bg-[#252836] hover:bg-[#2C3041] border border-gray-700/30 rounded-2xl transition-all group text-left shadow-sm active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${getIconColorClass(icon)}`}>
                                            <Icon name={icon} size="lg" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base mb-0.5">{ing.name}</p>
                                            <p className="text-xs font-medium text-gray-400">Unit: {ing.unit}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white text-base">
                                            Rp {formatCurrency(Math.round(ing.price))}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-2">
                            <Icon name="search_off" size="xl" />
                            <p className="text-sm font-medium">No ingredients found</p>
                        </div>
                    )}
                </div>
            </div>
        </BottomSheet>
    );
};
