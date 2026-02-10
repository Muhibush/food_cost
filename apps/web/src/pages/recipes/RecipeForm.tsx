import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipesStore } from '../../store/useRecipesStore';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { Recipe, RecipeIngredient } from '../../types';
import { v4 as uuidv4 } from 'uuid';

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
        manualCost: undefined
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <div className="p-6 pb-24 flex flex-col min-h-screen">
            <header className="flex items-center gap-4 mb-6">
                <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="-ml-2">
                    <Icon name="arrow_back" />
                </Button>
                <h1 className="text-xl font-extrabold">{id ? 'Edit Recipe' : 'New Recipe'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                <Input
                    label="Recipe Name"
                    name="name"
                    placeholder="e.g. Signature Burger"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Yield (Portions)"
                    name="yield"
                    type="number"
                    min="1"
                    value={formData.yield}
                    onChange={handleChange}
                    required
                />

                <section>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wide ml-1">Ingredients</label>
                        <Button type="button" size="sm" variant="ghost" onClick={handleAddIngredient} className="text-primary">
                            <Icon name="add" className="mr-1" /> Add Item
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {formData.ingredients.map((item, index) => (
                            <Card key={index} className="p-3 bg-surface-dark/50 border-white/5 relative">
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-7">
                                        <select
                                            className="block w-full px-3 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                            value={item.ingredientId}
                                            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Ingredient</option>
                                            {ingredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            className="block w-full px-3 py-2 bg-background-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                            value={item.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                            required
                                            min="0"
                                            step="any"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-danger" onClick={() => handleRemoveIngredient(index)}>
                                            <Icon name="close" size="sm" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {formData.ingredients.length === 0 && (
                            <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-xl text-text-muted text-sm">
                                <p>No ingredients added yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-auto pt-6">
                    <Button type="submit" className="w-full py-4 text-base">
                        {id ? 'Update Recipe' : 'Save Recipe'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
