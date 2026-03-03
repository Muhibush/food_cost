/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#FF6B35",
                "primary-dark": "#EA580C",
                "secondary": "#14B8A6",
                "secondary-dark": "#0F766E",
                "background-light": "#FDFBF7",
                "background-dark": "#12141D",
                "surface-dark": "#1C1F2E",
                "navy-charcoal": "#1C1F2E",
                "surface-light": "#ffffff",
                "gray-750": "#2A2D3A",
                "success": "#22C55E",
                "danger": "#EF4444",
                "text-muted": "#9CA3AF"
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"]
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
