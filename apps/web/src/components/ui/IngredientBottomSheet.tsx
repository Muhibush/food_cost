import React, { useState, useMemo } from 'react';
import { Ingredient } from '../../types';
import { useIngredientsStore } from '../../pages/ingredient_list/store/useIngredientsStore';
import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { Input } from './Input';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import { getIngredientIconConfig } from '../../utils/ingredientIcons';

interface IngredientBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ingredient: Ingredient) => void;
    selectedId?: string;
}

export const IngredientBottomSheet: React.FC<IngredientBottomSheetProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedId
}) => {
    const { ingredients } = useIngredientsStore();
    const [searchQuery, setSearchQuery] = useState('');

    // Reset search query when bottom sheet opens
    React.useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const filteredIngredients = useMemo(() => {
        return ingredients.filter((ing: Ingredient) =>
            ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [ingredients, searchQuery]);


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

                {/* Ingredient List */}
                <div className="space-y-3 pb-8">
                    {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ing: Ingredient) => {
                            const isSelected = ing.id === selectedId;
                            return (
                                <button
                                    key={ing.id}
                                    onClick={() => onSelect(ing)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 bg-[#252836] border rounded-2xl transition-all group text-left shadow-sm active:scale-[0.98]",
                                        isSelected
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : "hover:bg-[#2C3041] border-gray-700/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {(() => {
                                            const iconConfig = getIngredientIconConfig(ing.name);
                                            return (
                                                <div className={cn(
                                                    "h-12 w-12 rounded-full flex items-center justify-center border overflow-hidden",
                                                    ing.image
                                                        ? "border-white/10"
                                                        : cn(iconConfig.bgClass, iconConfig.borderClass)
                                                )}>
                                                    {ing.image ? (
                                                        <img src={ing.image} alt={ing.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Icon
                                                            name={iconConfig.icon}
                                                            size="lg"
                                                            className={iconConfig.colorClass}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })()}
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
