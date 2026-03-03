# 🍳 CookCost — Professional Food Costing Application

> **Master your kitchen's profitability.** CookCost is a Progressive Web App (PWA) powered by Firebase that helps professional kitchens, restaurants, caterers, and food entrepreneurs precisely calculate food costs per portion and manage orders with full cost transparency.

---

## ✨ Features

### 📦 Ingredient Management
- Create, edit, and delete ingredients with name, unit, and base price.
- Supports multiple unit types: `kg`, `gr`, `ltr`, `ml`, `pcs`, `pack`, `can`, `btl`.
- Auto-generated icons and color-coded avatars based on ingredient name when no image is provided.

### 🧑‍🍳 Recipe Management
- Build recipes with multiple ingredients and specify yield (portions produced).
- Automatically calculates **cost per portion** based on ingredient prices and quantities.
- Optional manual cost override for recipes that don't follow standard costing.
- Add descriptions and notes to each recipe.

### 📋 Order Management
- Create orders by selecting recipes and specifying portion quantities.
- Real-time total cost calculation based on recipe costs and quantities.
- Support for **custom price overrides** per order item and **ingredient price overrides** per order.
- Order lifecycle with statuses: `draft` → `pending` → `completed` / `cancelled`.
- Full order history with detail view.

### 🔐 Authentication & User Profile
- **Google Sign-In** via Firebase Authentication.
- Auth-guarded routes — unauthenticated users are redirected to intro/login.
- User profile with name, username, description, and avatar stored in Firestore.

### 🎨 Premium Dark UI
- Sleek dark-mode interface with vibrant orange (#FF6B35) accent color.
- Built with a custom design system featuring glassmorphism, smooth animations, and premium card layouts.
- Fully responsive mobile-first design.
- Splash screen and onboarding intro flow.

### 📱 Progressive Web App (PWA)
- Installable on mobile and desktop via browser.
- Offline-capable with service worker caching (Workbox).
- Auto-updating service worker registration.

---

## 🛠 Tech Stack

| Layer              | Technology                                                   |
|--------------------|--------------------------------------------------------------|
| **Framework**      | [React 18](https://react.dev/) (via [Vite 5](https://vitejs.dev/)) |
| **Language**       | TypeScript 5.6                                               |
| **Routing**        | React Router DOM v6                                          |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) (in-memory, synced via Firestore listeners) |
| **Auth**           | Firebase Authentication (Google Sign-In)                     |
| **Database**       | Cloud Firestore (per-user documents and subcollections)      |
| **Offline**        | Firestore IndexedDB persistence                             |
| **Styling**        | [Tailwind CSS 3](https://tailwindcss.com/) + `clsx` + `tailwind-merge` |
| **PWA**            | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) |
| **Hosting**        | [Firebase Hosting](https://firebase.google.com/docs/hosting) (dev + prod) |
| **Date Handling**  | [date-fns](https://date-fns.org/)                            |
| **Icons**          | [Material Symbols](https://fonts.google.com/icons)           |
| **Typography**     | [Manrope](https://fonts.google.com/specimen/Manrope)         |

---

## 📁 Project Structure

```
food_cost/
├── public/                     # Static assets (icons, PWA manifests)
├── src/
│   ├── App.tsx                 # Router configuration & app bootstrap
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global Tailwind imports
│   ├── lib/
│   │   └── firebase.ts         # Firebase app, Auth, Firestore, Google provider
│   ├── components/
│   │   ├── layout/             # App shell components
│   │   │   ├── Layout.tsx      # Main layout wrapper (with BottomNav)
│   │   │   ├── BottomNav.tsx   # Bottom navigation bar
│   │   │   └── AuthGuard.tsx   # Firebase Auth guard wrapper
│   │   └── ui/                 # 25 reusable UI components
│   │       ├── Header.tsx      # Sticky page header
│   │       ├── MediaCard.tsx   # List item card layout
│   │       ├── ActionFooter.tsx # Sticky bottom action bar
│   │       ├── BottomSheet.tsx # Modal bottom sheet
│   │       ├── Button.tsx      # Primary button variants
│   │       ├── DatePicker.tsx  # Custom date picker
│   │       ├── QuantitySelector.tsx # Increment/decrement control
│   │       ├── SplashScreen.tsx # Animated splash screen
│   │       └── ...             # (and 17 more components)
│   ├── pages/                  # Feature-driven page modules
│   │   ├── auth_login/         # Login page
│   │   ├── auth_register/      # Registration page (placeholder)
│   │   ├── ingredient_list/    # Ingredient listing & store
│   │   ├── ingredient_form/    # Add/edit ingredient
│   │   ├── recipe_list/        # Recipe listing & store
│   │   ├── recipe_form/        # Add/edit recipe
│   │   ├── recipe_selection/   # Recipe picker for order creation
│   │   ├── order_list/         # Active orders listing & store
│   │   ├── order_entry/        # New order creation (draft)
│   │   ├── order_detail/       # Order detail view/edit
│   │   ├── order_history/      # Past orders archive
│   │   ├── profile_detail/     # User profile view
│   │   ├── edit_profile/       # Edit user profile
│   │   ├── intro/              # Onboarding intro page
│   │   ├── design_system/      # Component showcase (dev tool)
│   │   └── developer_page/     # Developer utilities
│   ├── store/                  # Global stores
│   │   ├── useAuthStore.ts     # Firebase Auth state + store listener init
│   │   └── useConfigStore.ts   # App config flags (persist → LocalStorage)
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   └── utils/                  # Utility functions
│       ├── cn.ts               # Tailwind class merge utility
│       ├── format.ts           # Currency formatting
│       ├── dummyData.ts        # Seed data generator
│       ├── ingredientIcons.ts  # Ingredient icon resolver
│       ├── recipeIcons.ts      # Recipe icon resolver
│       ├── imageUtils.ts       # Image processing helpers
│       ├── dataUtils.ts        # Data manipulation helpers
│       ├── sanitize.ts         # Firestore data sanitization (removes undefined)
│       └── storageUtils.ts     # Storage helpers
├── tailwind.config.cjs         # Tailwind CSS configuration
├── vite.config.ts              # Vite config (PWA, dev server)
├── firebase.json               # Firebase Hosting config
├── .firebaserc                 # Firebase project aliases
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies & scripts
```

### Page Module Convention

Each feature page follows a consistent internal structure:

```
src/pages/<feature_name>/
├── view/           # Main screen component(s)
├── widgets/        # Feature-specific sub-components
└── store/          # Feature-specific Zustand store
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Firebase CLI** (for deployment): `npm install -g firebase-tools`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd food_cost

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### Environment Variables

The app requires Firebase configuration. Copy `.env.example` to `.env.local` and fill in your credentials:

| Variable                          | Description                 |
|-----------------------------------|-----------------------------|
| `VITE_FIREBASE_API_KEY`           | Firebase API key            |
| `VITE_FIREBASE_AUTH_DOMAIN`       | Firebase Auth domain        |
| `VITE_FIREBASE_PROJECT_ID`       | Firebase project ID         |
| `VITE_FIREBASE_STORAGE_BUCKET`   | Firebase Storage bucket     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID            |
| `VITE_FIREBASE_APP_ID`           | Firebase app ID             |

### Development

```bash
# Start dev server (default mode)
npm run dev

# Start dev server with development environment
npm run dev:dev        # → http://localhost:3000

# Start dev server with production environment
npm run dev:prod       # → http://localhost:3001
```

### Build & Deploy

```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod

# Deploy to Firebase (development)
npm run deploy:dev

# Deploy to Firebase (production)
npm run deploy:prod
```

### Firebase Projects

| Alias   | Project ID       |
|---------|------------------|
| `dev`   | `cookcost-dev`   |
| `prod`  | `cookcost-prod`  |

---

## 🧪 Dummy Data

On first launch, the app automatically seeds itself with realistic dummy ingredients, recipes, and orders to provide an immediate demo experience. This behavior is controlled by the `useConfigStore` (persisted to LocalStorage) and only runs once (when `hasBeenSeeded` is `false`). Additional dummy data can be imported from the Developer Settings page (`/developer`).

---

## 📊 Data Models

### Ingredient
```typescript
interface Ingredient {
    id: string;
    name: string;
    unit: 'kg' | 'gr' | 'ltr' | 'ml' | 'pcs' | 'pack' | 'can' | 'btl';
    price: number;      // Base price per unit
    image?: string;
    icon?: string;
    color?: string;
}
```

### Recipe
```typescript
interface Recipe {
    id: string;
    name: string;
    description?: string;
    note?: string;
    yield: number;       // Number of portions produced
    ingredients: { ingredientId: string; quantity: number }[];
    image?: string;
    manualCost?: number; // Optional cost override
}
```

### Order
```typescript
interface Order {
    id: string;
    name: string;
    date: string;        // ISO date string
    items: { recipeId: string; quantity: number; customPrice?: number }[];
    status: 'draft' | 'pending' | 'completed' | 'cancelled';
    totalCost: number;   // Snapshot at finalization
    ingredientOverrides?: { ingredientId: string; customPrice: number }[];
    notes?: string;
}
```

---

## 🎨 Design System

CookCost uses a premium dark-mode design system with the following tokens:

| Token               | Value        | Usage                        |
|----------------------|--------------|------------------------------|
| `primary`           | `#FF6B35`    | Accent color, CTAs           |
| `primary-dark`      | `#EA580C`    | Hover/pressed states         |
| `secondary`         | `#14B8A6`    | Secondary accent (teal)      |
| `background-dark`   | `#12141D`    | Core app background          |
| `surface-dark`      | `#1C1F2E`    | Card/section backgrounds     |
| `success`           | `#22C55E`    | Positive states              |
| `danger`            | `#EF4444`    | Destructive actions          |
| `text-muted`        | `#9CA3AF`    | Secondary text               |

**Typography:** Manrope (Google Fonts) with `font-extrabold` / `font-black` headings.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────┐
│                      React App                        │
│                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐    │
│  │   Pages   │───▶│  Zustand  │───▶│  Cloud       │    │
│  │(Components)│◀──│  Stores   │◀──│  Firestore   │    │
│  └──────────┘    └──────────┘    │  (real-time)  │    │
│       │               │          └──────────────┘    │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐    │
│  │    UI     │    │  Utils   │    │  Firebase    │    │
│  │Components │    │(format,  │    │  Auth        │    │
│  │(reusable) │    │ icons)   │    │  (Google)    │    │
│  └──────────┘    └──────────┘    └──────────────┘    │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │         Service Worker (PWA/Workbox)          │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
         │
    Firebase Hosting
```

**Firestore Structure:**
- `users/{uid}` — User profile document
- `users/{uid}/ingredients` — Ingredients subcollection
- `users/{uid}/recipes` — Recipes subcollection
- `users/{uid}/orders` — Orders subcollection

**Auth Flow:** `onAuthStateChanged → initListener (per store) → Firestore onSnapshot → Real-time data sync`

**Security:** Firestore rules enforce owner-only access — users can only read/write their own `users/{uid}` path.

---

## 🤝 Contributing

1. Follow the coding rules in `.agent/rules/CODING_RULES.md`
2. Use the design system components from `src/components/ui/`
3. Follow the page module convention (`view/`, `widgets/`, `store/`)
4. Keep business logic in Zustand stores, not in components
5. Use Tailwind CSS exclusively for styling

---

## 📄 License

Private project. All rights reserved.
