import { v4 as uuidv4 } from 'uuid';
import { subDays, formatISO } from 'date-fns';
import { Ingredient, Recipe, Order, UnitType } from '../types';

export const generateDummyData = () => {
    // 1. Ingredients
    const ingredientTemplates: { name: string; unit: UnitType; price: number }[] = [
        // Indonesian Spices & Aromatics
        { name: 'Bawang Merah (Shallots)', unit: 'gr', price: 45 },
        { name: 'Bawang Putih (Garlic)', unit: 'gr', price: 35 },
        { name: 'Cabai Rawit (Bird Eye Chili)', unit: 'gr', price: 60 },
        { name: 'Cabai Merah Keriting', unit: 'gr', price: 50 },
        { name: 'Kunyit (Turmeric)', unit: 'gr', price: 30 },
        { name: 'Jahe (Ginger)', unit: 'gr', price: 30 },
        { name: 'Lengkuas (Galangal)', unit: 'gr', price: 25 },
        { name: 'Sereh (Lemongrass)', unit: 'pcs', price: 1000 },
        { name: 'Daun Salam', unit: 'pcs', price: 200 },
        { name: 'Daun Jeruk', unit: 'pcs', price: 200 },

        // Proteins
        { name: 'Daging Sapi (Beef Chunk)', unit: 'gr', price: 140 },
        { name: 'Ayam Fillet (Chicken)', unit: 'gr', price: 75 },
        { name: 'Telur Ayam (Egg)', unit: 'pcs', price: 2500 },
        { name: 'Udang Kupas (Peeled Shrimp)', unit: 'gr', price: 120 },

        // Condiments & Pantry
        { name: 'Kecap Manis (Sweet Soy)', unit: 'ml', price: 40 },
        { name: 'Santan (Coconut Milk)', unit: 'ml', price: 30 },
        { name: 'Minyak Goreng', unit: 'ml', price: 20 },
        { name: 'Gula Merah', unit: 'gr', price: 30 },
        { name: 'Garam', unit: 'gr', price: 15 },
        { name: 'Terasi (Shrimp Paste)', unit: 'gr', price: 150 },
        { name: 'Beras Basmati', unit: 'gr', price: 35 },

        // Western (Keeping some for variety)
        { name: 'Wagyu Beef Patty', unit: 'pcs', price: 45000 },
        { name: 'Brioche Bun', unit: 'pcs', price: 8000 },
        { name: 'Cheddar Cheese Slice', unit: 'pcs', price: 3000 },
        { name: 'Mayonnaise', unit: 'gr', price: 120 },
        { name: 'Truffle Oil', unit: 'ml', price: 5000 },
    ];

    const ingredients: Ingredient[] = ingredientTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    const getIngId = (name: string) => ingredients.find(i => i.name === name)?.id || '';

    // 2. Recipes
    const recipeTemplates: Omit<Recipe, 'id'>[] = [
        {
            name: 'Nasi Goreng Spesial',
            description: 'Indonesian fried rice with shrimp, egg, and sweet soy sauce.',
            yield: 2,
            ingredients: [
                { ingredientId: getIngId('Beras Basmati'), quantity: 300 },
                { ingredientId: getIngId('Udang Kupas (Peeled Shrimp)'), quantity: 100 },
                { ingredientId: getIngId('Telur Ayam (Egg)'), quantity: 2 },
                { ingredientId: getIngId('Kecap Manis (Sweet Soy)'), quantity: 40 },
                { ingredientId: getIngId('Bawang Merah (Shallots)'), quantity: 40 },
                { ingredientId: getIngId('Bawang Putih (Garlic)'), quantity: 20 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 30 },
                { ingredientId: getIngId('Cabai Merah Keriting'), quantity: 15 },
            ]
        },
        {
            name: 'Beef Rendang Padang',
            description: 'Slow-cooked beef in coconut milk and rich spice paste.',
            yield: 4,
            ingredients: [
                { ingredientId: getIngId('Daging Sapi (Beef Chunk)'), quantity: 500 },
                { ingredientId: getIngId('Santan (Coconut Milk)'), quantity: 400 },
                { ingredientId: getIngId('Bawang Merah (Shallots)'), quantity: 60 },
                { ingredientId: getIngId('Bawang Putih (Garlic)'), quantity: 30 },
                { ingredientId: getIngId('Kunyit (Turmeric)'), quantity: 20 },
                { ingredientId: getIngId('Lengkuas (Galangal)'), quantity: 30 },
                { ingredientId: getIngId('Sereh (Lemongrass)'), quantity: 2 },
                { ingredientId: getIngId('Daun Salam'), quantity: 3 },
                { ingredientId: getIngId('Gula Merah'), quantity: 40 },
            ]
        },
        {
            name: 'Sate Ayam Madura',
            description: 'Grilled chicken skewers with peanut sauce and sweet soy.',
            yield: 2,
            ingredients: [
                { ingredientId: getIngId('Ayam Fillet (Chicken)'), quantity: 300 },
                { ingredientId: getIngId('Kecap Manis (Sweet Soy)'), quantity: 50 },
                { ingredientId: getIngId('Bawang Putih (Garlic)'), quantity: 15 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 20 },
                { ingredientId: getIngId('Cabai Rawit (Bird Eye Chili)'), quantity: 10 },
            ]
        },
        {
            name: 'Classic Truffle Burger',
            description: 'Premium wagyu beef with truffle mayo and melted cheddar.',
            yield: 1,
            ingredients: [
                { ingredientId: getIngId('Wagyu Beef Patty'), quantity: 1 },
                { ingredientId: getIngId('Brioche Bun'), quantity: 1 },
                { ingredientId: getIngId('Cheddar Cheese Slice'), quantity: 1 },
                { ingredientId: getIngId('Mayonnaise'), quantity: 25 },
                { ingredientId: getIngId('Truffle Oil'), quantity: 5 },
            ]
        }
    ];

    const recipes: Recipe[] = recipeTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    // 3. Orders
    const orderNames = [
        'Pradesh Wedding Catering', 'Daily Lunch Batch - Mon', 'Corporate Event: Gojek',
        'Dinner Rush - Saturday', 'Staff Meal Rendang Day', 'Family Gathering: Bintaro',
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
