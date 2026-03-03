export type UnitType = 'kg' | 'gr' | 'ltr' | 'ml' | 'pcs' | 'pack' | 'can' | 'btl';

export interface UserProfile {
    name: string;
    username: string;
    description: string;
    avatar?: string;
}

export interface IngredientOverride {
    ingredientId: string;
    customPrice: number;
}

export interface Ingredient {
    id: string;
    name: string;
    unit: UnitType;
    price: number; // Base price per unit
    image?: string;
    icon?: string;
    color?: string;
}

export interface RecipeIngredient {
    ingredientId: string;
    quantity: number; // Quantity required for the recipe's yield
}

export interface Recipe {
    id: string;
    name: string;
    description?: string;
    note?: string;
    yield: number; // Number of portions this recipe produces
    ingredients: RecipeIngredient[];
    image?: string;
    manualCost?: number; // Optional override cost manual
    icon?: string;
    color?: string;
}

export interface OrderItem {
    recipeId: string;
    quantity: number; // Number of portions ordered
    customPrice?: number; // Price override for this specific order item
}

export interface Order {
    id: string;
    name: string;
    date: string; // ISO Date string
    items: OrderItem[];
    status: 'draft' | 'pending' | 'completed' | 'cancelled';
    totalCost: number; // Snapshot of total cost at time of finalization
    ingredientOverrides?: IngredientOverride[];
    notes?: string;
}

export interface CartItem extends OrderItem {
    id?: string; // Add a dummy property or remove if strictly not needed
}
