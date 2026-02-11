import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIngredientsStore } from '../../../store/useIngredientsStore';
import { Ingredient } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';

export const IngredientForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addIngredient, updateIngredient, getIngredient, removeIngredient } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
        name: '',
        unit: 'kg',
        price: 0,
    });

    useEffect(() => {
        if (id) {
            const existing = getIngredient(id);
            if (existing) {
                setFormData(existing);
            }
        }
    }, [id, getIngredient]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.unit || formData.price <= 0) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        if (id) {
            updateIngredient(id, formData);
        } else {
            addIngredient({ ...formData, id: uuidv4() });
        }
        navigate('/ingredients');
    };

    const handleDelete = () => {
        if (id && confirm('Are you sure you want to delete this ingredient?')) {
            removeIngredient(id);
            navigate('/ingredients');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    return (
        <div className="bg-background-dark font-display text-white min-h-screen flex flex-col pb-safe -mx-5 -mt-4">
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-5 border-b border-white/5 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 w-10 flex items-center justify-center -ml-2 rounded-full text-white hover:bg-white/10 transition-all active:scale-[0.95]"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
                </button>
                <h1 className="text-2xl font-extrabold text-white absolute left-1/2 -translate-x-1/2 tracking-tight whitespace-nowrap">
                    {id ? 'Edit Ingredient' : 'Add Ingredient'}
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
                {/* Photo Upload Placeholder */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group cursor-pointer">
                        <div className="h-32 w-32 rounded-full bg-[#1C1F2E] border-2 border-dashed border-white/20 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-all overflow-hidden">
                            <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                        </div>
                        <div className="absolute bottom-0 right-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-background-dark shadow-sm">
                            <span className="material-symbols-outlined text-lg">edit</span>
                        </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-400">Upload Photo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                    {/* Name */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-200">Ingredient Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1C1F2E] border border-transparent focus:border-primary/50 text-white rounded-2xl px-5 py-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg placeholder-gray-500 shadow-sm"
                            placeholder="e.g. Premium Brown Sugar"
                            type="text"
                            required
                        />
                    </div>

                    {/* Unit Type */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-200">Unit Type</label>
                        <div className="relative">
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full appearance-none bg-[#1C1F2E] border border-transparent focus:border-primary/50 text-white rounded-2xl px-5 py-5 pr-12 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg shadow-sm"
                                required
                            >
                                <option disabled value="">Select a unit</option>
                                <option value="kg">Kilogram (KG)</option>
                                <option value="gr">Gram (GR)</option>
                                <option value="ltr">Liter (L)</option>
                                <option value="ml">Milliliter (ML)</option>
                                <option value="pcs">Piece (PCS)</option>
                                <option value="pack">Pack</option>
                                <option value="can">Can</option>
                                <option value="btl">Bottle</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-200">Price per Unit</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white font-semibold text-base">
                                Rp
                            </div>
                            <input
                                name="price"
                                value={formData.price || ''}
                                onChange={handleChange}
                                className="w-full bg-[#1C1F2E] border border-transparent focus:border-primary/50 text-white rounded-2xl pl-14 pr-5 py-5 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg font-medium shadow-sm placeholder-gray-500"
                                inputMode="numeric"
                                placeholder="0"
                                type="number"
                                min="0"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 px-1">Enter the current market price for one unit.</p>
                    </div>


                </form>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-background-dark border-t border-white/5 pb-safe z-30">
                <div className="px-6 py-4 flex items-center justify-between gap-4 max-w-lg mx-auto">
                    {id && (
                        <button
                            onClick={handleDelete}
                            className="h-14 flex-1 bg-transparent border border-white/20 text-white font-bold text-base rounded-2xl transition-colors flex items-center justify-center hover:bg-white/5 hover:border-white/30 active:scale-95"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={() => handleSubmit()}
                        className={clsx(
                            "h-14 bg-primary hover:bg-primary-dark text-white font-bold text-base rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center justify-center",
                            id ? "flex-[2]" : "w-full"
                        )}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
