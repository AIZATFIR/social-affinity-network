# Design Specification: Stitch Social Circle Manager Integration

**Date:** 2026-08-07  
**Project:** `social-affinity-network`  
**Status:** Approved  

---

## 1. Overview
Upgrade the existing `social-affinity-network` web application by integrating the modern **Stitch Social Circle Manager** design system (Apple/Parchment aesthetic, Tailwind CSS, Plus Jakarta Sans font, and 5 interactive views) while preserving existing LocalStorage persistence, device contact import (`navigator.contacts`), and Firebase Cloud Sync.

---

## 2. Design System & Aesthetics
- **Color System:**
  - Background Light: `#FDFBF7` (Parchment Paper texture)
  - Background Dark: `#121212`
  - Primary Action Accent: `#6366f1` (Action Indigo) / `#0066cc`
  - Tiers & Orbit Colors:
    - **Lovers / Intimate:** `#FFB5C5` / `#ff2a6d` (Capacity: 1)
    - **Close Friends:** `#FFD97D` / `#00f0ff` (Capacity: 5)
    - **Family:** `#A0D6B4` / `#10b981` (Capacity: 10)
    - **Friends:** `#9DC6E0` / `#8b5cf6` (Capacity: 30)
    - **Acquaintances:** `#64748b` (Capacity: 100)
- **Typography:** Plus Jakarta Sans & Material Icons / Outfit font fallback.
- **Component Layout:** Soft rounded corners (`1rem`), glassmorphism cards, float animations for orbit avatars.

---

## 3. Main Views & Navigation
The application features a top navbar containing:
- **Logo & Title:** 🌌 Social Circle Manager
- **Capacity Gauges:** Real-time indicator per tier showing count vs Dunbar limit.
- **View Switcher Tabs:**
  1. `orbit` — **Orbit Dashboard** (Default concentric orbit visualization with floating avatars, filter chips, and search bar).
  2. `fullscreen` — **Immersive Fullscreen Orbit** (Full-canvas view with ambient particle background & zoom controls).
  3. `circles` — **My Circles** (Dunbar limits management, tier rules editor, and capacity balance).
  4. `insights` — **Network Insights** (Health scores, interaction frequency charts, and relationship status summary).
- **Global Actions:** `📱 Import Kontak HP`, `+ Tambah Teman`, `🔑 Login Google / Cloud Sync`.

---

## 4. Components & Interactive Elements
### A. Orbit Dashboard (`orbit`)
- Concentric ring visualization representing Dunbar levels.
- Avatars positioned along rings with smooth float animation.
- Interactive filter chips: All, Intimate, Close, Friends, Meaningful.
- Search input for real-time contact filtering.
- Hover tooltip showing relationship summary; click opens Kinship Profile drawer.

### B. Immersive Orbit (`fullscreen`)
- Clean full-screen canvas view with particle background.
- Floating avatar nodes with ambient animation.
- Toggle back to dashboard control.

### C. My Circles (`circles`)
- Grid cards for each tier showing: capacity progress bar, Dunbar recommendation note, default attitude template, and quick add/edit buttons.

### D. Network Insights (`insights`)
- Overall Network Health Score card (0-100%).
- Dunbar Balance Index.
- Interaction distribution chart.
- Relationship maintenance reminders (high priority attention list).

### E. Kinship Profile Drawer (`kinship_profile`)
- Slide-over profile panel triggered on contact select.
- Profile header with large avatar emoji & name.
- Direct contact action buttons (WhatsApp quick link, Instagram, phone).
- Interactive Attitude Guide editor:
  - How to Treat (Prioritized list with 🔥/⚡/💡 badges).
  - Do's & Don'ts (✅ / ❌ rules).
  - Memory & Birthday Notes.
- Edit contact info, tier assignment, and delete contact.

---

## 5. Data Engine & Persistence
- **StorageManager (`src/storage.js`):**
  - Keeps LocalStorage fallback key `social_affinity_contacts`.
  - Supports Firestore real-time listener on user login (`users/{userId}/contacts`).
  - Calculates Dunbar capacity stats dynamically.
- **Device Contact Import:** Integrates Web Contacts API (`navigator.contacts.select`) for batch loading contacts from Android / iOS / Chrome.

---

## 6. Implementation Strategy
1. **Setup CSS & Dependencies:** Add Tailwind CSS & Google Fonts to `index.html` / `style.css`.
2. **Refactor `src/types.js` & `src/storage.js`:** Ensure full tier compatibility and capacity stats helper.
3. **Build Core Components:**
   - Header & Navbar component.
   - Orbit Dashboard component (Concentric SVG/CSS rings + floating avatar nodes).
   - Fullscreen Canvas Orbit component.
   - My Circles View component.
   - Network Insights View component.
   - Kinship Profile Drawer component.
4. **Assemble & Wire State in `src/main.js`:**
   - Active view switcher (`orbit` | `fullscreen` | `circles` | `insights`).
   - Contact modal add/edit handler.
   - Contact drawer handler.
   - Firebase Auth & Sync handler.
