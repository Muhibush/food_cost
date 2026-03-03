---
trigger: always_on
---

# CODING_RULES

## General Principles

- **Business Logic:** Encapsulate all business logic within Zustand stores (in feature-specific `store/` directories), **never** in React component render methods. Use store selectors or utility functions for derived data (e.g., cost calculations, filtered lists).
- **Component Responsibility:** React components should only handle rendering and event delegation to store actions. Complex transformations belong in stores or utils.
- **TypeScript:** Use strict typing. All shared data models are defined in `src/types/index.ts`. Feature-specific types can live alongside their store.

---

## Styling

- **Tailwind CSS Only:** Use Tailwind utility classes exclusively. **Do not** use CSS modules, inline styles, or `styled-components`.
- **Class Merging:** Use the `cn()` utility from `src/utils/cn.ts` (wraps `clsx` + `tailwind-merge`) for conditional class composition.
- **Design Tokens:** Always use the project's custom Tailwind tokens defined in `tailwind.config.cjs` (e.g., `bg-background-dark`, `text-primary`, `bg-surface-dark`). Do not use arbitrary color values.

---

## Icons

- **Material Symbols:** Use the `Icon` component (`src/components/ui/Icon.tsx`), which wraps Google Material Symbols.
- **Ingredient Auto-Icons:** When no image is provided, ingredients render auto-generated icons using:
    - **Icon Mapping** (`src/utils/ingredientIcons.ts`): Maps keywords (egg, beef, meat, basil, flour, water, etc.) to specific Material Symbols.
    - **Color Hashing**: Generates a consistent background color from the ingredient name string.
- **Recipe Auto-Icons** (`src/utils/recipeIcons.ts`): Similar auto-icon logic for recipes.

---

## Navigation

- **Router:** Use `useNavigate` from `react-router-dom` for programmatic navigation.
- **Router Config:** All routes are defined in `src/App.tsx` using `createBrowserRouter`.
- **Auth Guard:** Protected routes are wrapped in `<AuthGuard>` which checks `useAuthStore`.

---

## State Management

- **Zustand Stores:** Zustand stores hold in-memory state that is synchronized with Cloud Firestore via real-time `onSnapshot` listeners. Writes go to Firestore; reads come from snapshot callbacks.
- **Feature Stores:** Each feature page has its own store in `src/pages/<feature>/store/`. This is the primary location for business logic. Stores expose an `initListener()` method that sets up the Firestore `onSnapshot` subscription.
- **Global Stores:** Only `useAuthStore` and `useConfigStore` live in `src/store/`. Do not add feature-specific state here.
- **Auth Flow:** `useAuthStore` listens to `onAuthStateChanged` and initializes all feature store listeners when user is authenticated.
- **Offline Support:** Firestore IndexedDB persistence is enabled in `src/lib/firebase.ts` for offline-first capability.
- **Exception — `useConfigStore`:** The only store using Zustand `persist` middleware → LocalStorage. Stores app flags (`hasBeenSeeded`, `hasSeenIntro`) that are not user data.
- **Ephemeral Stores:** `useOrderEditStore` and `useOrderDraftStore` are in-memory only (no persistence). They hold temporary draft state during order creation/editing.
- **Store Naming:** `use[Feature]Store.ts` (e.g., `useRecipesStore.ts`, `useOrderEditStore.ts`).

---

## Naming Conventions

| Type         | Convention   | Example                               |
|--------------|-------------|---------------------------------------|
| **Stores**   | `use[Feature]Store.ts` | `useRecipesStore.ts`          |
| **Components** | PascalCase | `MediaCard.tsx`, `RecipeForm.tsx`     |
| **Pages**    | PascalCase   | `HistoryPage.tsx`, `RecipesList.tsx`  |
| **Utils**    | camelCase    | `formatCurrency.ts`, `cn.ts`         |
| **Types**    | PascalCase (interfaces) | `Ingredient`, `OrderItem`  |
| **Feature Dirs** | snake_case | `order_detail/`, `recipe_list/`  |

---

## File Organization

Each page feature follows this convention:

```
src/pages/<feature_name>/
├── view/       # Main screen component
├── widgets/    # Feature-specific sub-components
└── store/      # Feature-specific Zustand store
```

---

## DO NOT

- ❌ Assume data is stored in LocalStorage (the app uses Cloud Firestore with real-time sync).
- ❌ Create "services" that fetch from a REST API (use Firestore SDK directly in stores).
- ❌ Mix business logic (cost calculations, data transformations) directly in component JSX.
- ❌ Use CSS modules, inline styles, or `styled-components`.
- ❌ Use arbitrary Tailwind color values — always use the project's design tokens.
- ❌ Add feature-specific state to `src/store/` — use the feature's own `store/` directory.
- ❌ Import a store's internal state directly — use exported actions and selectors.
- ❌ Skip the `sanitizeData()` utility when writing to Firestore — always sanitize data before `setDoc`.
