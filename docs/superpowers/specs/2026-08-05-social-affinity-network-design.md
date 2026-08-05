# Social Affinity Network & Relationship Diagram — Design Spec

**Date**: 2026-08-05
**Project**: Social Affinity Network (`/home/aizatfir/Project/social-affinity-network`)
**Theme**: Mobile Legends MLBB Social Affinity & Relationship Manager

---

## 1. System Architecture

- **Framework**: Vite + Vanilla HTML5/JS + Custom CSS Design System
- **Graph Renderer**: Cytoscape.js / HTML5 2D Canvas (Interactive force-directed node graph)
- **UI Aesthetics**: MLBB Gaming Dark Mode, Neon Glow Accent Colors (`#FF4655`, `#00F0FF`, `#7000FF`, `#00FF66`), Glassmorphism Panels.
- **Storage**: `localStorage` + JSON Import/Export.

---

## 2. Affinity Tiers & Dunbar Limits

| Tier Key | Name | Color Theme | Default Max Capacity | Description |
|---|---|---|---|---|
| `lovers` | Lovers | Gold / Crimson (`#FF2A6D`) | 1 | Partner / Significant Other |
| `close_friends` | Close Friends | Cyber Cyan (`#00F0FF`) | 5 | Inner Circle / Besties |
| `family` | Family | Emerald Green (`#00FF66`) | 10 | Immediate Family |
| `friends` | Friends | Royal Purple (`#7000FF`) | 30 | Active Social Circle |
| `acquaintances` | Not Close / Acquaintance | Slate Gray (`#8A99AD`) | 100 | Outer Circle |

---

## 3. Data Schema (TypeScript Interface)

```typescript
interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  tier: 'lovers' | 'close_friends' | 'family' | 'friends' | 'acquaintances';
  whatsappNumber?: string; // e.g. 628123456789
  instagramHandle?: string; // e.g. username
  attitudeGuide: {
    howToTreat: string; // Tips bersikap baik ke orang ini
    doAndDonts: string; // Batas pribadi / kesukaan
    notes: string; // Catatan bebas
  };
  createdAt: string;
}

interface UserProfile {
  name: string;
  avatarUrl: string;
  customTierLimits: Record<string, number>;
}
```

---

## 4. UI Components

1. **Header Bar**:
   - Title & Dunbar Energy Capacity Gauge (e.g. `Lovers 1/1 | Close Friends 3/5 | Total 42/146`).
   - Action buttons: `+ Add Contact`, `Export JSON`, `Import JSON`.

2. **Interactive Node Graph (Center Canvas)**:
   - Central Node = User.
   - Surrounding Nodes = Contacts with Avatar Image + MLBB Tier Border Frame.
   - Drag, zoom, pan, hover highlight, animated glowing link lines.

3. **Contact Drawer (Right Side Panel)**:
   - Opens on Node Click.
   - Displays avatar, name, affinity badge, WA (`wa.me`) & IG (`instagram.com`) direct buttons.
   - Form editor for "Sikap Baik", "Do & Don'ts", "Catatan".
   - Delete/Edit button.

4. **Add/Edit Contact Modal**:
   - Form to input name, tier, phone, Instagram, attitude guide notes.
   - Enforces Dunbar capacity warning if tier max reached.

---

## 5. Implementation Steps

1. Scaffold Vite project in `/home/aizatfir/Project/social-affinity-network`.
2. Install `cytoscape` graph library and set up MLBB dark theme CSS.
3. Build Storage Manager & Sample Data generator.
4. Implement Interactive Cytoscape Canvas with custom MLBB node/edge styling.
5. Implement Contact Drawer, Attitude Guide editor, WA/IG links, and Dunbar Capacity Monitor.
