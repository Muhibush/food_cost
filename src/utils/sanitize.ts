/**
 * Removes undefined properties from an object recursively.
 * Firestore does not allow undefined values.
 */
export const sanitizeData = <T extends object>(data: T): T => {
    const result = { ...data };
    Object.keys(result).forEach(key => {
        const k = key as keyof T;
        if (result[k] === undefined) {
            delete result[k];
        } else if (result[k] !== null && typeof result[k] === 'object' && !Array.isArray(result[k])) {
            result[k] = sanitizeData(result[k] as Record<string, unknown>) as T[keyof T];
        }
    });
    return result;
};
