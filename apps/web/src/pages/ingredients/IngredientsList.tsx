import React, { useState } from 'react';
import { useIngredientsStore } from '../../store/useIngredientsStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import { Ingredient } from '../../types';

export const IngredientsList: React.FC = () => {
    const navigate = useNavigate();
    const { ingredients, removeIngredient } = useIngredientsStore();
    const [search, setSearch] = useState('');

    const filteredIngredients = ingredients.filter(ing =>
        ing.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this ingredient?')) {
            removeIngredient(id);
        }
    };

    return (
        <div className="p-6 pb-24 flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold">Inventory</h1>
                <Button size="icon" onClick={() => navigate('/ingredients/new')}>
                    <Icon name="add" />
                </Button>
            </header>

            <div className="sticky top-0 z-10 bg-background-dark py-2">
                <Input
                    placeholder="Search ingredients..."
                    icon="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-4">
                {filteredIngredients.length === 0 ? (
                    <div className="text-center text-text-muted py-10">
                        <Icon name="inventory_2" size="xl" className="opacity-20 mb-4" />
                        <p>No ingredients found.</p>
                        <Button variant="ghost" onClick={() => navigate('/ingredients/new')}>Add your first ingredient</Button>
                    </div>
                ) : (
                    filteredIngredients.map((ing) => (
                        <Card
                            key={ing.id}
                            hoverEffect
                            onClick={() => navigate(`/ingredients/${ing.id}`)}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-base">{ing.name}</h3>
                                <p className="text-xs text-text-muted mt-1">
                                    Stock: {ing.stock} {ing.unit}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="font-bold text-base">Rp {ing.price.toLocaleString()}</span>
                                    <span className="text-[10px] text-text-muted block uppercase">/{ing.unit}</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-text-muted hover:text-danger -mr-2"
                                    onClick={(e) => handleDelete(ing.id, e)}
                                >
                                    <Icon name="delete" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
