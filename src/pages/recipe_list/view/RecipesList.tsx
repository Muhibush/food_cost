import React, { useState, useRef } from 'react';
import { useRecipesStore } from '../store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/format';
import { Recipe } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Header } from '../../../components/ui/Header';
import { MediaCard } from '../../../components/ui/MediaCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FAB } from '../../../components/ui/FAB';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';
import { cn } from '../../../utils/cn';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Icon } from '../../../components/ui/Icon';

export const RecipesList: React.FC = () => {
    const navigate = useNavigate();
    const { recipes, removeRecipe } = useRecipesStore();
    const { getIngredient } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredRecipes = recipes
        .filter(rec => rec.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
    const touchStartRef = useRef<{ x: number, y: number } | null>(null);

    const handlePressStart = (id: string) => {
        if (selectionMode) return;
        const timer = setTimeout(() => {
            setSelectionMode(true);
            setSelectedIds([id]);
        }, 500);
        setPressTimer(timer);
    };

    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        handlePressStart(id);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartRef.current || !pressTimer) return;
        const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
        if (deltaX > 10 || deltaY > 10) {
            clearTimeout(pressTimer);
            setPressTimer(null);
            touchStartRef.current = null;
        }
    };

    const handlePressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
        touchStartRef.current = null;
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedIds([]);
        setSearch('');
    };

    const handleDeleteSelected = async () => {
        setIsDeleteDialogOpen(false);
        await Promise.all(selectedIds.map(id => removeRecipe(id)));
        exitSelectionMode();
    };

    const calculateCost = (recipe: Recipe) => {
        if (recipe.manualCost) return recipe.manualCost;

        return recipe.ingredients.reduce((total, item) => {
            const ingredient = getIngredient(item.ingredientId);
            if (!ingredient) return total;
            return total + (ingredient.price * item.quantity);
        }, 0);
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-32 -mx-5 -mt-4">
            <Header
                title={selectionMode ? "Select Recipes" : "Recipes"}
                leftElement={
                    selectionMode ? (
                        <button onClick={exitSelectionMode} className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    ) : undefined
                }
                bottomElement={
                    <Input
                        icon="search"
                        placeholder="Search recipes..."
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={selectionMode ? "opacity-50 pointer-events-none" : ""}
                    />
                }
            />

            <main className="flex-1 flex flex-col gap-6 px-6 pt-6 relative z-0">
                {filteredRecipes.length === 0 ? (
                    <EmptyState
                        icon="restaurant_menu"
                        title={search ? "No matching recipes" : "No recipes yet"}
                        message={search
                            ? `We couldn't find any recipes matching "${search}". Try a different term.`
                            : "Create your first recipe to start calculating costs per portion and organizing your kitchen."
                        }
                        action={{
                            label: search ? "Clear search" : "Create first recipe",
                            onClick: () => search ? setSearch('') : navigate('/recipes/new')
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRecipes.map((rec) => {
                            const totalCost = calculateCost(rec);
                            const costPerPortion = totalCost / (rec.yield || 1);
                            const iconConfig = getRecipeIconConfig(rec.name);

                            return (
                                <MediaCard
                                    key={rec.id}
                                    onContextMenu={(e: React.MouseEvent) => { e.preventDefault(); }}
                                    onTouchStart={(e: React.TouchEvent) => handleTouchStart(e, rec.id)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handlePressEnd}
                                    onTouchCancel={handlePressEnd}
                                    onMouseDown={() => handlePressStart(rec.id)}
                                    onMouseUp={handlePressEnd}
                                    onMouseLeave={handlePressEnd}
                                    onClick={() => {
                                        if (selectionMode) {
                                            toggleSelection(rec.id);
                                        } else {
                                            navigate(`/recipes/${rec.id}`);
                                        }
                                    }}
                                    className={cn(
                                        "select-none transition-all duration-200",
                                        selectionMode && selectedIds.includes(rec.id) && "ring-2 ring-primary !bg-primary/20"
                                    )}
                                    image={rec.image}
                                    icon={rec.icon || iconConfig.icon}
                                    title={rec.name}
                                    iconContainerClassName={cn(
                                        !rec.image && (rec.color ? `bg-${rec.color}-500/10` : iconConfig.bgClass),
                                        !rec.image && (rec.color ? `text-${rec.color}-400` : iconConfig.colorClass)
                                    )}
                                    subtitle={
                                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 font-medium">
                                            <span>{rec.ingredients.length} Ingredients</span>
                                            <span className="size-1 bg-white/10 rounded-full"></span>
                                            <span>{rec.yield || 0} Base Yield</span>
                                        </div>
                                    }
                                    bottomElement={
                                        <div className="text-[15px] font-extrabold text-white">
                                            <span className="text-primary">Rp {formatCurrency(Math.round(costPerPortion))}</span>
                                            <span className="text-[11px] font-medium text-text-muted ml-1 tracking-tight">/ portion</span>
                                        </div>
                                    }
                                    rightElement={
                                        selectionMode ? (
                                            <div className="flex-shrink-0 text-primary self-center ml-2">
                                                <Icon
                                                    name={selectedIds.includes(rec.id) ? "check_circle" : "radio_button_unchecked"}
                                                    className={cn(
                                                        selectedIds.includes(rec.id) ? "text-primary" : "text-gray-500",
                                                        "transition-colors"
                                                    )}
                                                />
                                            </div>
                                        ) : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            {selectionMode && (
                <ActionFooter
                    className="bottom-[88px]"
                    summary={{
                        label: "Selected Recipes",
                        value: `${selectedIds.length} Items`
                    }}
                    primaryAction={{
                        label: 'Delete',
                        onClick: () => setIsDeleteDialogOpen(true),
                        isDisabled: selectedIds.length === 0,
                        variant: 'danger'
                    }}
                />
            )}

            {!selectionMode && (
                <FAB
                    icon="add"
                    onClick={() => navigate('/recipes/new')}
                />
            )}

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Recipes?"
                message={`Are you sure you want to delete ${selectedIds.length} recipes? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isDestructive
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteSelected}
            />
        </div>
    );
};
