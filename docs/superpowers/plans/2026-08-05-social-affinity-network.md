# Social Affinity Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-featured MLBB Gaming Neon-styled interactive Relationship Diagram & Social Affinity Network Manager with Dunbar capacity limits, attitude guides, and direct WA/IG integration.

**Architecture:** Standalone Vite web application built with HTML5, CSS3 Glassmorphism UI, Cytoscape.js for force-directed node graph rendering, and LocalStorage data management.

**Tech Stack:** Vite, Vanilla HTML5/CSS3/JavaScript, Cytoscape.js, Lucide Icons (CDN).

## Global Constraints

- Platform: Web browser (Desktop & Mobile responsive)
- Storage: LocalStorage with JSON Export/Import
- Design: Mobile Legends (MLBB) Dark Mode Gaming Neon Aesthetics (`#FF2A6D`, `#00F0FF`, `#00FF66`, `#7000FF`)
- Tiers: Lovers (max 1), Close Friends (max 5), Family (max 10), Friends (max 30), Acquaintances (max 100)

---

### Task 1: Project Setup & Base Design System

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/style.css`
- Create: `vite.config.js`

**Interfaces:**
- Produces: Base HTML layout, CSS custom properties for MLBB neon theme, Vite build script.

- [ ] **Step 1: Create package.json and install dependencies**

```json
{
  "name": "social-affinity-network",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "cytoscape": "^3.30.0"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Run npm install**

Run: `npm install` in `/home/aizatfir/Project/social-affinity-network`
Expected: `node_modules` installed cleanly.

- [ ] **Step 3: Create src/style.css with MLBB Neon Theme**

```css
:root {
  --bg-dark: #0b0f19;
  --panel-bg: rgba(16, 24, 40, 0.85);
  --border-glow: rgba(0, 240, 255, 0.3);
  --text-main: #f0f6fc;
  --text-muted: #8b949e;
  
  --tier-lovers: #ff2a6d;
  --tier-close: #00f0ff;
  --tier-family: #00ff66;
  --tier-friends: #7000ff;
  --tier-acquaintances: #8a99ad;
}

body {
  margin: 0;
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: 'Outfit', 'Inter', system-ui, sans-serif;
  overflow: hidden;
  height: 100vh;
}
```

- [ ] **Step 4: Create index.html shell**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Affinity Network — MLBB Style</title>
  <link rel="stylesheet" href="/src/style.css">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verify dev server runs**

Run: `npx vite build`
Expected: Build succeeds into `dist/`.

---

### Task 2: Data Models & Storage Manager

**Files:**
- Create: `src/types.js`
- Create: `src/storage.js`

**Interfaces:**
- Produces: `StorageManager` with `getContacts()`, `saveContact()`, `deleteContact()`, `exportJSON()`, `importJSON()`, `getCapacityStats()`.

- [ ] **Step 1: Create src/types.js for schema constants**

```javascript
export const TIER_CONFIG = {
  lovers: { name: 'Lovers / Pasangan', color: '#ff2a6d', max: 1, icon: 'heart' },
  close_friends: { name: 'Close Friends', color: '#00f0ff', max: 5, icon: 'shield' },
  family: { name: 'Keluarga', color: '#00ff66', max: 10, icon: 'home' },
  friends: { name: 'Teman', color: '#7000ff', max: 30, icon: 'users' },
  acquaintances: { name: 'Kenalan', color: '#8a99ad', max: 100, icon: 'user' }
};

export const INITIAL_CONTACTS = [
  {
    id: '1',
    name: 'Sarah (Kekasih)',
    tier: 'lovers',
    whatsappNumber: '628123456789',
    instagramHandle: 'sarah_mlbb',
    attitudeGuide: {
      howToTreat: 'Ingat hari penting, apresiasi usaha kecil, dengarkan tanpa menghakimi.',
      doAndDonts: 'DO: Kasih ucapan selamat pagi. DONT: Bahas mabar pas dia lagi capek.',
      notes: 'Suka es krim matcha & hero Angela.'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Budi (Bestie)',
    tier: 'close_friends',
    whatsappNumber: '628987654321',
    instagramHandle: 'budi_gaming',
    attitudeGuide: {
      howToTreat: 'Selalu terbuka, saling bantu saat butuh saran jernih.',
      doAndDonts: 'Jujur dan to the point.',
      notes: 'Teman seperjuangan rank Mythic.'
    },
    createdAt: new Date().toISOString()
  }
];
```

- [ ] **Step 2: Create src/storage.js implementation**

```javascript
import { INITIAL_CONTACTS, TIER_CONFIG } from './types.js';

const STORAGE_KEY = 'social_affinity_contacts';

export class StorageManager {
  static getContacts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveAll(INITIAL_CONTACTS);
      return INITIAL_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTACTS;
    }
  }

  static saveAll(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }

  static saveContact(contactData) {
    const contacts = this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contactData.id);
    if (existingIndex >= 0) {
      contacts[existingIndex] = contactData;
    } else {
      contactData.id = contactData.id || Date.now().toString();
      contactData.createdAt = new Date().toISOString();
      contacts.push(contactData);
    }
    this.saveAll(contacts);
    return contactData;
  }

  static deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.saveAll(contacts);
  }

  static getCapacityStats() {
    const contacts = this.getContacts();
    const stats = {};
    Object.keys(TIER_CONFIG).forEach(tier => {
      stats[tier] = {
        count: contacts.filter(c => c.tier === tier).length,
        max: TIER_CONFIG[tier].max,
        name: TIER_CONFIG[tier].name,
        color: TIER_CONFIG[tier].color
      };
    });
    return stats;
  }
}
```

---

### Task 3: Interactive Cytoscape Graph Canvas

**Files:**
- Create: `src/graph.js`

**Interfaces:**
- Produces: `renderGraph(container, contacts, onNodeClick)` for Cytoscape rendering with MLBB node borders.

- [ ] **Step 1: Write src/graph.js**

```javascript
import cytoscape from 'cytoscape';
import { TIER_CONFIG } from './types.js';

export function createGraphManager(containerEl, onSelectNode) {
  let cy = null;

  function init(contacts) {
    const elements = [
      { data: { id: 'me', label: 'YOU (Me)', color: '#ffd700', isMe: true } }
    ];

    contacts.forEach(c => {
      elements.push({
        data: {
          id: c.id,
          label: c.name,
          color: TIER_CONFIG[c.tier]?.color || '#ffffff',
          tier: c.tier,
          contact: c
        }
      });

      elements.push({
        data: {
          source: 'me',
          target: c.id,
          color: TIER_CONFIG[c.tier]?.color || '#ffffff'
        }
      });
    });

    cy = cytoscape({
      container: containerEl,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '12px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 45,
            'height': 45,
            'border-width': 3,
            'border-color': 'data(color)',
            'border-opacity': 0.8,
            'shadow-blur': 15,
            'shadow-color': 'data(color)',
            'shadow-opacity': 0.8
          }
        },
        {
          selector: 'node[?isMe]',
          style: {
            'width': 60,
            'height': 60,
            'border-width': 5,
            'border-color': '#ffd700',
            'font-weight': 'bold',
            'font-size': '14px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': 'data(color)',
            'curve-style': 'bezier',
            'opacity': 0.6
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        nodeRepulsion: 8000,
        idealEdgeLength: 120
      }
    });

    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const contact = node.data('contact');
      if (contact && onSelectNode) {
        onSelectNode(contact);
      }
    });
  }

  return { init };
}
```

---

### Task 4: UI Panels — Header, Capacity Monitor, Drawer, and Form Modal

**Files:**
- Create: `src/main.js`
- Modify: `src/style.css`

**Interfaces:**
- Produces: Complete UI app layout, Dunbar Capacity Header, Drawer with WA & IG buttons, Add/Edit Modal.

- [ ] **Step 1: Build src/main.js full application logic**

```javascript
import { StorageManager } from './storage.js';
import { createGraphManager } from './graph.js';
import { TIER_CONFIG } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  let selectedContact = null;

  function renderLayout() {
    const stats = StorageManager.getCapacityStats();
    
    app.innerHTML = `
      <header class="navbar">
        <div class="logo">
          <span class="logo-icon">🎮</span>
          <h1>Social Affinity Network</h1>
        </div>
        <div class="capacity-gauge">
          ${Object.entries(stats).map(([key, s]) => `
            <div class="gauge-item" title="${s.name}">
              <span class="dot" style="background: ${s.color}"></span>
              <span class="label">${s.name}: ${s.count}/${s.max}</span>
            </div>
          `).join('')}
        </div>
        <div class="actions">
          <button id="addBtn" class="btn btn-primary">+ Tambah Teman</button>
          <button id="exportBtn" class="btn btn-secondary">Export JSON</button>
        </div>
      </header>

      <main class="main-container">
        <div id="cy" class="cy-container"></div>
        
        <aside id="drawer" class="drawer hidden">
          <div class="drawer-header">
            <h2 id="drawerName">Detail Kontak</h2>
            <button id="closeDrawer" class="btn-icon">&times;</button>
          </div>
          <div class="drawer-content">
            <div class="profile-card">
              <div id="drawerAvatar" class="avatar-large"></div>
              <span id="drawerTierBadge" class="badge"></span>
            </div>

            <div class="quick-links">
              <a id="waLink" href="#" target="_blank" class="btn btn-wa">💬 WhatsApp</a>
              <a id="igLink" href="#" target="_blank" class="btn btn-ig">📸 Instagram</a>
            </div>

            <div class="guide-section">
              <h3>💡 Cara Bersikap Baik</h3>
              <p id="drawerHowToTreat" class="guide-box"></p>
            </div>

            <div class="guide-section">
              <h3>⚠️ Do & Don'ts</h3>
              <p id="drawerDoAndDonts" class="guide-box"></p>
            </div>

            <div class="guide-section">
              <h3>📝 Catatan Tambahan</h3>
              <p id="drawerNotes" class="guide-box"></p>
            </div>

            <div class="drawer-actions">
              <button id="editBtn" class="btn btn-secondary">Edit Kontak</button>
              <button id="deleteBtn" class="btn btn-danger">Hapus</button>
            </div>
          </div>
        </aside>
      </main>

      <!-- Modal Form -->
      <div id="modal" class="modal hidden">
        <div class="modal-content">
          <h2 id="modalTitle">Tambah Kontak Baru</h2>
          <form id="contactForm">
            <input type="hidden" id="formId">
            <div class="form-group">
              <label>Nama / Panggilan</label>
              <input type="text" id="formName" required placeholder="Contoh: Sarah">
            </div>
            <div class="form-group">
              <label>Kategori Affinity (Tier)</label>
              <select id="formTier">
                ${Object.entries(TIER_CONFIG).map(([k, v]) => `
                  <option value="${k}">${v.name} (Maks ${v.max})</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Nomor WhatsApp (Contoh: 628123456789)</label>
              <input type="text" id="formWa" placeholder="628123456789">
            </div>
            <div class="form-group">
              <label>Username Instagram (tanpa @)</label>
              <input type="text" id="formIg" placeholder="username">
            </div>
            <div class="form-group">
              <label>Cara Bersikap Baik (How to Treat)</label>
              <textarea id="formHowToTreat" rows="2" placeholder="Saran bersikap baik..."></textarea>
            </div>
            <div class="form-group">
              <label>Do & Don'ts (Batas Pribadi)</label>
              <textarea id="formDoAndDonts" rows="2" placeholder="Hal yang boleh & tidak boleh..."></textarea>
            </div>
            <div class="form-group">
              <label>Catatan Tambahan</label>
              <textarea id="formNotes" rows="2" placeholder="Catatan kepribadian, kesukaan..."></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" id="cancelModalBtn" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Kontak</button>
            </div>
          </form>
        </div>
      </div>
    `;

    bindEvents();
    initGraph();
  }

  const graphManager = createGraphManager(
    document.getElementById('cy'),
    (contact) => showDrawer(contact)
  );

  function initGraph() {
    const container = document.getElementById('cy');
    const graph = createGraphManager(container, (contact) => showDrawer(contact));
    graph.init(StorageManager.getContacts());
  }

  function showDrawer(contact) {
    selectedContact = contact;
    const drawer = document.getElementById('drawer');
    drawer.classList.remove('hidden');

    document.getElementById('drawerName').textContent = contact.name;
    document.getElementById('drawerAvatar').textContent = contact.name.charAt(0).toUpperCase();
    
    const badge = document.getElementById('drawerTierBadge');
    const tierInfo = TIER_CONFIG[contact.tier] || {};
    badge.textContent = tierInfo.name || contact.tier;
    badge.style.background = tierInfo.color || '#888';

    const waBtn = document.getElementById('waLink');
    if (contact.whatsappNumber) {
      waBtn.href = `https://wa.me/${contact.whatsappNumber}`;
      waBtn.style.display = 'inline-flex';
    } else {
      waBtn.style.display = 'none';
    }

    const igBtn = document.getElementById('igLink');
    if (contact.instagramHandle) {
      igBtn.href = `https://instagram.com/${contact.instagramHandle}`;
      igBtn.style.display = 'inline-flex';
    } else {
      igBtn.style.display = 'none';
    }

    document.getElementById('drawerHowToTreat').textContent = contact.attitudeGuide?.howToTreat || 'Belum ada catatan.';
    document.getElementById('drawerDoAndDonts').textContent = contact.attitudeGuide?.doAndDonts || 'Belum ada catatan.';
    document.getElementById('drawerNotes').textContent = contact.attitudeGuide?.notes || 'Belum ada catatan.';
  }

  function bindEvents() {
    document.getElementById('closeDrawer').onclick = () => {
      document.getElementById('drawer').classList.add('hidden');
    };

    document.getElementById('addBtn').onclick = () => {
      openModal();
    };

    document.getElementById('cancelModalBtn').onclick = () => {
      closeModal();
    };

    document.getElementById('exportBtn').onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(StorageManager.getContacts(), null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `social-affinity-export.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    };

    document.getElementById('deleteBtn').onclick = () => {
      if (selectedContact && confirm(`Yakin hapus ${selectedContact.name}?`)) {
        StorageManager.deleteContact(selectedContact.id);
        document.getElementById('drawer').classList.add('hidden');
        renderLayout();
      }
    };

    document.getElementById('editBtn').onclick = () => {
      if (selectedContact) {
        openModal(selectedContact);
      }
    };

    document.getElementById('contactForm').onsubmit = (e) => {
      e.preventDefault();
      const contactData = {
        id: document.getElementById('formId').value || undefined,
        name: document.getElementById('formName').value,
        tier: document.getElementById('formTier').value,
        whatsappNumber: document.getElementById('formWa').value,
        instagramHandle: document.getElementById('formIg').value,
        attitudeGuide: {
          howToTreat: document.getElementById('formHowToTreat').value,
          doAndDonts: document.getElementById('formDoAndDonts').value,
          notes: document.getElementById('formNotes').value
        }
      };

      StorageManager.saveContact(contactData);
      closeModal();
      renderLayout();
    };
  }

  function openModal(contact = null) {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    
    if (contact) {
      document.getElementById('modalTitle').textContent = 'Edit Kontak';
      document.getElementById('formId').value = contact.id;
      document.getElementById('formName').value = contact.name;
      document.getElementById('formTier').value = contact.tier;
      document.getElementById('formWa').value = contact.whatsappNumber || '';
      document.getElementById('formIg').value = contact.instagramHandle || '';
      document.getElementById('formHowToTreat').value = contact.attitudeGuide?.howToTreat || '';
      document.getElementById('formDoAndDonts').value = contact.attitudeGuide?.doAndDonts || '';
      document.getElementById('formNotes').value = contact.attitudeGuide?.notes || '';
    } else {
      document.getElementById('modalTitle').textContent = 'Tambah Kontak Baru';
      document.getElementById('contactForm').reset();
      document.getElementById('formId').value = '';
    }
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }

  renderLayout();
});
```

---

### Task 5: Build Verification & Final Polish

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Add Glassmorphism & Gaming Drawer styling to src/style.css**

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: rgba(16, 24, 40, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-glow);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo h1 {
  font-size: 1.2rem;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.capacity-gauge {
  display: flex;
  gap: 15px;
}

.gauge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.gauge-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.main-container {
  display: flex;
  height: calc(100vh - 65px);
  position: relative;
}

.cy-container {
  flex: 1;
  height: 100%;
  background: radial-gradient(circle at center, #141c2e 0%, #0b0f19 100%);
}

.drawer {
  width: 380px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border-left: 1px solid var(--border-glow);
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
}

.drawer.hidden, .modal.hidden {
  display: none;
}

.drawer-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.drawer-content {
  padding: 20px;
  overflow-y: auto;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #00f0ff, #7000ff);
  color: #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-danger {
  background: #ff2a6d;
  color: #fff;
}

.btn-wa {
  background: #25d366;
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
}

.btn-ig {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
}

.quick-links {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.guide-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  line-height: 1.4;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #0f172a;
  border: 1px solid var(--border-glow);
  padding: 24px;
  border-radius: 16px;
  width: 480px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group input, .form-group select, .form-group textarea {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}
```

- [ ] **Step 2: Build production bundle and verify**

Run: `npx vite build` in `/home/aizatfir/Project/social-affinity-network`
Expected: Clean build output in `dist/`.
