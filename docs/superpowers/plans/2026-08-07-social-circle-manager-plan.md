# Social Circle Manager Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `social-affinity-network` to use the Stitch Social Circle Manager design system & views (Orbit Dashboard, Fullscreen Orbit, My Circles, Network Insights, Kinship Profile Drawer) connected to LocalStorage & Firebase Cloud Sync.

**Architecture:** Split the UI into component modules (`src/components/`) representing each Stitch view, with a central view switcher in `src/main.js`. Use Tailwind CSS + Plus Jakarta Sans styling while keeping `src/storage.js` and `src/firebase.js` as the data engine.

**Tech Stack:** JavaScript (ES Modules), Vite, Tailwind CSS (CDN/styles), Plus Jakarta Sans, Firebase Firestore.

## Global Constraints
- Target workspace: `/home/aizatfir/Project/social-affinity-network`
- Data engine: Preserve `StorageManager` API & Firestore sync.
- Design theme: Parchment/Apple `#FDFBF7` light, `#121212` dark, `#6366f1` accent.

---

### Task 1: Add Tailwind CSS & Font Styling Dependencies

**Files:**
- Modify: `index.html:1-14`
- Modify: `src/style.css:1-50`

**Interfaces:**
- Consumes: Tailwind CDN script & Plus Jakarta Sans Google Font.
- Produces: CSS utility classes and color variables (`bg-background-light`, `font-display`).

- [ ] **Step 1: Update index.html with Tailwind & Fonts**

Edit `index.html` to load Tailwind CSS CDN, Material Icons, and Plus Jakarta Sans font.

- [ ] **Step 2: Add Theme Tokens to `src/style.css`**

Add root variables and custom styles for orbit ring floating animations and parchment paper texture.

- [ ] **Step 3: Commit**

```bash
git add index.html src/style.css
git commit -m "style: add Tailwind CDN, Plus Jakarta Sans, and theme tokens"
```

---

### Task 2: Implement Component Directory Structure & Orbit Dashboard

**Files:**
- Create: `src/components/orbitDashboard.js`
- Modify: `src/main.js:1-100`

**Interfaces:**
- Consumes: `StorageManager.getContacts()`, `TIER_CONFIG` from `src/types.js`
- Produces: `renderOrbitDashboard(contacts, selectedTierFilter, searchQuery, onSelectContact)`

- [ ] **Step 1: Create `src/components/orbitDashboard.js`**

Implement concentric SVG/CSS rings with floating avatar nodes, filter chips (All, Intimate, Close, Friends, Meaningful), search bar, and contact selection handler.

- [ ] **Step 2: Commit**

```bash
git add src/components/orbitDashboard.js
git commit -m "feat: add Orbit Dashboard view component"
```

---

### Task 3: Implement Immersive Fullscreen Orbit Component

**Files:**
- Create: `src/components/fullscreenOrbit.js`

**Interfaces:**
- Consumes: `contacts` array from `StorageManager`
- Produces: `renderFullscreenOrbit(contacts, onSelectContact, onClose)`

- [ ] **Step 1: Create `src/components/fullscreenOrbit.js`**

Implement full-screen canvas view with particle background, orbit rings, and floating avatar badges.

- [ ] **Step 2: Commit**

```bash
git add src/components/fullscreenOrbit.js
git commit -m "feat: add Immersive Fullscreen Orbit view component"
```

---

### Task 4: Implement My Circles Dunbar Management Component

**Files:**
- Create: `src/components/myCircles.js`

**Interfaces:**
- Consumes: `contacts`, `TIER_CONFIG` from `src/types.js`
- Produces: `renderMyCircles(contacts, onAddContact, onEditTier)`

- [ ] **Step 1: Create `src/components/myCircles.js`**

Implement tier capacity cards, Dunbar ratio progress bars, and attitude template guideline cards.

- [ ] **Step 2: Commit**

```bash
git add src/components/myCircles.js
git commit -m "feat: add My Circles management view component"
```

---

### Task 5: Implement Network Insights Component

**Files:**
- Create: `src/components/networkInsights.js`

**Interfaces:**
- Consumes: `contacts`, `StorageManager.getCapacityStats()`
- Produces: `renderNetworkInsights(contacts)`

- [ ] **Step 1: Create `src/components/networkInsights.js`**

Implement relationship health score index, interaction distribution chart, and priority attention list.

- [ ] **Step 2: Commit**

```bash
git add src/components/networkInsights.js
git commit -m "feat: add Network Insights analytics view component"
```

---

### Task 6: Implement Kinship Profile Drawer & Contact Form Modal

**Files:**
- Create: `src/components/kinshipProfile.js`
- Create: `src/components/contactModal.js`

**Interfaces:**
- Consumes: `contact` object, `StorageManager.saveContact()`, `StorageManager.deleteContact()`
- Produces: `renderKinshipProfileDrawer(contact, onClose, onEdit, onDelete)` and `renderContactModal(...)`

- [ ] **Step 1: Create `src/components/kinshipProfile.js`**

Implement side-panel drawer with avatar, WhatsApp/Instagram quick buttons, attitude guide editor, memory log list, and action buttons.

- [ ] **Step 2: Create `src/components/contactModal.js`**

Implement modal for adding and editing contacts with emoji avatar picker & tier selector.

- [ ] **Step 3: Commit**

```bash
git add src/components/kinshipProfile.js src/components/contactModal.js
git commit -m "feat: add Kinship Profile drawer and Contact Modal components"
```

---

### Task 7: Wire View Switcher & State in `src/main.js` and Verify

**Files:**
- Modify: `src/main.js:1-474`

**Interfaces:**
- Consumes: All view components from `src/components/` and `StorageManager`
- Produces: Fully integrated Single Page Application with dynamic tab switching and cloud sync.

- [ ] **Step 1: Rewrite `src/main.js` with View State Handler**

Integrate active tab switcher (`orbit` | `fullscreen` | `circles` | `insights`), top bar navigation, capacity gauges, contact picker (`navigator.contacts`), and Firebase auth.

- [ ] **Step 2: Build & Verify Production Bundle**

Run `npm run build` to verify clean compilation without syntax or import errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: wire main layout, view switcher, and Firebase cloud sync"
```
