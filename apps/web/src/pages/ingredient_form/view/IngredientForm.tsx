import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { useIngredientsStore } from '../../ingredient_list/store/useIngredientsStore';
import { Ingredient } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { ActionFooter } from '../../../components/ui/ActionFooter';
import { AlertDialog } from '../../../components/ui/AlertDialog';
import { Badge } from '../../../components/ui/Badge';
import { Icon } from '../../../components/ui/Icon';

const UNIT_OPTIONS = [
    { value: '', label: 'Select a unit', disabled: true },
    { value: 'kg', label: 'Kilogram (KG)' },
    { value: 'gr', label: 'Gram (GR)' },
    { value: 'ltr', label: 'Liter (L)' },
    { value: 'ml', label: 'Milliliter (ML)' },
    { value: 'pcs', label: 'Piece (PCS)' },
    { value: 'pack', label: 'Pack' },
    { value: 'can', label: 'Can' },
    { value: 'btl', label: 'Bottle' }
];

export const IngredientForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addIngredient, updateIngredient, getIngredient, removeIngredient } = useIngredientsStore();

    const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
        name: '',
        unit: '',
        price: 0,
    });
    const [originalData, setOriginalData] = useState<Omit<Ingredient, 'id'> | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const isDirty = useMemo(() => {
        if (!originalData) {
            return formData.name !== '' || formData.unit !== '' || formData.price !== 0;
        }
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    const isSavingRef = useRef(false);

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

    useEffect(() => {
        if (id) {
            const existing = getIngredient(id);
            if (existing) {
                setFormData(existing);
                setOriginalData(JSON.parse(JSON.stringify(existing)));
            }
        }
    }, [id, getIngredient]);

    const isFormValid = formData.name.trim() !== '' && formData.unit !== '' && formData.price >= 0;

    const handleSubmit = () => {
        if (!isFormValid) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        isSavingRef.current = true;

        if (id) {
            updateIngredient(id, formData);
        } else {
            addIngredient({ ...formData, id: uuidv4() });
        }
        navigate('/ingredients');
    };

    const handleDelete = () => {
        if (id) {
            setIsDeleteDialogOpen(true);
        }
    };

    const confirmDelete = () => {
        if (id) {
            isSavingRef.current = true;
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
            <Header
                title={id ? 'Edit Ingredient' : 'Add Ingredient'}
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
            />

            <main className="flex-1 flex flex-col px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
                {/* Photo Upload Placeholder */}
                <div className="w-full h-48 rounded-2xl border-2 border-dashed border-white/5 bg-surface-dark flex flex-col items-center justify-center gap-3 text-gray-500 cursor-pointer hover:bg-white/5 transition-all relative group overflow-hidden mb-8">
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-background-dark flex items-center justify-center mb-1">
                            <Icon name="add_photo_alternate" className="text-primary" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                        <Icon name="cloud_upload" className="text-white text-3xl" />
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    <Input
                        label="Ingredient Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Premium Brown Sugar"
                        icon="inventory_2"
                        required
                        autoComplete="off"
                        className="bg-[#1C1F2E] ring-1 ring-gray-200 dark:ring-gray-700 border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-none"
                    />

                    <Select
                        label="Unit Type"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        options={UNIT_OPTIONS}
                        icon="scale"
                        required
                        className="bg-[#1C1F2E] ring-1 ring-gray-200 dark:ring-gray-700 border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-none"
                    />

                    <div className="relative">
                        <Input
                            label="Price per Unit"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleChange}
                            type="number"
                            min="0"
                            placeholder="0"
                            icon="payments"
                            required
                            className="bg-[#1C1F2E] ring-1 ring-gray-200 dark:ring-gray-700 border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-none"
                        />
                        <div className="absolute right-4 bottom-3.5 pointer-events-none">
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">RP</span>
                        </div>
                    </div>

                    {id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-4 mt-8 border-2 border-dashed border-danger/40 bg-danger/5 hover:bg-danger/10 rounded-2xl flex items-center justify-center gap-2 text-danger font-bold transition-all active:scale-[0.99]"
                        >
                            <Icon name="delete" className="text-xl" />
                            Delete Ingredient
                        </button>
                    )}
                </div>
            </main>

            <ActionFooter
                className="bottom-0"
                primaryAction={{
                    label: id ? 'Update Ingredient' : 'Save Ingredient',
                    onClick: handleSubmit,
                    isDisabled: !isFormValid
                }}
            />

            <AlertDialog
                isOpen={blocker.state === 'blocked'}
                title={!id ? "Discard New Ingredient?" : "Discard Changes?"}
                message={!id
                    ? "This ingredient hasn't been saved yet. If you leave now, all details will be lost."
                    : "You have unsaved modifications to this ingredient. If you leave now, these changes will be lost."
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

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Ingredient"
                message={`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isDestructive
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};
