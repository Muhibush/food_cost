import { Ingredient, Recipe, Order } from '../types';

interface AppData {
    ingredients: Ingredient[];
    recipes: Recipe[];
    orders: Order[];
    version: string;
    timestamp: string;
}

export const exportAppData = (ingredients: Ingredient[], recipes: Recipe[], orders: Order[]) => {
    const data: AppData = {
        ingredients,
        recipes,
        orders,
        version: '1.0.0', // Data format version
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `food_cost_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importAppData = async (file: File): Promise<AppData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (!data.ingredients || !data.recipes || !data.orders) {
                    throw new Error('Invalid backup file format');
                }
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};
