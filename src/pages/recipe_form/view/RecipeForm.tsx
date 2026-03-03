import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useRecipesStore } from '../../recipe_list/store/useRecipesStore';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { Recipe, RecipeIngredient, Ingredient } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../../../utils/format';
import { IngredientBottomSheet } from '../../../components/ui/IngredientBottomSheet';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { Icon } from '../../../components/ui/Icon';
import { ImageUpload } from '../../../components/ui/ImageUpload';
import { getRecipeIconConfig } from '../../../utils/recipeIcons';
import { getIngredientIconConfig } from '../../../utils/ingredientIcons';
import { cn } from '../../../utils/cn';
import { SummaryCard } from '../../../components/ui/SummaryCard';
import { QuantitySelector } from '../../../components/ui/QuantitySelector';
import { Textarea } from '../../../components/ui/Textarea';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Badge } from '../../../components/ui/Badge';


export const RecipeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addRecipe, updateRecipe, getRecipe } = useRecipesStore();
    const { ingredients } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
        name: '',
        description: '',
        note: '',
        yield: 1,
        ingredients: [],
        manualCost: undefined,
        image: undefined
    });
    const [originalData, setOriginalData] = useState<Omit<Recipe, 'id'> | null>(null);

    const isDirty = useMemo(() => {
        if (!originalData) {
            const isDefault = formData.name === '' &&
                formData.yield === 1 &&
                formData.ingredients.length === 0 &&
                !formData.note;
            return !isDefault;
        }
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    const isSavingRef = React.useRef(false);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            !isSavingRef.current &&
            isDirty &&
            currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [activeIngredientIndex, setActiveIngredientIndex] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            const existing = getRecipe(id);
            if (existing) {
                setFormData(existing);
                setOriginalData(JSON.parse(JSON.stringify(existing)));
            }
        }
    }, [id, getRecipe]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'yield' || name === 'manualCost' ? Number(value) : value
        }));
    };

    const handleAddIngredient = () => {
        const newIndex = formData.ingredients.length;
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { ingredientId: '', quantity: 0 }]
        }));

        openIngredientPicker(newIndex);

        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    };

    const handleRemoveIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: any) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: field === 'quantity' ? Number(value) : value
        };
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const openIngredientPicker = (index: number) => {
        setActiveIngredientIndex(index);
        setIsBottomSheetOpen(true);
    };

    const handleSelectIngredient = (ingredient: Ingredient) => {
        if (activeIngredientIndex !== null) {
            handleIngredientChange(activeIngredientIndex, 'ingredientId', ingredient.id);
        }
        setIsBottomSheetOpen(false);
    };

    const handleSubmit = () => {
        if (!formData.name || formData.yield <= 0) {
            alert('Please fill in basic information correctly.');
            return;
        }

        const cleanData = {
            ...formData,
            ingredients: formData.ingredients.filter(i => i.ingredientId && i.quantity > 0)
        };

        isSavingRef.current = true;

        if (id) {
            updateRecipe(id, cleanData);
        } else {
            addRecipe({ ...cleanData, id: uuidv4() });
        }
        navigate('/recipes');
    };

    const ingredientCosts = useMemo(() => {
        return formData.ingredients.map(item => {
            const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
            if (!ingredient) return 0;
            return ingredient.price * item.quantity;
        });
    }, [formData.ingredients, ingredients]);

    const totalCost = useMemo(() => {
        return ingredientCosts.reduce((sum, cost) => sum + cost, 0);
    }, [ingredientCosts]);

    const costPerPortion = totalCost / (formData.yield || 1);

    const isFormValid =
        formData.name.trim() !== '' &&
        formData.yield >= 1 &&
        formData.ingredients.length > 0 &&
        formData.ingredients.every(i => i.ingredientId && i.quantity > 0);

    const iconConfig = useMemo(() => getRecipeIconConfig(formData.name), [formData.name]);

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <Header
                title={id ? 'Edit Recipe' : 'Create Recipe'}
                showBackButton
                rightElement={isDirty && (
                    <Badge
                        variant="warning"
                        rounded="full"
                        className="animate-pulse tracking-widest"
                    >
                        Unsaved
                    </Badge>
                )}
                bottomElement={
                    <SummaryCard
                        label="Cost / Portion"
                        value={`Rp ${formatCurrency(Math.round(costPerPortion))}`}
                        badge="Estimated"
                    />
                }
            />

            <main className="flex-1 flex flex-col px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
                <section className="flex flex-col gap-6">
                    <ImageUpload
                        label="Photo"
                        optional
                        value={formData.image}
                        onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
                        previewClassName="w-48 mx-auto"
                        placeholder={(
                            <div className={cn(
                                "w-full h-full flex flex-col items-center justify-center transition-colors px-4 bg-gray-100 dark:bg-gray-800",
                                iconConfig.bgClass,
                                iconConfig.colorClass
                            )}>
                                <Icon name={iconConfig.icon} className={cn("!text-[64px]", iconConfig.colorClass)} />
                                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Add Photo</p>
                            </div>
                        )}
                    />

                    <div className="space-y-6">
                        <Input
                            label="Recipe Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Grandma's Beef Stew"
                            icon="edit_note"
                            required
                            autoComplete="off"
                            className="ring-1 ring-gray-200 dark:ring-gray-700 border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-none"
                        />

                        <div className="relative">
                            <Input
                                label="Base Yield"
                                name="yield"
                                value={formData.yield || ''}
                                onChange={handleChange}
                                onBlur={() => {
                                    if (formData.yield < 1) {
                                        setFormData(prev => ({ ...prev, yield: 1 }));
                                    }
                                }}
                                placeholder="1"
                                icon="restaurant_menu"
                                type="number"
                                min="1"
                                required
                            />
                            <div className="absolute right-4 bottom-3.5 pointer-events-none">
                                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">portions</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1 flex items-center justify-between">
                                Note
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest italic">(Optional)</span>
                            </label>
                            <Textarea
                                name="note"
                                value={formData.note || ''}
                                onChange={handleChange}
                                placeholder="Add special instructions or notes here..."
                                rows={3}
                                className="ring-1 ring-gray-200 dark:ring-gray-700 border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-none"
                            />
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full my-8"></div>

                <section className="flex flex-col gap-5">
                    <SectionHeader
                        title="Ingredients"
                        rightElement={<span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{formData.ingredients.length} Items</span>}
                    />

                    <div className="flex flex-col gap-3">
                        {formData.ingredients.map((item, index) => {
                            const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
                            return (
                                <div key={index} className="bg-surface-dark p-4 rounded-2xl border border-white/5 space-y-4 relative transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-1.5 pr-8">
                                            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Select Ingredient</label>
                                            <div className="flex gap-3">
                                                {(() => {
                                                    const iconConfig = getIngredientIconConfig(ingredient?.name || '');
                                                    return (
                                                        <div className={cn(
                                                            "h-10 w-10 mt-0.5 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all",
                                                            !ingredient?.image && iconConfig.bgClass
                                                        )}>
                                                            {ingredient?.image ? (
                                                                <img src={ingredient.image} alt={ingredient.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Icon
                                                                    name={ingredient ? iconConfig.icon : 'help'}
                                                                    size="sm"
                                                                    className={ingredient ? iconConfig.colorClass : "text-gray-500 opacity-30"}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                                <div
                                                    onClick={() => openIngredientPicker(index)}
                                                    className="flex-1 px-4 py-2.5 bg-background-dark border border-white/5 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium cursor-pointer flex items-center justify-between"
                                                >
                                                    <span className={item.ingredientId ? "text-white" : "text-gray-500"}>
                                                        {ingredient?.name || 'Choose ingredient...'}
                                                    </span>
                                                    <Icon name="expand_more" className="text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Icon name="delete" size="md" />
                                        </button>
                                    </div>

                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 flex items-center gap-3">
                                            <QuantitySelector
                                                value={item.quantity}
                                                onChange={(val) => handleIngredientChange(index, 'quantity', val)}
                                                onIncrement={() => handleIngredientChange(index, 'quantity', (item.quantity || 0) + 1)}
                                                onDecrement={() => handleIngredientChange(index, 'quantity', Math.max(0, (item.quantity - 1)))}
                                                className="bg-background-dark border-white/10"
                                            />
                                            {ingredient && (
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{ingredient.unit}</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Cost</p>
                                            <div className="text-sm font-extrabold text-primary leading-none">
                                                Rp {formatCurrency(Math.round(ingredientCosts[index]))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="w-full py-4 border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/10 transition-all active:scale-[0.98] mt-2"
                        >
                            <Icon name="add_circle" className="text-xl" />
                            Add Ingredient
                        </button>
                    </div>
                </section>
            </main>

            <ActionFooter
                className="bottom-0"
                primaryAction={{
                    label: id ? 'Update Recipe' : 'Save Recipe',
                    onClick: handleSubmit,
                    isDisabled: !isFormValid
                }}
            />

            <IngredientBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onSelect={handleSelectIngredient}
                selectedId={activeIngredientIndex !== null ? formData.ingredients[activeIngredientIndex]?.ingredientId : undefined}
            />

            <AlertDialog
                isOpen={blocker.state === 'blocked'}
                title={!id ? "Discard New Recipe?" : "Discard Changes?"}
                message={!id
                    ? "This recipe hasn't been saved yet. If you leave now, all details will be lost."
                    : "You have unsaved modifications to this recipe. If you leave now, these changes will be lost."
                }
                confirmLabel="Discard"
                cancelLabel="Keep Editing"
                isDestructive
                onCancel={() => blocker.state === 'blocked' && blocker.reset()}
                onConfirm={() => {
                    if (blocker.state === 'blocked') {
                        blocker.proceed();
                    }
                }}
            />
        </div>
    );
};
