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

/src/pages
Flattened feature-driven structure. Each feature (e.g., `order_detail`, `recipe_list`) is a folder containing:
- `view/`: Main screen components
- `widgets/`: Feature-specific sub-components
- `store/`: Feature-specific Zustand stores

/src/components/ui
Reusable atomic UI components (Button, Input, Icon, Header)

/src/store
Reserved ONLY for truly global/shared state (if any). Business logic is localized to feature folders.

/src/utils
Helper functions (currency formatting) and dummy data generation

/src/types
Shared TypeScript interfaces and type definitions

---

## COMMON TASK LOCATIONS

Recipe Logic & State → src/pages/recipe_list/store/useRecipesStore.ts
Ingredient Logic → src/pages/ingredient_list/store/useIngredientsStore.ts
Order List Logic → src/pages/order_list/store/useOrdersStore.ts
Order Detail Edit Logic → src/pages/order_detail/store/useOrderEditStore.ts
Order Entry Draft Logic → src/pages/order_entry/store/useOrderDraftStore.ts
Routing Configuration → src/App.tsx
Data Models (Types) → src/types/index.ts
Mock Data Generation → src/utils/dummyData.ts

---

## QUICK ARCHITECTURE FLOW

User Interaction → React Component → Zustand Store Action → LocalStorage Update → UI Re-render
