# 🎨 Food Cost App - Design System Guide

This document defines the standardized UI components and patterns used across the CookCost application.

## 🏗 Utilities

### **cn Utility**
- **Location:** `apps/web/src/utils/cn.ts`
- **Usage:** Centralized utility for Tailwind class merging. Always use this instead of `clsx` or `tailwind-merge` directly.

---

## 🏗 Core UI Components

### **1. Header**
- **Usage:** Mandatory for all pages.
- **Props:** `title`, `subtitle`, `showBackButton`, `rightElement`, `leftElement`, `bottomElement`.
- **Note:** `bottomElement` is ideal for search inputs.

### **2. MediaCard**
- **Usage:** Standardized layout for list items.
- **Aesthetics:** 20x20 image on the left, multi-line content on the right.

### **3. SectionHeader**
- **Usage:** Group headers for lists (e.g., month/year grouping or categories).
- **Props:** `title`, `rightElement` (optional text or count).

### **4. EmptyState**
- **Usage:** Displayed when a list has no items or no search results.
- **Props:** `icon`, `title`, `message`, `action` (optional button).

### **5. FilterButton**
- **Usage:** Circular toggle button for header actions.
- **Props:** `isActive` (boolean), `onClick`.

### **6. BottomSheet**
- **Usage:** Slide-up panel for filters or selections.
- **Variants:** `IngredientBottomSheet` is a specialized implementation for ingredient selection.

### **7. Popover**
- **Usage:** Floating contextual menus.
- **Parts:** `Popover`, `PopoverTrigger`, `PopoverContent`.

### **8. Calendar**
- **Usage:** Inline date selection. Used inside `DatePicker`.

### **9. Card & MediaCard**
- **Usage:** Container components for list items. `Card` provides the base frame with optional `hoverEffect`.

### **10. Icon & Badge**
- **Usage:** `Icon` wraps Material Symbols. `Badge` provides status-style labels (`success`, `warning`, `danger`).

---

## 🎨 Design Tokens

- **Colors:** `primary`, `background-dark`, `surface-dark`, `text-muted`.
- **Typography:** **Manrope** (font-display).
- **Shapes:** `rounded-2xl` (standard cards), `rounded-full` (buttons/handles).
