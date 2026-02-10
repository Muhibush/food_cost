import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { Ingredient, UnitType } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const IngredientForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addIngredient, updateIngredient, getIngredient } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
        name: '',
        unit: 'kg',
        price: 0,
        stock: 0,
        minStock: 0,
    });

    useEffect(() => {
        if (id) {
            const existing = getIngredient(id);
            if (existing) {
                setFormData(existing);
            }
        }
    }, [id, getIngredient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            updateIngredient(id, formData);
        } else {
            addIngredient({ ...formData, id: uuidv4() });
        }
        navigate('/ingredients');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'minStock' ? Number(value) : value
        }));
    };

    return (
        <div className="p-6 pb-24 flex flex-col min-h-screen">
            <header className="flex items-center gap-4 mb-6">
                <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="-ml-2">
                    <Icon name="arrow_back" />
                </Button>
                <h1 className="text-xl font-extrabold">{id ? 'Edit Ingredient' : 'New Ingredient'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                <Input
                    label="Name"
                    name="name"
                    placeholder="e.g. Brown Sugar"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wide ml-1">Unit</label>
                    <div className="relative">
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="block w-full px-4 py-3.5 bg-surface-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none shadow-sm"
                        >
                            <option value="kg">Kilogram (kg)</option>
                            <option value="gr">Gram (gr)</option>
                            <option value="ltr">Liter (l)</option>
                            <option value="ml">Milliliter (ml)</option>
                            <option value="pcs">Piece (pcs)</option>
                            <option value="pack">Pack</option>
                            <option value="can">Can</option>
                            <option value="btl">Bottle</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-text-muted">
                            <Icon name="expand_more" />
                        </div>
                    </div>
                </div>

                <Input
                    label="Price per Unit (Rp)"
                    name="price"
                    type="number"
                    icon="payments"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Current Stock"
                        name="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        min={0}
                    />
                    <Input
                        label="Min Stock Alert"
                        name="minStock"
                        type="number"
                        placeholder="0"
                        value={formData.minStock}
                        onChange={handleChange}
                        min={0}
                    />
                </div>

                <div className="mt-auto pt-6">
                    <Button type="submit" className="w-full py-4 text-base">
                        {id ? 'Update Ingredient' : 'Save Ingredient'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
