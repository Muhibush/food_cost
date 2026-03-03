import { v4 as uuidv4 } from 'uuid';
import { subDays, formatISO } from 'date-fns';
import { Ingredient, Recipe, Order, UnitType } from '../types';

export const generateDummyData = () => {
    // 1. Ingredients (50+ Items)
    const ingredientTemplates: { name: string; unit: UnitType; price: number }[] = [
        // Spices & Aromatics
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
        { name: 'Ketumbar (Coriander)', unit: 'gr', price: 20 },
        { name: 'Kemiri (Candlenut)', unit: 'gr', price: 40 },
        { name: 'Merica (Pepper)', unit: 'gr', price: 30 },
        { name: 'Kayu Manis (Cinnamon)', unit: 'pcs', price: 2000 },
        { name: 'Cengkeh (Cloves)', unit: 'gr', price: 150 },

        // Proteins
        { name: 'Daging Sapi (Beef Chunk)', unit: 'gr', price: 140 },
        { name: 'Ayam Fillet (Chicken)', unit: 'gr', price: 75 },
        { name: 'Telur Ayam (Egg)', unit: 'pcs', price: 2500 },
        { name: 'Udang Kupas (Peeled Shrimp)', unit: 'gr', price: 120 },
        { name: 'Ikan Salmon', unit: 'gr', price: 350 },
        { name: 'Ikan Kakap (Snapper)', unit: 'gr', price: 110 },
        { name: 'Daging Cincang (Minced Beef)', unit: 'gr', price: 130 },
        { name: 'Wagyu Beef Patty', unit: 'pcs', price: 45000 },
        { name: 'Tahu (Tofu)', unit: 'pcs', price: 1000 },
        { name: 'Tempe', unit: 'pcs', price: 2000 },

        // Vegetables & Fruits
        { name: 'Bayam (Spinach)', unit: 'gr', price: 10 },
        { name: 'Wortel (Carrot)', unit: 'gr', price: 15 },
        { name: 'Kentang (Potato)', unit: 'gr', price: 20 },
        { name: 'Tomat (Tomato)', unit: 'gr', price: 25 },
        { name: 'Sawi Hijau', unit: 'gr', price: 12 },
        { name: 'Brokoli', unit: 'gr', price: 45 },
        { name: 'Jamur Kuping', unit: 'gr', price: 30 },
        { name: 'Pisang Kepok (Banana)', unit: 'pcs', price: 3000 },
        { name: 'Alpukat (Avocado)', unit: 'gr', price: 35 },
        { name: 'Mangga (Mango)', unit: 'gr', price: 25 },

        // Pantry & Condiments
        { name: 'Kecap Manis (Sweet Soy)', unit: 'ml', price: 40 },
        { name: 'Santan (Coconut Milk)', unit: 'ml', price: 30 },
        { name: 'Minyak Goreng', unit: 'ml', price: 20 },
        { name: 'Gula Merah', unit: 'gr', price: 30 },
        { name: 'Garam', unit: 'gr', price: 15 },
        { name: 'Terasi (Shrimp Paste)', unit: 'gr', price: 150 },
        { name: 'Beras Basmati', unit: 'gr', price: 35 },
        { name: 'Tepung Terigu (Flour)', unit: 'gr', price: 15 },
        { name: 'Tepung Tapioka', unit: 'gr', price: 18 },
        { name: 'Saus Tiram (Oyster Sauce)', unit: 'ml', price: 60 },
        { name: 'Minyak Wijen (Sesame Oil)', unit: 'ml', price: 120 },
        { name: 'Mayonnaise', unit: 'gr', price: 120 },
        { name: 'Truffle Oil', unit: 'ml', price: 5000 },
        { name: 'Gula Pasir', unit: 'gr', price: 18 },
        { name: 'Kopi Bubuk (Coffee)', unit: 'gr', price: 80 },

        // Bakery & Dairy
        { name: 'Brioche Bun', unit: 'pcs', price: 8000 },
        { name: 'Cheddar Cheese Slice', unit: 'pcs', price: 3000 },
        { name: 'Susu Cair (Milk)', unit: 'ml', price: 25 },
        { name: 'Mentega (Butter)', unit: 'gr', price: 180 },
        { name: 'Keju Mozzarella', unit: 'gr', price: 150 },
        { name: 'Roti Tawar', unit: 'pack', price: 15000 },

        // Takjil & Dessert Items
        { name: 'Kolang Kaling', unit: 'gr', price: 25 },
        { name: 'Daun Pandan', unit: 'pcs', price: 500 },
        { name: 'Gula Aren (Palm Sugar)', unit: 'gr', price: 40 },
        { name: 'Kurma (Dates)', unit: 'gr', price: 60 },
        { name: 'Sirup Cocopandan', unit: 'ml', price: 30 },
        { name: 'Biji Selasih', unit: 'gr', price: 50 },
        { name: 'Susu Kental Manis', unit: 'ml', price: 45 },
    ];

    const ingredients: Ingredient[] = ingredientTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    const getIngId = (name: string) => ingredients.find(i => i.name === name)?.id || '';

    // 2. Recipes (15+ Items)
    const recipeTemplates: Omit<Recipe, 'id'>[] = [
        // Indonesian Main Courses
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
            name: 'Ayam Goreng Lengkuas',
            description: 'Traditional fried chicken with crispy galangal flakes.',
            yield: 4,
            ingredients: [
                { ingredientId: getIngId('Ayam Fillet (Chicken)'), quantity: 1000 },
                { ingredientId: getIngId('Lengkuas (Galangal)'), quantity: 200 },
                { ingredientId: getIngId('Bawang Putih (Garlic)'), quantity: 50 },
                { ingredientId: getIngId('Kunyit (Turmeric)'), quantity: 30 },
                { ingredientId: getIngId('Ketumbar (Coriander)'), quantity: 15 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 100 },
            ]
        },
        {
            name: 'Sup Buntut (Oxtail Soup)',
            description: 'Clear beef soup with carrots, potatoes, and fried shallots.',
            yield: 3,
            ingredients: [
                { ingredientId: getIngId('Daging Sapi (Beef Chunk)'), quantity: 750 },
                { ingredientId: getIngId('Wortel (Carrot)'), quantity: 150 },
                { ingredientId: getIngId('Kentang (Potato)'), quantity: 200 },
                { ingredientId: getIngId('Bawang Merah (Shallots)'), quantity: 30 },
                { ingredientId: getIngId('Kayu Manis (Cinnamon)'), quantity: 1 },
                { ingredientId: getIngId('Cengkeh (Cloves)'), quantity: 5 },
            ]
        },

        // Western Dishes
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
        },
        {
            name: 'Salmon Steak au Poivre',
            description: 'Pan-seared salmon with crushed black pepper and lemon.',
            yield: 1,
            ingredients: [
                { ingredientId: getIngId('Ikan Salmon'), quantity: 180 },
                { ingredientId: getIngId('Merica (Pepper)'), quantity: 10 },
                { ingredientId: getIngId('Mentega (Butter)'), quantity: 15 },
                { ingredientId: getIngId('Kentang (Potato)'), quantity: 150 },
                { ingredientId: getIngId('Brokoli'), quantity: 80 },
            ]
        },
        {
            name: 'Spaghetti Beef Bolognese',
            description: 'Fresh pasta with rich minced beef and tomato sauce.',
            yield: 4,
            ingredients: [
                { ingredientId: getIngId('Daging Cincang (Minced Beef)'), quantity: 400 },
                { ingredientId: getIngId('Tomat (Tomato)'), quantity: 300 },
                { ingredientId: getIngId('Bawang Putih (Garlic)'), quantity: 20 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 30 },
                { ingredientId: getIngId('Keju Mozzarella'), quantity: 50 },
            ]
        },

        // Japanese & Fusion
        {
            name: 'Chicken Teriyaki Bento',
            description: 'Sweet and savory chicken with vegetables and rice.',
            yield: 1,
            ingredients: [
                { ingredientId: getIngId('Ayam Fillet (Chicken)'), quantity: 150 },
                { ingredientId: getIngId('Kecap Manis (Sweet Soy)'), quantity: 30 },
                { ingredientId: getIngId('Minyak Wijen (Sesame Oil)'), quantity: 5 },
                { ingredientId: getIngId('Beras Basmati'), quantity: 100 },
                { ingredientId: getIngId('Brokoli'), quantity: 50 },
            ]
        },
        {
            name: 'Salmon Sashimi Platter',
            description: 'Premium fresh salmon slices with wasabi and soy.',
            yield: 2,
            ingredients: [
                { ingredientId: getIngId('Ikan Salmon'), quantity: 300 },
                { ingredientId: getIngId('Minyak Wijen (Sesame Oil)'), quantity: 10 },
            ]
        },

        // Snacks & Side Dishes
        {
            name: 'Bakwan Sayur Krispi',
            description: 'Indonesian vegetable fritters with sweet chili dip.',
            yield: 10,
            ingredients: [
                { ingredientId: getIngId('Wortel (Carrot)'), quantity: 100 },
                { ingredientId: getIngId('Sawi Hijau'), quantity: 100 },
                { ingredientId: getIngId('Tepung Terigu (Flour)'), quantity: 250 },
                { ingredientId: getIngId('Tepung Tapioka'), quantity: 50 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 100 },
            ]
        },
        {
            name: 'Tahu Isi Pedas (Gehu)',
            description: 'Fried tofu stuffed with spicy sprouts and carrots.',
            yield: 8,
            ingredients: [
                { ingredientId: getIngId('Tahu (Tofu)'), quantity: 8 },
                { ingredientId: getIngId('Wortel (Carrot)'), quantity: 100 },
                { ingredientId: getIngId('Cabai Rawit (Bird Eye Chili)'), quantity: 20 },
                { ingredientId: getIngId('Tepung Terigu (Flour)'), quantity: 150 },
                { ingredientId: getIngId('Minyak Goreng'), quantity: 100 },
            ]
        },

        // Desserts & Beverages
        {
            name: 'Es Kopi Susu Aren',
            description: 'Viral Indonesian iced coffee with palm sugar and milk.',
            yield: 5,
            ingredients: [
                { ingredientId: getIngId('Kopi Bubuk (Coffee)'), quantity: 100 },
                { ingredientId: getIngId('Susu Cair (Milk)'), quantity: 1000 },
                { ingredientId: getIngId('Gula Aren (Palm Sugar)'), quantity: 150 },
            ]
        },
        {
            name: 'Kolak Pisang Spesial',
            description: 'Sweet banana and palm fruit compote with coconut milk, perfect for Takjil.',
            yield: 5,
            ingredients: [
                { ingredientId: getIngId('Pisang Kepok (Banana)'), quantity: 5 },
                { ingredientId: getIngId('Kolang Kaling'), quantity: 200 },
                { ingredientId: getIngId('Santan (Coconut Milk)'), quantity: 300 },
                { ingredientId: getIngId('Gula Aren (Palm Sugar)'), quantity: 150 },
                { ingredientId: getIngId('Daun Pandan'), quantity: 2 },
                { ingredientId: getIngId('Garam'), quantity: 2 }
            ]
        },
        {
            name: 'Es Buah Cocopandan',
            description: 'Refreshing fruit syrup dessert with dates, basil seeds, and condensed milk.',
            yield: 10,
            ingredients: [
                { ingredientId: getIngId('Kurma (Dates)'), quantity: 200 },
                { ingredientId: getIngId('Biji Selasih'), quantity: 20 },
                { ingredientId: getIngId('Sirup Cocopandan'), quantity: 150 },
                { ingredientId: getIngId('Susu Kental Manis'), quantity: 100 },
            ]
        },
        {
            name: 'Avocado Juice with SKM',
            description: 'Creamy avocado blended with chocolate condensed milk.',
            yield: 4,
            ingredients: [
                { ingredientId: getIngId('Alpukat (Avocado)'), quantity: 800 },
                { ingredientId: getIngId('Susu Kental Manis'), quantity: 200 },
                { ingredientId: getIngId('Gula Pasir'), quantity: 50 },
            ]
        },
    ];

    const recipes: Recipe[] = recipeTemplates.map(t => ({
        id: uuidv4(),
        ...t
    }));

    // Cost calculation helper
    const calculateTotalCost = (items: { recipeId: string; quantity: number }[]) => {
        return items.reduce((sum, item) => {
            const recipe = recipes.find(r => r.id === item.recipeId);
            if (!recipe) return sum;
            const recipeBaseCost = recipe.ingredients.reduce((rs, ri) => {
                const ing = ingredients.find(i => i.id === ri.ingredientId);
                return rs + ((ing?.price || 0) * ri.quantity);
            }, 0);
            const costPerPortion = recipeBaseCost / (recipe.yield || 1);
            return sum + (costPerPortion * item.quantity);
        }, 0);
    };

    // 3. Orders (Diversified)
    const orderScenarios = [
        { name: 'Wedding Breakfast - Grand Hyatt', recipes: ['Salmon Steak au Poivre', 'Sup Buntut (Oxtail Soup)'], status: 'completed' },
        { name: 'Ramadhan Buffet Masjid Al-Azhar', recipes: ['Kolak Pisang Spesial', 'Es Buah Cocopandan', 'Beef Rendang Padang'], status: 'pending' },
        { name: 'Tech Conf: Lunch Box Batch A', recipes: ['Nasi Goreng Spesial', 'Chicken Teriyaki Bento'], status: 'completed' },
        { name: 'Family Dinner: The Rahardjos', recipes: ['Classic Truffle Burger', 'Salmon Steak au Poivre', 'Ayocado Juice with SKM'], status: 'completed' },
        { name: 'Daily Restock: Coffee Shop X', recipes: ['Es Kopi Susu Aren', 'Bakwan Sayur Krispi'], status: 'pending' },
        { name: 'Staff Meal: Sunday Shift', recipes: ['Ayam Goreng Lengkuas', 'Tahu Isi Pedas (Gehu)'], status: 'completed' },
        { name: 'VIP Garden Party', recipes: ['Salmon Sashimi Platter', 'Classic Truffle Burger'], status: 'pending' },
        { name: 'Car Free Day Booth', recipes: ['Bakwan Sayur Krispi', 'Tahu Isi Pedas (Gehu)', 'Es Kopi Susu Aren'], status: 'completed' },
    ];

    const orders: Order[] = orderScenarios.map((scenario, index) => {
        const date = subDays(new Date(), index * 2 + 1);
        const scenarioRecipes = recipes.filter(r => scenario.recipes.includes(r.name));

        const items = scenarioRecipes.map(r => ({
            recipeId: r.id,
            quantity: Math.floor(Math.random() * 50) + 10 // 10-60 portions
        }));

        return {
            id: uuidv4(),
            name: scenario.name,
            date: formatISO(date),
            items,
            status: scenario.status as Order['status'],
            totalCost: calculateTotalCost(items),
            notes: `Auto-generated dummy data for ${scenario.name}`
        };
    });

    return { ingredients, recipes, orders };
};
