---
trigger: always_on
---

# 🚀 UI & Navigation Rules

## 📌 Overview

These rules govern the layout, navigation persistence, and header behavior for CookCost. The goal is to provide a consistent, native mobile-app-like experience following the Android Master-Detail pattern.

---

## 🛠 1. Navigation Scoping

Every screen must be categorized into one of two scopes:

### Main Tabs (Core Destinations)
Root-level pages visible in the Bottom Navigation Bar (5 tabs):
- `/` — Order Entry (Home)
- `/history` — Order History
- `/recipes` — Recipes List
- `/ingredients` — Ingredients List
- `/profile` — User Profile

### Detail Pages (Sub-Pages)
Screens pushed onto the navigation stack from a main tab:
- `/ingredients/new`, `/ingredients/:id` — Ingredient Form
- `/recipes/new`, `/recipes/:id` — Recipe Form
- `/orders` — Active Orders List
- `/orders/:id` — Order Detail
- `/orders/select-recipes` — Recipe Selection
- `/profile/edit` — Edit Profile
- `/developer` — Developer Page

### Public Pages (No Auth Required)
- `/intro` — Onboarding Intro
- `/login` — Login
- `/design-system` — Component Showcase (dev tool)

---

## 📱 2. Bottom Navigation Bar (BNB)

- **Visibility:** The `BottomNav` component must be **visible ONLY on Main Tab** routes.
- **Detail Pages:** BNB must be **hidden/unmounted** when navigating to any Detail Page — full-screen experience.
- **State Persistence:** The active tab state must be remembered when returning from a Detail Page.
- **Implementation:** The `Layout.tsx` component conditionally renders `BottomNav` based on the current route.

---

## 🏗 3. Header & Back Button Logic

### Main Tabs (Master Pages)
- ✅ Display tab title in the Header
- ✅ Use `leftElement` for profile avatar or branding
- ✅ Use `rightElement` for page-specific actions (add, filter, settings)
- ❌ **Back Button:** Strictly **PROHIBITED** on Main Tabs

### Detail Pages (Sub-Pages)
- ✅ **Back Button:** **MANDATORY** — always render via `showBackButton={true}` on the `Header` component
- ✅ Clicking back must trigger `navigate(-1)` or `router.back()`
- ✅ Display contextual title (e.g., "Edit Ingredient", "Order #123")

---

## 📌 4. Sticky Header Requirements

Apply to **all pages** without exception:

| Requirement        | Rule                                                          |
|--------------------|---------------------------------------------------------------|
| **Position**       | `position: sticky; top: 0;`                                   |
| **Z-Index**        | `z-50` (higher than all body content)                         |
| **Background**     | 100% opaque `bg-background-dark` — no transparency            |
| **Elevation**      | (Recommended) Add `shadow-sm` or `border-b border-white/5` on scroll |

**Never** allow the header to scroll off-screen with body content.

---

## 📐 5. Page Layout Template

Every page should follow this structure:

```tsx
<div className="min-h-screen bg-background-dark">
    {/* Sticky Header */}
    <Header
        title="Page Title"
        showBackButton={isDetailPage}
        rightElement={<ActionButton />}
    />

    {/* Scrollable Content */}
    <div className="px-4 pb-24">
        {/* Page content */}
    </div>

    {/* Optional: Sticky Footer (above BNB) */}
    <ActionFooter
        label="Total Cost"
        value="Rp 150.000"
        buttonText="Submit"
        onSubmit={handleSubmit}
    />
</div>
```

**Note:** `pb-24` provides clearance for the ActionFooter and/or BottomNav.

---

## 💻 6. Implementation Reference

```typescript
// Main Tab routes (BNB visible, no back button)
const MAIN_TAB_PATHS = ['/', '/history', '/recipes', '/ingredients', '/profile'];

const isMainTab = (pathname: string) => MAIN_TAB_PATHS.includes(pathname);

// Layout config
const getLayoutConfig = (pathname: string) => ({
    showBottomBar: isMainTab(pathname),
    showBackButton: !isMainTab(pathname),
});
```

---

## ⚠️ 7. Enforcement Checklist

- ❌ Never allow the header to scroll off-screen
- ❌ Never render a back button on Main Tab pages
- ❌ Never show the BottomNav on Detail Pages
- ✅ Always use the `Header` component (never custom headers)
- ✅ Always use `AuthGuard` wrapper for protected routes
- ✅ Always add bottom padding (`pb-24`) for pages with ActionFooter or BottomNav