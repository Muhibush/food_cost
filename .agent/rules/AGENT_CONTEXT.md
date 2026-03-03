---
trigger: always_on
---

# AGENT_CONTEXT

## PROJECT OVERVIEW

- **Project Name:** CookCost (Food Cost App)
- **Repository:** `food_cost`
- **Purpose:** Professional food costing PWA for kitchens, restaurants, caterers, and food entrepreneurs.
- **Core Functionality:** Management of ingredients, recipes, and orders. Calculates cost per portion based on ingredient prices and recipe yields, and computes total order costs with optional price overrides.
- **Architecture:** Progressive Web App (PWA) using Firebase as backend. Data persisted in Cloud Firestore (per-user documents and subcollections), authentication via Firebase Auth (Google Sign-In), offline support via Firestore IndexedDB persistence. Deployed to Firebase Hosting.

---

## TECH STACK

| Layer              | Technology                                              |
|--------------------|--------------------------------------------------------|
| **Framework**      | React 18 (Vite 5)                                      |
| **Language**       | TypeScript 5.6                                         |
| **Routing**        | React Router DOM v6 (createBrowserRouter)              |
| **State**          | Zustand 5 (in-memory) with Firestore real-time sync    |
| **Database**       | Cloud Firestore (per-user subcollections)              |
| **Offline**        | Firestore IndexedDB persistence (enableIndexedDbPersistence) |
| **Styling**        | Tailwind CSS 3 + clsx + tailwind-merge                 |
| **PWA**            | vite-plugin-pwa (Workbox, autoUpdate)                  |
| **Hosting**        | Firebase Hosting (projects: cookcost-dev, cookcost-prod) |
| **Date Handling**  | date-fns                                               |
| **Icons**          | Material Symbols (via Icon component)                  |
| **Typography**     | Manrope (Google Fonts)                                 |
| **Auth**           | Firebase Authentication (Google Sign-In via useAuthStore) |

---

## PROJECT STRUCTURE

### `/src/pages/` — Feature Modules (16 features)
Flattened feature-driven structure. Each feature folder contains:
- `view/` — Main screen component(s)
- `widgets/` — Feature-specific sub-components
- `store/` — Feature-specific Zustand store

**Features:** `auth_login`, `auth_register`, `ingredient_list`, `ingredient_form`, `recipe_list`, `recipe_form`, `recipe_selection`, `order_list`, `order_entry`, `order_detail`, `order_history`, `profile_detail`, `edit_profile`, `intro`, `design_system`, `developer_page`

### `/src/components/ui/` — Reusable UI Components (25 components)
Atomic components: Header, MediaCard, ActionFooter, BottomSheet, Button, Card, DatePicker, Calendar, QuantitySelector, Input, Select, Textarea, Icon, Badge, FAB, FilterButton, AlertDialog, EmptyState, ImageUpload, InfoBanner, Popover, SectionHeader, SplashScreen, SummaryCard, IngredientBottomSheet

### `/src/components/layout/` — App Shell
- `Layout.tsx` — Main layout wrapper with BottomNav
- `BottomNav.tsx` — Bottom navigation bar (visible on main tabs only)
- `AuthGuard.tsx` — Authentication guard wrapper

### `/src/store/` — Global Stores
- `useAuthStore.ts` — Authentication state management
- `useConfigStore.ts` — App configuration flags (`hasBeenSeeded`, `hasSeenIntro`) — uses Zustand `persist` middleware → LocalStorage

### `/src/lib/` — Firebase Configuration
- `firebase.ts` — Firebase app initialization, Auth, Firestore, Google provider, IndexedDB persistence

### `/src/types/` — Shared Types
- `index.ts` — TypeScript interfaces: `Ingredient`, `Recipe`, `Order`, `OrderItem`, `RecipeIngredient`, `IngredientOverride`, `UserProfile`, `CartItem`, `UnitType`

### `/src/utils/` — Utilities (9 files)
`cn.ts`, `format.ts`, `dummyData.ts`, `ingredientIcons.ts`, `recipeIcons.ts`, `imageUtils.ts`, `dataUtils.ts`, `sanitize.ts`, `storageUtils.ts`

---

## COMMON TASK LOCATIONS

| Task                      | Location                                                  |
|---------------------------|-----------------------------------------------------------|
| Recipe Logic & State      | `src/pages/recipe_list/store/useRecipesStore.ts`          |
| Ingredient Logic & State  | `src/pages/ingredient_list/store/useIngredientsStore.ts`  |
| Order List Logic          | `src/pages/order_list/store/useOrdersStore.ts`            |
| Order Detail Edit Logic   | `src/pages/order_detail/store/useOrderEditStore.ts`       |
| Order Entry Draft Logic   | `src/pages/order_entry/store/useOrderDraftStore.ts`       |
| Routing Configuration     | `src/App.tsx`                                             |
| Data Models (Types)       | `src/types/index.ts`                                      |
| Mock Data Generation      | `src/utils/dummyData.ts`                                  |
| Auth Store (Firebase)     | `src/store/useAuthStore.ts`               |
| Config Store              | `src/store/useConfigStore.ts`             |
| Firebase Config           | `src/lib/firebase.ts`                     |
| Profile Store             | `src/pages/edit_profile/store/useProfileStore.ts` |
| Tailwind Design Tokens    | `tailwind.config.cjs`                                     |
| PWA & Vite Config         | `vite.config.ts`                                          |
| Firebase Config           | `firebase.json`, `.firebaserc`                            |
| Env Variables Template    | `.env.example`                                            |

---

## ROUTING MAP

| Path                      | Component          | Type         |
|---------------------------|--------------------|--------------|
| `/intro`                  | IntroPage          | Public       |
| `/login`                  | Login              | Public       |
| `/design-system`          | DesignSystem       | Public (dev) |
| `/`                       | OrderEntry         | Main Tab     |
| `/history`                | HistoryPage        | Main Tab     |
| `/ingredients`            | IngredientsList    | Main Tab     |
| `/ingredients/new`        | IngredientForm     | Detail       |
| `/ingredients/:id`        | IngredientForm     | Detail       |
| `/recipes`                | RecipesList        | Main Tab     |
| `/recipes/new`            | RecipeForm         | Detail       |
| `/recipes/:id`            | RecipeForm         | Detail       |
| `/orders`                 | OrdersList         | Detail       |
| `/orders/select-recipes`  | RecipeSelection    | Detail       |
| `/orders/:id`             | OrderDetail        | Detail       |
| `/profile`                | Profile            | Main Tab     |
| `/profile/edit`           | EditProfile        | Detail       |
| `/developer`              | DeveloperPage      | Detail       |

---

## DATA FLOW

```
User Interaction → React Component → Zustand Store Action → Firestore Write → onSnapshot Listener → Zustand State Update → UI Re-render
```

**Auth Flow:** `App Mount → AuthGuard → onAuthStateChanged → initListener (per store) → Firestore onSnapshot → Real-time data sync`

**Firestore Structure:**
- `users/{uid}` — User profile document
- `users/{uid}/ingredients` — Ingredients subcollection
- `users/{uid}/recipes` — Recipes subcollection
- `users/{uid}/orders` — Orders subcollection

**Note:** `useConfigStore` is the only store using Zustand `persist` middleware → LocalStorage (not Firestore). `useOrderEditStore` and `useOrderDraftStore` are ephemeral in-memory only (no persistence).

---

## NPM SCRIPTS

| Script             | Command                                              |
|--------------------|------------------------------------------------------|
| `npm run dev`      | Start Vite dev server                                |
| `npm run dev:dev`  | Dev server with `.env.development` (port 3000)       |
| `npm run dev:prod` | Dev server with `.env.production` (port 3001)        |
| `npm run build:dev`| TypeScript check + Vite build (development mode)     |
| `npm run build:prod`| TypeScript check + Vite build (production mode)     |
| `npm run deploy:dev`| Build dev + Firebase deploy to `cookcost-dev`       |
| `npm run deploy:prod`| Build prod + Firebase deploy to `cookcost-prod`    |
| `npm run lint`     | Run ESLint                                           |
