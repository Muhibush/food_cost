---
trigger: always_on
---

# AGENT_CONTEXT

## PROJECT OVERVIEW
Project name: Food Cost App (CookCost)
Purpose: Professional Food Costing Application
Main functionality:
Management of ingredients, recipes, and orders. Calculates costs per portion and total order costs.
Currently operates as a **client-side only PWA** using local storage for persistence.

---

## TECH STACK
Framework:
- React 18 (Vite)
- React Router DOM
Language:
- TypeScript
State Management:
- Zustand (with persist middleware)
Styling:
- Tailwind CSS
- Class Value Utility (clsx, tailwind-merge)
Database:
- LocalStorage (via Zustand)
Auth method:
- Mock Authentication (Local State)

---

## PROJECT STRUCTURE

/apps/web/src/pages
Application screens and route components (e.g., /auth, /orders, /recipes)

/apps/web/src/components/ui
Reusable atomic UI components (Button, Input, Icon, Header)

/apps/web/src/store
Global state definitions and business logic (Zustand stores)

/apps/web/src/utils
Helper functions (currency formatting) and dummy data generation

/apps/web/src/types
Shared TypeScript interfaces and type definitions

---

## CODING RULES
- **Business Logic**: Encapsulate logic within Zustand stores (`src/store`), not in components.
- **Styling**: Use Tailwind CSS exclusively. Avoid CSS modules or inline styles.
- **Icons**: Use the `Icon` component (wrapping Material Symbols).
- **Navigation**: Use `useNavigate` from `react-router-dom`.
- **State**: Persist critical data (recipes, ingredients, orders) using Zustand's `persist` middleware.

---

## COMMON TASK LOCATIONS

Recipe Logic & State → apps/web/src/store/useRecipesStore.ts
Ingredient Logic → apps/web/src/store/useIngredientsStore.ts
Order Logic → apps/web/src/store/useOrdersStore.ts
Routing Configuration → apps/web/src/App.tsx
Data Models (Types) → apps/web/src/types/index.ts
Mock Data Generation → apps/web/src/utils/dummyData.ts

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

---

## QUICK ARCHITECTURE FLOW

User Interaction → React Component → Zustand Store Action → LocalStorage Update → UI Re-render
