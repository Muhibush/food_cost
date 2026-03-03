---
trigger: always_on
---

# 🚀 Antigravity Workspace Rules: UI & Navigation

## 📌 Overview

These rules govern the layout, navigation persistence, and header behavior for the Antigravity workspace. The goal is to provide a consistent, native Android-like experience.

---

## 🛠 1. Navigation Scoping

The agent must categorize every screen into one of two scopes:

* **Main Tabs (Core):** Root destinations like `Home`, `Profile`, `Search`, `Settings`.
* **Detail Pages (Sub-Pages):** Screens pushed onto the stack from a main tab (e.g., `ProductDetail`, `UserEdit`, `PostView`).

---

## 📱 2. Bottom Navigation Bar (BNB)

* **Visibility:** The `BottomNavigationBar` must be **visible ONLY on Main Tabs**.
* **Detail Pages:** When navigating to any Detail Page, the BNB must be hidden/unmounted to allow for a full-screen experience.
* **State Management:** Ensure the navigation state remembers the active tab when returning from a Detail Page.

---

## 🏗 3. Header & Back Button Logic

Follow the **Android Master-Detail** pattern:

### **Main Tabs (Master Pages)**

* **Back Button:** **Strictly prohibited.** Do not render a back button in the header for core/master pages.
* **Title:** Display the tab name clearly. No "Up" navigation.

### **Detail Pages (Sub-Pages)**

* **Back Button:** **Mandatory.** Always include a functional back button (typically a left arrow `←`).
* **Functionality:** Clicking the back button must trigger the system/router `pop` or `goBack` action.

---

## 📌 4. Sticky Header Requirements

To maintain context during long scrolls, apply the following to all page headers:

* **Persistence:** Headers must be **Sticky** (`position: sticky` or `pinned: true`). They must remain fixed at the top of the viewport.
* **Visual Treatment:** * **Opacity:** Header backgrounds must be 100% opaque to prevent content overlap during scroll.
* **Elevation:** (Optional but recommended) Add a subtle shadow or border when the user has scrolled away from the top (`scroll-y > 0`).


* **Z-Index:** Ensure the header has a higher `z-index` than all body content.

---

## 💻 5. Implementation Reference (Agent Logic)

```typescript
// Define Main Tabs
const MAIN_TABS = ['Home', 'Profile', 'Search', 'Notifications'];

const isMainTab = (route) => MAIN_TABS.includes(route.name);

// UI Config Generator
export const getLayoutConfig = (currentRoute) => {
  const isCore = isMainTab(currentRoute);

  return {
    showBottomBar: isCore,
    showBackButton: !isCore,
    headerStyle: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--background-color)',
    }
  };
};

```

---

## ⚠️ 6. Enforcement & Constraints

* **Never** allow the header to scroll off-screen with the body content.
* **Never** render a back button on the Home screen.
* **Always** hide the Bottom Navigation Bar when the user is deep in a sub-menu or detail view.

---