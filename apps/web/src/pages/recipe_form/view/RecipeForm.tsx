import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export const RecipeForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addRecipe, updateRecipe, getRecipe } = useRecipesStore();
    const { ingredients } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
        name: '',
        description: '',
        yield: 1,
        ingredients: [],
        manualCost: undefined,
        image: undefined
    });

    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [activeIngredientIndex, setActiveIngredientIndex] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            const existing = getRecipe(id);
            if (existing) {
                setFormData(existing);
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
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { ingredientId: '', quantity: 0 }]
        }));
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

        // validation: remove empty ingredients
        const cleanData = {
            ...formData,
            ingredients: formData.ingredients.filter(i => i.ingredientId && i.quantity > 0)
        };

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

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <Header
                title={id ? 'Edit Recipe' : 'Create Recipe'}
                showBackButton
            />

            <main className="flex-1 flex flex-col px-6 pt-8 pb-48 max-w-lg mx-auto w-full">
                <section className="flex flex-col gap-6">
                    <SectionHeader title="Basic Information" />

                    {/* Photo Upload */}
                    <div className="w-full h-48 rounded-2xl border-2 border-dashed border-white/5 bg-surface-dark flex flex-col items-center justify-center gap-3 text-gray-500 cursor-pointer hover:bg-white/5 transition-all relative group overflow-hidden">
                        {formData.image ? (
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${formData.image})` }} />
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-background-dark flex items-center justify-center mb-1">
                                    <Icon name="add_photo_alternate" className="text-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                            <Icon name="cloud_upload" className="text-white text-3xl" />
                        </div>
                    </div>

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
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full my-8"></div>

                <section className="flex flex-col gap-5">
                    <SectionHeader
                        title="Ingredients"
                        rightElement={<span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{formData.ingredients.length} Items</span>}
                    />

                    <div className="flex flex-col gap-4">
                        {formData.ingredients.map((item, index) => (
                            <div key={index} className="bg-surface-dark p-5 rounded-2xl border border-white/5 space-y-5 relative transition-all">
                                <button
                                    onClick={() => handleRemoveIngredient(index)}
                                    className="absolute -top-2 -right-2 bg-background-dark border border-white/10 h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-colors z-10 shadow-lg"
                                >
                                    <Icon name="close" className="text-lg" />
                                </button>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Select Ingredient</label>
                                    <div
                                        onClick={() => openIngredientPicker(index)}
                                        className="block w-full px-5 py-3.5 bg-background-dark border border-white/5 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={item.ingredientId ? "text-white" : "text-gray-500"}>
                                            {ingredients.find(ing => ing.id === item.ingredientId)?.name || 'Choose ingredient...'}
                                        </span>
                                        <Icon name="expand_more" className="text-gray-500" />
                                    </div>
                                </div>

                                <div className="flex gap-4 items-end">
                                    <div className="w-1/3 space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">Qty</label>
                                        <div className="flex items-center bg-[#05060B] border border-white/10 rounded-xl h-[46px] px-1 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                            <button
                                                type="button"
                                                onClick={() => handleIngredientChange(index, 'quantity', Math.max(0, (item.quantity || 0) - 1))}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary active:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity || ''}
                                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                placeholder="0"
                                                step="any"
                                                min="0"
                                                className="flex-1 min-w-0 bg-transparent border-none text-center font-bold text-white focus:ring-0 focus:outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleIngredientChange(index, 'quantity', (item.quantity || 0) + 1)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary active:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">add</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1.5 pb-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide text-right block mr-1">Estimated Cost</label>
                                        <div className="text-right text-base font-extrabold text-white px-2">
                                            Rp {formatCurrency(Math.round(ingredientCosts[index]))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                summary={{
                    label: "Cost / Portion",
                    value: `Rp ${formatCurrency(Math.round(costPerPortion))}`
                }}
            />

            <IngredientBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onSelect={handleSelectIngredient}
                selectedId={activeIngredientIndex !== null ? formData.ingredients[activeIngredientIndex]?.ingredientId : undefined}
            />
        </div>
    );
};
