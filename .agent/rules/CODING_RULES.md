---
trigger: always_on
---

# CODING_RULES

## CODING RULES
- **Business Logic**: Encapsulate logic within Zustand stores (`src/store`), not in components.
- **Styling**: Use Tailwind CSS exclusively. Avoid CSS modules or inline styles.
- **Icons**: Use the `Icon` component (wrapping Material Symbols).
- **Ingredient Icons**: If no image is provided, ingredients use auto-generated icons based on their name. Logic is defined in `IngredientsList.tsx` and `IngredientBottomSheet.tsx`.
    - **Icon Mapping**: Maps keywords (egg, beef, meat, basil, flour, water, etc.) to specific symbols.
    - **Color Hashing**: Generates a consistent background color based on the ingredient name string.
- **Navigation**: Use `useNavigate` from `react-router-dom`.
- **State**: Persist critical data (recipes, ingredients, orders) using Zustand's `persist` middleware.

---

## NAMING CONVENTIONS
- **Stores**: `use[Feature]Store.ts` (e.g., `useRecipesStore.ts`)
- **Components**: PascalCase (e.g., `MediaCard.tsx`, `RecipeForm.tsx`)
- **Pages**: PascalCase, often suffixed with 'Page' or 'List' (e.g., `HistoryPage.tsx`, `RecipesList.tsx`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)

---

## DO NOT
- Assume a backend API exists (the app is currently serverless/local).
- Create "services" that fetch from an API (unless implementing the backend).
- Mix business logic (like cost calculation instructions) directly in UI render methods; use helpers or store selectors.
