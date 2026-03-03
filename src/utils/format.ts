/**
 * Formats a number as currency (Rupiah) with dot as thousands separator.
 * Standard format in Indonesia: Rp 1.234.567
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
