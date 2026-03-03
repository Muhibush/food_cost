---
trigger: always_on
---

# 🎨 Antigravity Workspace Rules: Design System & UI Components

## 📌 Overview

This document defines the standardized design system components and patterns to be used across the application. These components are designed to provide a premium, consistent user experience.

---

## 🏗 Core UI Components

All reusable components are located in `apps/web/src/components/ui/`.

### **1. Header** ([Header.tsx](file:///Users/muhibush/projects/food_cost/apps/web/src/components/ui/Header.tsx))
*   **Usage:** Mandatory for all pages.
*   **Props:**
    *   `title`: Main page title.
    *   `subtitle`: (Optional) Secondary text below the title.
    *   `showBackButton`: (Boolean) Required for Detail Pages. Hidden for Main Tabs.
    *   `rightElement`: (Optional) Slot for settings, add buttons, etc.
    *   `leftElement`: (Optional) Slot for profile avatars (typically on Main Tabs).

### **2. MediaCard** ([MediaCard.tsx](file:///Users/muhibush/projects/food_cost/apps/web/src/components/ui/MediaCard.tsx))
*   **Usage:** Standardized layout for list items (Recipes, Ingredients, Orders).
*   **Aesthetics:** 20x20 image on the left, multi-line content on the right.
*   **Variants:** Supports `rightElement` (e.g., delete button) and `bottomElement` (e.g., price or quantity selector).

### **3. ActionFooter** ([ActionFooter.tsx](file:///Users/muhibush/projects/food_cost/apps/web/src/components/ui/ActionFooter.tsx))
*   **Usage:** Sticky bottom bar for primary actions (Submit, Create, Update).
*   **Positioning:** Must be pinned to the bottom, appearing above the Bottom Navigation Bar (if visible).
*   **Features:** Displays an optional summary (e.g., Total Cost) and a primary action button.

### **4. DatePicker** ([DatePicker.tsx](file:///Users/muhibush/projects/food_cost/apps/web/src/components/ui/DatePicker.tsx))
*   **Usage:** Use for all date inputs.
*   **Aesthetics:** Premium custom UI that wraps the native browser date picker. Displays formatted dates (e.g., "13 February 2026").

### **5. QuantitySelector** ([QuantitySelector.tsx](file:///Users/muhibush/projects/food_cost/apps/web/src/components/ui/QuantitySelector.tsx))
*   **Usage:** Standard control for incrementing/decrementing portion counts or quantities.

---

## 🎨 Design Tokens

*   **Colors:** Use Tailwind classes defined in `tailwind.config.cjs`:
    *   `primary`: #FF6B35
    *   `background-dark`: #0F111A (Core app background)
    *   `surface-dark`: #1C1F2E (Card/Section backgrounds)
    *   `text-muted`: Gray variants for secondary information.
*   **Typography:** Primary font is **Manrope**. Headings should use `font-extrabold` or `font-black`.

---

## ⚠️ Implementation Guidelines

1.  **Stop Inline Layouts:** Do not write custom Tailwind layouts for headers, cards, or footers. Use the reusable components instead.
2.  **Maintain Consistency:** Ensure all new pages follow the Master-Detail pattern defined in `front-end-mweb-guide.md`.
3.  **Premium Aesthetics:** Use `shadow-card`, rounded corners (`rounded-2xl`), and subtle borders (`border-white/5`) to maintain the premium look.
