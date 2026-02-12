import { v4 as uuidv4 } from 'uuid';
import { subDays, formatISO } from 'date-fns';
import { Ingredient, Recipe, Order, UnitType } from '../types';

export const generateDummyData = () => {
    // 1. Ingredients
    const ingredientTemplates: { name: string; unit: UnitType; price: number }[] = [
        { name: 'Wagyu Beef Patty', unit: 'pcs', price: 45000 },
        { name: 'Brioche Bun', unit: 'pcs', price: 8000 },
        { name: 'Cheddar Cheese Slice', unit: 'pcs', price: 3000 },
        { name: 'Iceberg Lettuce', unit: 'gr', price: 50 },
        { name: 'Vine Tomato', unit: 'gr', price: 40 },
        { name: 'Red Onion', unit: 'gr', price: 30 },
        { name: 'Mayonnaise', unit: 'gr', price: 120 },
        { name: 'Truffle Oil', unit: 'ml', price: 5000 },
        { name: 'Spaghetti Pasta', unit: 'gr', price: 25 },
        { name: 'Guanciale (Pork Cheek)', unit: 'gr', price: 650 },
        { name: 'Pecorino Romano', unit: 'gr', price: 450 },
        { name: 'Organic Egg', unit: 'pcs', price: 4000 },
        { name: 'Black Pepper', unit: 'gr', price: 300 },
        { name: 'Chicken Breast', unit: 'gr', price: 85 },
        { name: 'Romaine Lettuce', unit: 'gr', price: 60 },
        { name: 'Parmesan Cheese', unit: 'gr', price: 400 },
        { name: 'Croutons', unit: 'gr', price: 150 },
        { name: 'Caesar Dressing', unit: 'ml', price: 180 },
        { name: 'Salmon Fillet', unit: 'gr', price: 350 },
        { name: 'Asparagus', unit: 'gr', price: 120 },
        { name: 'Lemon', unit: 'pcs', price: 5000 },
        { name: 'Butter', unit: 'gr', price: 200 },
        { name: 'Garlic', unit: 'gr', price: 80 },
        { name: 'Fresh Basil', unit: 'gr', price: 150 },
        { name: 'Olive Oil', unit: 'ml', price: 250 },
    ];

    const ingredients: Ingredient[] = ingredientTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    const getIngId = (name: string) => ingredients.find(i => i.name === name)?.id || '';

    // 2. Recipes
    const recipeTemplates: Omit<Recipe, 'id'>[] = [
        {
            name: 'Classic Truffle Burger',
            description: 'Premium wagyu beef with truffle mayo and melted cheddar.',
            yield: 1,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
            ingredients: [
                { ingredientId: getIngId('Wagyu Beef Patty'), quantity: 1 },
                { ingredientId: getIngId('Brioche Bun'), quantity: 1 },
                { ingredientId: getIngId('Cheddar Cheese Slice'), quantity: 1 },
                { ingredientId: getIngId('Iceberg Lettuce'), quantity: 20 },
                { ingredientId: getIngId('Red Onion'), quantity: 15 },
                { ingredientId: getIngId('Mayonnaise'), quantity: 25 },
                { ingredientId: getIngId('Truffle Oil'), quantity: 5 },
            ]
        },
        {
            name: 'Authentic Carbonara',
            description: 'Traditional Roman carbonara with guanciale and pecorino.',
            yield: 2,
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
            ingredients: [
                { ingredientId: getIngId('Spaghetti Pasta'), quantity: 240 },
                { ingredientId: getIngId('Guanciale (Pork Cheek)'), quantity: 100 },
                { ingredientId: getIngId('Pecorino Romano'), quantity: 60 },
                { ingredientId: getIngId('Organic Egg'), quantity: 3 },
                { ingredientId: getIngId('Black Pepper'), quantity: 5 },
            ]
        },
        {
            name: 'Grilled Salmon with Asparagus',
            description: 'Pan-seared salmon with buttered asparagus and lemon.',
            yield: 1,
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
            ingredients: [
                { ingredientId: getIngId('Salmon Fillet'), quantity: 180 },
                { ingredientId: getIngId('Asparagus'), quantity: 120 },
                { ingredientId: getIngId('Lemon'), quantity: 0.5 },
                { ingredientId: getIngId('Butter'), quantity: 30 },
                { ingredientId: getIngId('Garlic'), quantity: 10 },
            ]
        },
        {
            name: 'Chicken Caesar Salad',
            description: 'Classic Caesar with grilled chicken and parmesan shavings.',
            yield: 1,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800',
            ingredients: [
                { ingredientId: getIngId('Chicken Breast'), quantity: 150 },
                { ingredientId: getIngId('Romaine Lettuce'), quantity: 200 },
                { ingredientId: getIngId('Parmesan Cheese'), quantity: 30 },
                { ingredientId: getIngId('Croutons'), quantity: 40 },
                { ingredientId: getIngId('Caesar Dressing'), quantity: 50 },
            ]
        }
    ];

    const recipes: Recipe[] = recipeTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    // 3. Orders
    const orderNames = [
        'Dinner Rush prep', 'Weekend Lunch batch', 'Corporate Catering',
        'Staff Meal Monday', 'Special Event: Wedding', 'Tuesday Prep',
        'Standard Restock', 'Gala Dinner Order', 'Custom Brunch Set'
    ];

    const orders: Order[] = orderNames.map((name, index) => {
        const date = subDays(new Date(), index * 2);
        const orderRecipes = recipes.filter(() => Math.random() > 0.4);
        const items = orderRecipes.map(r => ({
            recipeId: r.id,
            quantity: Math.floor(Math.random() * 20) + 5 // 5-25 portions
        }));

        // Calculate total cost (rough estimate for dummy data)
        const totalCost = items.reduce((sum, item) => {
            const recipe = recipes.find(r => r.id === item.recipeId);
            if (!recipe) return sum;
            const recipeBaseCost = recipe.ingredients.reduce((rs, ri) => {
                const ing = ingredients.find(i => i.id === ri.ingredientId);
                return rs + ((ing?.price || 0) * ri.quantity);
            }, 0);
            const costPerPortion = recipeBaseCost / (recipe.yield || 1);
            return sum + (costPerPortion * item.quantity);
        }, 0);

        return {
            id: uuidv4(),
            name,
            date: formatISO(date),
            items,
            status: index < 2 ? 'pending' : 'completed',
            totalCost
        };
    });

    return { ingredients, recipes, orders };
};
