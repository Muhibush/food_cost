import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipesStore } from '../../../store/useRecipesStore';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Recipe, RecipeIngredient, Ingredient } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../../../utils/format';
import { IngredientBottomSheet } from '../../../components/ui/IngredientBottomSheet';

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

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

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

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <header className="sticky top-0 z-50 bg-background-dark px-6 pt-12 pb-5 border-b border-white/5 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </button>
                <h1 className="text-2xl font-extrabold text-white absolute left-1/2 -translate-x-1/2 tracking-tight whitespace-nowrap">
                    {id ? 'Edit Recipe' : 'Create Recipe'}
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 pb-48 max-w-lg mx-auto w-full">
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Basic Information</h2>

                    {/* Photo Upload */}
                    <div className="w-full h-48 rounded-3xl border-2 border-dashed border-white/10 bg-[#1C1F2E] flex flex-col items-center justify-center gap-3 text-gray-400 cursor-pointer hover:bg-white/5 transition-all relative group overflow-hidden">
                        {formData.image ? (
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${formData.image})` }} />
                        ) : (
                            <>
                                <div className="h-12 w-12 rounded-full bg-background-dark flex items-center justify-center mb-1">
                                    <span className="material-symbols-outlined text-2xl text-primary">add_photo_alternate</span>
                                </div>
                                <span className="text-sm font-semibold">Upload Recipe Photo</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                            <span className="material-symbols-outlined text-white text-3xl">cloud_upload</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Recipe Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-5 py-4 bg-[#1C1F2E] border border-transparent focus:border-primary/50 text-white rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium shadow-sm placeholder-gray-600"
                                placeholder="e.g. Grandma's Beef Stew"
                                type="text"
                                required
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Base Yield</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-primary text-xl">restaurant_menu</span>
                                </div>
                                <input
                                    name="yield"
                                    value={formData.yield || ''}
                                    onChange={handleChange}
                                    className="block w-full pl-14 pr-24 py-4 bg-[#1C1F2E] border border-transparent focus:border-primary/50 text-white rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium shadow-sm"
                                    placeholder="1"
                                    type="number"
                                    min="1"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">portions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full my-8"></div>

                <section className="flex flex-col gap-5">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ingredients</h2>
                        <span className="text-xs text-gray-500 font-medium">{formData.ingredients.length} items</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {formData.ingredients.map((item, index) => (
                            <div key={index} className="bg-[#1C1F2E] p-5 rounded-3xl border border-white/5 space-y-5 relative active:scale-[0.99] transition-transform">
                                <button
                                    onClick={() => handleRemoveIngredient(index)}
                                    className="absolute -top-2 -right-2 bg-[#1C1F2E] border border-white/10 h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-colors z-10 shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-lg font-medium">close</span>
                                </button>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-bold text-gray-400 capitalize tracking-widest ml-1">Select Ingredient</label>
                                    <div
                                        onClick={() => openIngredientPicker(index)}
                                        className="block w-full px-5 py-4 bg-[#2A2D3A] border border-transparent focus:border-primary/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={item.ingredientId ? "text-white" : "text-gray-500"}>
                                            {ingredients.find(ing => ing.id === item.ingredientId)?.name || 'Choose an ingredient...'}
                                        </span>
                                        <span className="material-symbols-outlined text-gray-500 text-xl">expand_more</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-end">
                                    <div className="w-1/3 space-y-2.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Quantity</label>
                                        <input
                                            type="number"
                                            className="block w-full px-4 py-4 bg-[#2A2D3A] border border-transparent focus:border-primary/50 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-bold text-center"
                                            value={item.quantity || ''}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                            placeholder="0"
                                            required
                                            min="0"
                                            step="any"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right block mr-1">Cost Estimation</label>
                                        <div className="w-full px-5 py-4 text-right text-lg font-extrabold text-white bg-[#2A2D3A]/50 rounded-2xl border border-white/5">
                                            Rp {formatCurrency(Math.round(ingredientCosts[index]))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="w-full py-5 border border-white/10 bg-[#1C1F2E] rounded-2xl flex items-center justify-center gap-3 text-primary font-bold hover:bg-white/5 transition-all active:scale-[0.98] mt-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-2xl">add_circle</span>
                            Add Ingredient
                        </button>
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#1C1F2E] border-t border-white/10 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
                <div className="px-6 py-5 flex flex-col gap-5 max-w-lg mx-auto">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Total Cost / Portion</span>
                            <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                                Rp {formatCurrency(Math.round(costPerPortion))}
                                <span className="text-xs font-medium text-gray-500 lowercase tracking-normal">est.</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSubmit()}
                        className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-4.5 px-6 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.95]"
                    >
                        Save Recipe
                    </button>
                </div>
            </div>

            <IngredientBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onSelect={handleSelectIngredient}
            />
        </div>
    );
};
