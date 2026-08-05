import { StorageManager } from './storage.js';
import { createGraphManager } from './graph.js';
import { TIER_CONFIG, AVATAR_PRESETS } from './types.js';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  let selectedContact = null;
  let selectedAvatarEmoji = '🍎';
  let currentUser = null;
  let cloudUnsubscribe = null;
  let graphManager = null;

  function renderTaskChecklistHtml(text) {
    if (!text || !text.trim()) return '<div class="empty-guide">Belum ada catatan.</div>';
    
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    return `
      <ul class="task-list">
        ${lines.map(line => {
          let badgeClass = 'priority-normal';
          if (line.includes('🔥') || line.includes('[Tinggi]')) badgeClass = 'priority-high';
          else if (line.includes('⚡') || line.includes('[Sedang]')) badgeClass = 'priority-medium';
          else if (line.includes('✅')) badgeClass = 'task-do';
          else if (line.includes('❌')) badgeClass = 'task-dont';

          return `
            <li class="task-item ${badgeClass}">
              <span class="task-bullet"></span>
              <span class="task-text">${escapeHtml(line)}</span>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderLayout() {
    const stats = StorageManager.getCapacityStats();
    
    app.innerHTML = `
      <header class="navbar">
        <div class="logo">
          <div class="logo-badge">🌌</div>
          <h1>Social Affinity Network</h1>
        </div>
        
        <div class="capacity-gauge">
          ${Object.entries(stats).map(([key, s]) => `
            <div class="gauge-item" title="${s.name} (Rekomendasi Kapasitas: ${s.recMax})">
              <span class="dot" style="background: ${s.color}; color: ${s.color}"></span>
              <span class="label">${s.name.split(' ')[0]}: ${s.count} <small style="opacity:0.7">(Rec: ${s.recMax})</small></span>
            </div>
          `).join('')}
        </div>

        <div class="actions">
          <button id="importContactsBtn" class="btn btn-secondary" style="border-color:#00f0ff; color:#00f0ff;">📱 Load Kontak HP</button>
          <button id="addBtn" class="btn btn-primary">+ Tambah Teman</button>
          <button id="exportBtn" class="btn btn-secondary">Export JSON</button>
          <button id="authBtn" class="btn btn-secondary">${currentUser ? '🔒 Logout' : '🔑 Login Google'}</button>
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
              <a id="waLink" href="#" target="_blank" class="btn-wa">💬 WhatsApp</a>
              <a id="igLink" href="#" target="_blank" class="btn-ig">📸 Instagram</a>
            </div>

            <div class="guide-section">
              <h3>🎯 Prioritas & Cara Bersikap</h3>
              <div id="drawerHowToTreat" class="guide-box"></div>
            </div>

            <div class="guide-section">
              <h3>⚡ Checklist Do & Don'ts</h3>
              <div id="drawerDoAndDonts" class="guide-box"></div>
            </div>

            <div class="guide-section">
              <h3>📝 Catatan & Detail</h3>
              <div id="drawerNotes" class="guide-box"></div>
            </div>

            <div class="drawer-actions">
              <button id="editBtn" class="btn btn-secondary" style="flex:1">Edit Kontak</button>
              <button id="deleteBtn" class="btn btn-danger" style="flex:1">Hapus</button>
            </div>
          </div>
        </aside>
      </main>

      <!-- File input for CSV/VCF Contact Import -->
      <input type="file" id="vcfFileInput" accept=".vcf,.csv,.json" style="display:none;">

      <!-- Apple Glass Form Modal -->
      <div id="modal" class="modal hidden">
        <div class="modal-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h2 id="modalTitle" style="margin:0;">Tambah Kontak Baru</h2>
            <button type="button" id="loadTemplateBtn" class="btn btn-secondary" style="font-size:0.78rem; padding:4px 10px;">✨ Isi Template Prioritas</button>
          </div>
          
          <form id="contactForm">
            <input type="hidden" id="formId">
            
            <div class="form-group">
              <label>Pilih Avatar / Icon Profile (Buah & Kategori)</label>
              <div class="avatar-grid" id="avatarGrid">
                ${AVATAR_PRESETS.map(a => `
                  <button type="button" class="avatar-opt ${a.emoji === selectedAvatarEmoji ? 'selected' : ''}" data-emoji="${a.emoji}" title="${a.label}">
                    ${a.emoji}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="form-group">
              <label>Nama / Panggilan</label>
              <input type="text" id="formName" required placeholder="Contoh: Sarah">
            </div>
            <div class="form-group">
              <label>Kategori Affinity (Tier & Rekomendasi)</label>
              <select id="formTier">
                ${Object.entries(TIER_CONFIG).map(([k, v]) => `
                  <option value="${k}">${v.name} (${v.description})</option>
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
              <label>Prioritas & Cara Bersikap (Gunakan baris baru untuk tiap poin)</label>
              <textarea id="formHowToTreat" rows="3" placeholder="🔥 [Tinggi] Tanyakan kabar harian...&#10;⚡ [Sedang] Apresiasi usaha..."></textarea>
            </div>
            <div class="form-group">
              <label>Checklist Do & Don'ts (Gunakan baris baru)</label>
              <textarea id="formDoAndDonts" rows="3" placeholder="✅ DO: Kirim ucapan selamat pagi...&#10;❌ DONT: Membahas masalah berat saat lelah..."></textarea>
            </div>
            <div class="form-group">
              <label>Catatan & Detail Tambahan</label>
              <textarea id="formNotes" rows="3" placeholder="📌 Suka es krim matcha...&#10;📌 Tanggal Ultah..."></textarea>
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

  function initGraph() {
    const container = document.getElementById('cy');
    graphManager = createGraphManager(container, (contact) => showDrawer(contact));
    
    // Update center node ME if logged in
    const contacts = StorageManager.getContacts();
    graphManager.init(contacts);
  }

  function showDrawer(contact) {
    selectedContact = contact;
    const drawer = document.getElementById('drawer');
    drawer.classList.remove('hidden');

    document.getElementById('drawerName').textContent = contact.name;
    document.getElementById('drawerAvatar').textContent = contact.avatar || '🍎';
    
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

    document.getElementById('drawerHowToTreat').innerHTML = renderTaskChecklistHtml(contact.attitudeGuide?.howToTreat);
    document.getElementById('drawerDoAndDonts').innerHTML = renderTaskChecklistHtml(contact.attitudeGuide?.doAndDonts);
    document.getElementById('drawerNotes').innerHTML = renderTaskChecklistHtml(contact.attitudeGuide?.notes);
  }

  function applyTierTemplate(tierKey) {
    const config = TIER_CONFIG[tierKey];
    if (config && config.template) {
      document.getElementById('formHowToTreat').value = config.template.howToTreat;
      document.getElementById('formDoAndDonts').value = config.template.doAndDonts;
      document.getElementById('formNotes').value = config.template.notes;
    }
  }

  async function handleLoadDeviceContacts() {
    if ('contacts' in navigator && 'Select' in window.ContactsManager) {
      try {
        const props = ['name', 'tel', 'email'];
        const contacts = await navigator.contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          contacts.forEach(c => {
            const name = c.name?.[0] || 'Kontak Baru';
            const tel = c.tel?.[0]?.replace(/[^0-9]/g, '') || '';
            StorageManager.saveContact({
              name,
              avatar: '📱',
              tier: 'friends',
              whatsappNumber: tel,
              instagramHandle: '',
              attitudeGuide: {
                howToTreat: TIER_CONFIG.friends.template.howToTreat,
                doAndDonts: TIER_CONFIG.friends.template.doAndDonts,
                notes: 'Diimpor dari HP / Device'
              }
            }, currentUser?.uid);
          });
          renderLayout();
          alert(`Berhasil mengimpor ${contacts.length} kontak dari HP!`);
          return;
        }
      } catch (err) {
        console.warn('Contact picker fallback:', err);
      }
    }
    // Fallback to file picker for CSV / VCF
    document.getElementById('vcfFileInput').click();
  }

  function parseVcfOrCsvFile(fileText) {
    const lines = fileText.split('\n');
    let importedCount = 0;

    lines.forEach(line => {
      if (line.startsWith('FN:') || line.startsWith('N:')) {
        const name = line.replace(/^(FN:|N:)/, '').trim();
        if (name) {
          StorageManager.saveContact({
            name,
            avatar: '👤',
            tier: 'acquaintances',
            whatsappNumber: '',
            instagramHandle: '',
            attitudeGuide: {
              howToTreat: TIER_CONFIG.acquaintances.template.howToTreat,
              doAndDonts: TIER_CONFIG.acquaintances.template.doAndDonts,
              notes: 'Diimpor dari file VCF/CSV'
            }
          }, currentUser?.uid);
          importedCount++;
        }
      }
    });

    renderLayout();
    alert(`Berhasil membaca & mengimpor ${importedCount || 1} kontak dari file!`);
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

    document.getElementById('importContactsBtn').onclick = () => {
      handleLoadDeviceContacts();
    };

    document.getElementById('vcfFileInput').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => parseVcfOrCsvFile(evt.target.result);
        reader.readAsText(file);
      }
    };

    document.getElementById('authBtn').onclick = async () => {
      if (currentUser) {
        await signOut(auth);
        alert('Sudah Logout.');
      } else {
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (err) {
          alert('Login Google: ' + err.message);
        }
      }
    };

    document.getElementById('loadTemplateBtn').onclick = () => {
      const tierKey = document.getElementById('formTier').value;
      applyTierTemplate(tierKey);
    };

    document.getElementById('formTier').onchange = (e) => {
      const currentHowTo = document.getElementById('formHowToTreat').value;
      if (!currentHowTo.trim()) {
        applyTierTemplate(e.target.value);
      }
    };

    const avatarGrid = document.getElementById('avatarGrid');
    avatarGrid.onclick = (e) => {
      const btn = e.target.closest('.avatar-opt');
      if (btn) {
        avatarGrid.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAvatarEmoji = btn.dataset.emoji;
      }
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
        StorageManager.deleteContact(selectedContact.id, currentUser?.uid);
        document.getElementById('drawer').classList.add('hidden');
        renderLayout();
      }
    };

    document.getElementById('editBtn').onclick = () => {
      if (selectedContact) {
        openModal(selectedContact);
      }
    };

    document.getElementById('contactForm').onsubmit = async (e) => {
      e.preventDefault();
      const contactData = {
        id: document.getElementById('formId').value || undefined,
        name: document.getElementById('formName').value,
        avatar: selectedAvatarEmoji,
        tier: document.getElementById('formTier').value,
        whatsappNumber: document.getElementById('formWa').value,
        instagramHandle: document.getElementById('formIg').value,
        attitudeGuide: {
          howToTreat: document.getElementById('formHowToTreat').value,
          doAndDonts: document.getElementById('formDoAndDonts').value,
          notes: document.getElementById('formNotes').value
        }
      };

      await StorageManager.saveContact(contactData, currentUser?.uid);
      closeModal();
      renderLayout();
    };

    window.onkeydown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.getElementById('drawer').classList.add('hidden');
      }
    };

    document.getElementById('modal').onclick = (e) => {
      if (e.target.id === 'modal') {
        closeModal();
      }
    };
  }

  function openModal(contact = null) {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    
    if (contact) {
      document.getElementById('modalTitle').textContent = 'Edit Kontak';
      document.getElementById('formId').value = contact.id;
      document.getElementById('formName').value = contact.name;
      selectedAvatarEmoji = contact.avatar || '🍎';
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
      selectedAvatarEmoji = '🍎';
      applyTierTemplate('lovers');
    }

    const avatarGrid = document.getElementById('avatarGrid');
    if (avatarGrid) {
      avatarGrid.querySelectorAll('.avatar-opt').forEach(b => {
        if (b.dataset.emoji === selectedAvatarEmoji) {
          b.classList.add('selected');
        } else {
          b.classList.remove('selected');
        }
      });
    }
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }

  // Listen for Auth Session Changes
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (cloudUnsubscribe) {
      cloudUnsubscribe();
      cloudUnsubscribe = null;
    }

    if (user) {
      cloudUnsubscribe = StorageManager.subscribeCloudSync(user.uid, (cloudContacts) => {
        renderLayout();
      });
    }
    renderLayout();
  });

  renderLayout();
});
