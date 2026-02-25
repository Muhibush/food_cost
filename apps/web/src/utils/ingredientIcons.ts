/**
 * Utility for generating consistent icons and colors for ingredients
 * based on their names.
 */

export interface IngredientIconConfig {
    icon: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
}

const ICON_MAPPING: { keywords: string[]; icon: string; color: string }[] = [
    {
        keywords: ['egg'],
        icon: 'egg',
        color: 'orange'
    },
    {
        keywords: ['beef', 'meat', 'pork', 'lamb', 'steak', 'chicken', 'poultry', 'duck'],
        icon: 'lunch_dining',
        color: 'red'
    },
    {
        keywords: ['fish', 'shrimp', 'seafood', 'salmon', 'tuna', 'crab', 'lobster'],
        icon: 'set_meal',
        color: 'cyan'
    },
    {
        keywords: ['basil', 'leaf', 'herb', 'plant', 'mint', 'parsley', 'cilantro', 'thyme', 'rosemary'],
        icon: 'eco',
        color: 'green'
    },
    {
        keywords: ['vegetable', 'onion', 'garlic', 'carrot', 'tomato', 'pepper', 'veg', 'broccoli', 'corn'],
        icon: 'potted_plant',
        color: 'emerald'
    },
    {
        keywords: ['fruit', 'apple', 'banana', 'strawberry', 'berry', 'lemon', 'lime', 'orange', 'grape'],
        icon: 'nutrition',
        color: 'rose'
    },
    {
        keywords: ['flour', 'grain', 'rice', 'wheat', 'bread', 'bakery', 'yeast'],
        icon: 'grain',
        color: 'yellow'
    },
    {
        keywords: ['milk', 'dairy', 'cheese', 'butter', 'cream', 'yogurt'],
        icon: 'egg_alt',
        color: 'blue'
    },
    {
        keywords: ['water', 'liquid', 'juice', 'stock', 'broth', 'syrup', 'honey'],
        icon: 'water_drop',
        color: 'sky'
    },
    {
        keywords: ['oil', 'vinegar', 'sauce', 'extract', 'paste', 'dressing'],
        icon: 'science',
        color: 'purple'
    },
    {
        keywords: ['sugar', 'salt', 'spice', 'powder', 'pepper', 'chili', 'seasoning'],
        icon: 'scatter_plot',
        color: 'amber'
    },
    {
        keywords: ['nut', 'seed', 'almond', 'peanut', 'cashew', 'walnut'],
        icon: 'grid_view',
        color: 'amber'
    }
];

const DEFAULT_ICON = 'inventory_2';
const COLOR_VARIANTS = ['orange', 'red', 'green', 'blue', 'purple', 'yellow', 'pink', 'indigo'];

/**
 * Gets icon and color configuration for an ingredient name
 */
export const getIngredientIconConfig = (name: string): IngredientIconConfig => {
    const lowerName = name.trim().toLowerCase();

    // Find matching keyword
    const match = ICON_MAPPING.find(m =>
        m.keywords.some(keyword => lowerName.includes(keyword))
    );

    if (match) {
        return {
            icon: match.icon,
            colorClass: `text-${match.color}-400`,
            bgClass: `bg-${match.color}-500/10`,
            borderClass: `border-${match.color}-500/20`
        };
    }

    // Fallback: use hash to pick a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % COLOR_VARIANTS.length;
    const color = COLOR_VARIANTS[colorIndex];

    return {
        icon: DEFAULT_ICON,
        colorClass: `text-${color}-400`,
        bgClass: `bg-${color}-500/10`,
        borderClass: `border-${color}-500/20`
    };
};
