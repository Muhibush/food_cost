/**
 * Utility for generating consistent icons and colors for recipes
 * based on their names.
 */

export interface RecipeIconConfig {
    icon: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
}

const ICON_MAPPING: { keywords: string[]; icon: string; color: string }[] = [
    {
        keywords: ['soup', 'stew', 'broth', 'ramen', 'pho'],
        icon: 'soup_kitchen',
        color: 'orange'
    },
    {
        keywords: ['salad', 'bowl', 'green', 'poke'],
        icon: 'local_see', // Or another bowl-like icon
        color: 'green'
    },
    {
        keywords: ['cake', 'dessert', 'sweet', 'pastry', 'cookie', 'pie', 'brownie', 'muffin'],
        icon: 'cake',
        color: 'rose'
    },
    {
        keywords: ['bread', 'sandwich', 'burger', 'toast', 'bagel'],
        icon: 'bakery_dining',
        color: 'amber'
    },
    {
        keywords: ['pasta', 'noodle', 'spaghetti', 'fettuccine', 'penne'],
        icon: 'dinner_dining',
        color: 'yellow'
    },
    {
        keywords: ['pizza'],
        icon: 'local_pizza',
        color: 'red'
    },
    {
        keywords: ['drink', 'coffee', 'tea', 'juice', 'smoothie', 'latte', 'beverage', 'mocktail'],
        icon: 'local_cafe',
        color: 'sky'
    },
    {
        keywords: ['steak', 'grill', 'bbq', 'roast', 'meat', 'beef', 'chicken', 'pork'],
        icon: 'outdoor_grill',
        color: 'red'
    },
    {
        keywords: ['breakfast', 'egg', 'pancake', 'waffle', 'omelette'],
        icon: 'egg_alt',
        color: 'yellow'
    },
    {
        keywords: ['ice cream', 'gelato', 'sorbet', 'sundae'],
        icon: 'icecream',
        color: 'cyan'
    },
    {
        keywords: ['snack', 'chips', 'popcorn', 'crisps'],
        icon: 'fastfood',
        color: 'orange'
    }
];

const DEFAULT_ICON = 'restaurant';
const COLOR_VARIANTS = ['orange', 'red', 'green', 'blue', 'purple', 'yellow', 'pink', 'indigo'];

/**
 * Gets icon and color configuration for a recipe name
 */
export const getRecipeIconConfig = (name: string): RecipeIconConfig => {
    const lowerName = name.trim().toLowerCase();

    // Find matching keyword for the icon
    const match = ICON_MAPPING.find(m =>
        m.keywords.some(keyword => lowerName.includes(keyword))
    );

    const icon = match ? match.icon : DEFAULT_ICON;

    // Always use hash to pick a consistent color for variety
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % COLOR_VARIANTS.length;
    const color = COLOR_VARIANTS[colorIndex];

    return {
        icon,
        colorClass: `text-${color}-400`,
        bgClass: `bg-${color}-500/10`,
        borderClass: `border-${color}-500/20`
    };
};
