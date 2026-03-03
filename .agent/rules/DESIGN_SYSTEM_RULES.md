---
trigger: always_on
---

# 🎨 Design System & UI Components

## 📌 Overview

CookCost uses a premium dark-mode design system with 25 reusable UI components located in `src/components/ui/`. All new pages and features must use these components to maintain visual consistency.

---

## 🏗 Core UI Components

### **1. Header** ([Header.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/Header.tsx))
- **Usage:** Mandatory on all pages. Sticky at top with `z-50`.
- **Props:**
    - `title` — Main page title
    - `subtitle` — (Optional) Secondary text below the title
    - `showBackButton` — Required for Detail Pages, hidden for Main Tabs
    - `rightElement` — (Optional) Slot for action buttons (settings, add, etc.)
    - `leftElement` — (Optional) Slot for profile avatars (Main Tabs)

### **2. MediaCard** ([MediaCard.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/MediaCard.tsx))
- **Usage:** Standard layout for all list items (Recipes, Ingredients, Orders).
- **Layout:** 20×20 image/icon on the left, multi-line text content on the right.
- **Slots:** `rightElement` (e.g., delete button), `bottomElement` (e.g., price or quantity).

### **3. ActionFooter** ([ActionFooter.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/ActionFooter.tsx))
- **Usage:** Sticky bottom bar for primary page actions (Submit, Create, Update).
- **Position:** Pinned to bottom, appears above the Bottom Navigation Bar.
- **Features:** Optional summary display (e.g., Total Cost) + primary action button.

### **4. BottomSheet** ([BottomSheet.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/BottomSheet.tsx))
- **Usage:** Modal overlay sliding up from the bottom. Used for forms, selections, and confirmations.

### **5. DatePicker** ([DatePicker.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/DatePicker.tsx))
- **Usage:** Custom date input with premium UI. Displays formatted dates (e.g., "13 February 2026").
- **Calendar:** Uses the companion `Calendar.tsx` component with `react-day-picker`.

### **6. QuantitySelector** ([QuantitySelector.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/QuantitySelector.tsx))
- **Usage:** Increment/decrement control for portion counts and quantities.

### **7. Button** ([Button.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/Button.tsx))
- **Usage:** Primary action button with variant support.

### **8. Input / Select / Textarea**
- Standard form controls with consistent dark-mode styling.
- Located at: `Input.tsx`, `Select.tsx`, `Textarea.tsx`

### **9. AlertDialog** ([AlertDialog.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/AlertDialog.tsx))
- **Usage:** Confirmation dialogs for destructive or important actions.

### **10. EmptyState** ([EmptyState.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/EmptyState.tsx))
- **Usage:** Placeholder content when lists are empty.

### **11. SplashScreen** ([SplashScreen.tsx](file:///Users/muhibush/projects/food_cost/src/components/ui/SplashScreen.tsx))
- **Usage:** Animated brand splash screen shown on app launch.

### **Other Components**
`Badge`, `Card`, `FAB`, `FilterButton`, `Icon`, `ImageUpload`, `InfoBanner`, `IngredientBottomSheet`, `Popover`, `SectionHeader`, `SummaryCard`

---

## 🎨 Design Tokens

Defined in `tailwind.config.cjs`:

### Colors
| Token               | Hex        | Usage                          |
|----------------------|------------|--------------------------------|
| `primary`           | `#FF6B35`  | Accent color, CTAs, active     |
| `primary-dark`      | `#EA580C`  | Hover/pressed primary states   |
| `secondary`         | `#14B8A6`  | Secondary accent (teal)        |
| `secondary-dark`    | `#0F766E`  | Hover/pressed secondary states |
| `background-dark`   | `#12141D`  | Core app background            |
| `surface-dark`      | `#1C1F2E`  | Card/section backgrounds       |
| `background-light`  | `#FDFBF7`  | Light mode background          |
| `surface-light`     | `#FFFFFF`  | Light mode card backgrounds    |
| `gray-750`          | `#2A2D3A`  | Subtle dividers, borders       |
| `success`           | `#22C55E`  | Positive/success states        |
| `danger`            | `#EF4444`  | Destructive/error states       |
| `text-muted`        | `#9CA3AF`  | Secondary/placeholder text     |

### Typography
- **Font Family:** Manrope (`font-display` class)
- **Headings:** `font-extrabold` or `font-black`
- **Body:** Default weight with Manrope

### Elevation & Borders
- **Card Shadow:** `shadow-card` — `0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.1)`
- **Rounded Corners:** `rounded-2xl` for cards and sections
- **Subtle Borders:** `border-white/5` for surface-dark elements

---

## ⚠️ Implementation Guidelines

1. **Reuse Components:** Never write custom Tailwind layouts for headers, cards, list items, or footers. Use `Header`, `MediaCard`, `ActionFooter`, etc.
2. **Consistent Theming:** Always use design token classes (`bg-background-dark`, `bg-surface-dark`, `text-primary`). Never use arbitrary hex values in Tailwind classes.
3. **Premium Aesthetics:** Every card must use `shadow-card`, `rounded-2xl`, and `border-white/5`. Aim for a polished, premium look.
4. **Dark Mode First:** The app is dark-mode by default. Use `darkMode: 'class'` in Tailwind config.
5. **Responsive Design:** Mobile-first approach. All components should work well on small screens.
6. **Class Merging:** Use the `cn()` utility for conditional classes, never string concatenation.
