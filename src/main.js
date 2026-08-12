import { StorageManager } from './storage.js';
import { TIER_CONFIG } from './types.js';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';

import { renderOrbitDashboard } from './components/orbitDashboard.js';
import { renderFullscreenOrbit } from './components/fullscreenOrbit.js';
import { renderMyCircles } from './components/myCircles.js';
import { renderNetworkInsights } from './components/networkInsights.js';
import { renderKinshipProfileDrawer } from './components/kinshipProfile.js';
import { renderContactModal } from './components/contactModal.js';
import { renderBatchGroupingModal } from './components/batchGroupingModal.js';
import { renderSocialImportModal } from './components/socialImportModal.js';

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Application State
  let activeTab = 'orbit'; // 'orbit' | 'circles' | 'insights' | 'fullscreen'
  let selectedTierFilter = 'all';
  let searchQuery = '';
  let selectedContactId = null;
  let editingContact = null;
  let isModalOpen = false;
  let isBatchModalOpen = false;
  let isSocialModalOpen = false;
  let batchSelectedIds = new Set();
  let batchTargetTier = 'friends';
  let batchSearchFilter = '';
  let currentUser = null;
  let cloudUnsubscribe = null;

  // Initialize Auth Listener
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (cloudUnsubscribe) {
      cloudUnsubscribe();
      cloudUnsubscribe = null;
    }
    if (user) {
      cloudUnsubscribe = StorageManager.subscribeCloudSync(user.uid, () => {
        renderApp();
      });
    }
    renderApp();
  });

  function renderApp() {
    const contacts = StorageManager.getContacts();
    const selectedContact = contacts.find(c => c.id === selectedContactId) || null;

    app.innerHTML = `
      <div class="min-h-screen bg-canvas-parchment flex flex-col font-display text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
        
        <!-- Sticky Top Header Navbar (Apple Glass Panel) -->
        <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 product-shadow">
          <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
            
            <div class="flex items-center gap-3 cursor-pointer" id="brandLogo">
              <div class="w-10 h-10 rounded-2xl bg-slate-900 text-indigo-400 shadow-md flex items-center justify-center font-bold border border-slate-800">
                <span class="material-symbols-outlined text-2xl">blur_on</span>
              </div>
              <div>
                <h1 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Social Relation Manager</h1>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">SRM Intimacy & Dunbar Energy System</p>
              </div>
            </div>

            <!-- Top Actions -->
            <div class="flex items-center gap-2">
              ${'contacts' in navigator && 'Select' in window.ContactsManager ? `
                <button id="importContactsBtn" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full transition-all flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                  <span class="material-symbols-outlined text-sm">contacts</span>
                  <span class="hidden sm:inline">Import HP</span>
                </button>
              ` : ''}

              <button id="addContactBtn" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1 product-shadow">
                <span class="material-symbols-outlined text-sm">add</span>
                <span class="hidden sm:inline">Tambah Kontak</span>
              </button>

              <button id="authBtn" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                <span class="material-symbols-outlined text-sm">${currentUser ? 'lock' : 'vpn_key'}</span>
                <span>${currentUser ? 'Logout' : 'Login'}</span>
              </button>

              <button id="themeToggleBtn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
                <span class="material-symbols-outlined text-sm">dark_mode</span>
              </button>
            </div>

          </div>
        </header>

        <!-- Main Body View Area -->
        <main class="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 pb-28">
          ${renderActiveView(contacts)}
        </main>

        <!-- Fixed Bottom Navigation Bar (Stitch Floating Style) -->
        <nav class="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 py-3 px-6 z-40 product-shadow">
          <div class="max-w-md mx-auto flex justify-between items-center relative">
            
            <button data-tab="orbit" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'orbit' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-symbols-outlined text-xl">blur_on</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Orbit</span>
            </button>

            <button data-tab="circles" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'circles' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-symbols-outlined text-xl">groups</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Circles</span>
            </button>

            <!-- Floating Center Add Contact Action Button -->
            <div class="relative -top-6">
              <button id="floatingAddBtn" class="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center border-4 border-canvas-parchment dark:border-slate-900 hover:scale-105 transition-transform" title="Tambah Kontak">
                <span class="material-symbols-outlined text-3xl">add</span>
              </button>
            </div>

            <button data-tab="fullscreen" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'fullscreen' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-symbols-outlined text-xl">fullscreen</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Canvas</span>
            </button>

            <button data-tab="insights" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'insights' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-symbols-outlined text-xl">insights</span>
              <span class="text-[10px] font-bold uppercase tracking-widest">Stats</span>
            </button>

          </div>
        </nav>

        <!-- Slide-over Kinship Profile Drawer -->
        ${selectedContact ? renderKinshipProfileDrawer(selectedContact) : ''}

        <!-- Add/Edit Contact Modal -->
        ${isModalOpen ? renderContactModal(editingContact) : ''}

        <!-- Batch Grouping Transfer Modal -->
        ${isBatchModalOpen ? renderBatchGroupingModal(contacts, batchSelectedIds, batchTargetTier, batchSearchFilter) : ''}

        <!-- Social / LinkedIn Import Modal -->
        ${isSocialModalOpen ? renderSocialImportModal() : ''}

      </div>
    `;

    attachEventListeners();
  }

  function renderActiveView(contacts) {
    switch (activeTab) {
      case 'orbit':
        return renderOrbitDashboard(contacts, selectedTierFilter, searchQuery);
      case 'fullscreen':
        return renderFullscreenOrbit(contacts);
      case 'circles':
        return renderMyCircles(contacts);
      case 'insights':
        return renderNetworkInsights(contacts);
      default:
        return renderOrbitDashboard(contacts, selectedTierFilter, searchQuery);
    }
  }

  function attachEventListeners() {
    // Brand click returns to main orbit
    document.getElementById('brandLogo')?.addEventListener('click', () => {
      activeTab = 'orbit';
      renderApp();
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });

    // Navigation Tab Switching
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab) {
          activeTab = tab;
          renderApp();
        }
      });
    });

    // Dashboard & Circles Buttons
    document.getElementById('btnOpenCircles')?.addEventListener('click', () => {
      activeTab = 'circles';
      renderApp();
    });

    // Filter Chips
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedTierFilter = e.currentTarget.getAttribute('data-filter') || 'all';
        renderApp();
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
      });
    }

    // Contact Avatar Click (Opens Profile Drawer)
    document.querySelectorAll('.contact-orbit-avatar, .contact-chip-item').forEach(elem => {
      elem.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-contact-id');
        if (id) {
          selectedContactId = id;
          renderApp();
        }
      });
    });

    // Drawer Controls
    document.getElementById('btnCloseDrawer')?.addEventListener('click', () => {
      selectedContactId = null;
      renderApp();
    });
    document.getElementById('profileDrawerBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'profileDrawerBackdrop') {
        selectedContactId = null;
        renderApp();
      }
    });

    // Sub-Task Checklist (Google Tasks Style)
    document.querySelectorAll('.task-toggle-checkbox').forEach(cb => {
      cb.addEventListener('change', async (e) => {
        const taskId = e.target.getAttribute('data-task-id');
        const contacts = StorageManager.getContacts();
        const contact = contacts.find(c => c.id === selectedContactId);
        if (contact && contact.attitudeTasks) {
          const task = contact.attitudeTasks.find(t => t.id === taskId);
          if (task) {
            task.isDone = e.target.checked;
            await StorageManager.saveContact(contact, currentUser?.uid);
            renderApp();
          }
        }
      });
    });

    document.querySelectorAll('.btn-delete-task').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const taskId = e.currentTarget.getAttribute('data-task-id');
        const contacts = StorageManager.getContacts();
        const contact = contacts.find(c => c.id === selectedContactId);
        if (contact && contact.attitudeTasks) {
          contact.attitudeTasks = contact.attitudeTasks.filter(t => t.id !== taskId);
          await StorageManager.saveContact(contact, currentUser?.uid);
          renderApp();
        }
      });
    });

    document.getElementById('formAddAttitudeTask')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('inputNewTaskText');
      const text = input ? input.value.trim() : '';
      if (text && selectedContactId) {
        const contacts = StorageManager.getContacts();
        const contact = contacts.find(c => c.id === selectedContactId);
        if (contact) {
          contact.attitudeTasks = contact.attitudeTasks || [];
          contact.attitudeTasks.push({
            id: Date.now().toString(),
            text,
            isDone: false
          });
          await StorageManager.saveContact(contact, currentUser?.uid);
          renderApp();
        }
      }
    });

    // Edit Contact
    document.getElementById('btnEditContact')?.addEventListener('click', () => {
      const contacts = StorageManager.getContacts();
      editingContact = contacts.find(c => c.id === selectedContactId) || null;
      selectedContactId = null;
      isModalOpen = true;
      renderApp();
    });

    // Delete Contact
    document.getElementById('btnDeleteContact')?.addEventListener('click', async () => {
      if (selectedContactId && confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
        await StorageManager.deleteContact(selectedContactId, currentUser?.uid);
        selectedContactId = null;
        renderApp();
      }
    });

    // Add/Edit Contact Modal Controls & Backdrop Listener
    const closeModal = () => {
      isModalOpen = false;
      editingContact = null;
      renderApp();
    };

    const openAddModal = () => {
      editingContact = null;
      isModalOpen = true;
      renderApp();
    };

    document.getElementById('addContactBtn')?.addEventListener('click', openAddModal);
    document.getElementById('floatingAddBtn')?.addEventListener('click', openAddModal);
    document.getElementById('btnCloseModal')?.addEventListener('click', closeModal);
    document.getElementById('btnCancelModal')?.addEventListener('click', closeModal);
    
    document.getElementById('contactModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'contactModalBackdrop') {
        closeModal();
      }
    });

    // Avatar Vector Preset Buttons inside Add Contact Modal
    document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const symbol = e.currentTarget.getAttribute('data-avatar');
        const hiddenInput = document.getElementById('selectedAvatarInput');
        if (hiddenInput && symbol) {
          hiddenInput.value = symbol;
          document.querySelectorAll('.avatar-preset-btn').forEach(b => {
            b.classList.remove('border-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-950', 'scale-110', 'text-indigo-600', 'dark:text-indigo-400');
            b.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
          });
          e.currentTarget.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
          e.currentTarget.classList.add('border-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-950', 'scale-110', 'text-indigo-600', 'dark:text-indigo-400');
        }
      });
    });

    // Batch Modal Controls
    const openBatchModal = () => {
      batchSelectedIds.clear();
      isBatchModalOpen = true;
      renderApp();
    };
    document.getElementById('btnOpenBatchModal')?.addEventListener('click', openBatchModal);
    document.getElementById('btnOpenBatchModalTop')?.addEventListener('click', openBatchModal);
    document.getElementById('btnCloseBatchModal')?.addEventListener('click', () => {
      isBatchModalOpen = false;
      renderApp();
    });
    document.getElementById('batchModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'batchModalBackdrop') {
        isBatchModalOpen = false;
        renderApp();
      }
    });

    document.getElementById('batchTargetTierSelect')?.addEventListener('change', (e) => {
      batchTargetTier = e.target.value;
    });

    document.getElementById('batchSearchInput')?.addEventListener('input', (e) => {
      batchSearchFilter = e.target.value;
      renderApp();
    });

    document.getElementById('btnToggleSelectAll')?.addEventListener('click', () => {
      const contacts = StorageManager.getContacts();
      let list = contacts;
      if (batchSearchFilter.trim()) {
        const q = batchSearchFilter.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q));
      }
      if (batchSelectedIds.size === list.length && list.length > 0) {
        batchSelectedIds.clear();
      } else {
        list.forEach(c => batchSelectedIds.add(c.id));
      }
      renderApp();
    });

    document.querySelectorAll('.batch-contact-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.checked) {
          batchSelectedIds.add(id);
        } else {
          batchSelectedIds.delete(id);
        }
      });
    });

    document.getElementById('btnSubmitBatchMove')?.addEventListener('click', async () => {
      if (batchSelectedIds.size > 0) {
        const contacts = StorageManager.getContacts();
        for (const id of batchSelectedIds) {
          const contact = contacts.find(c => c.id === id);
          if (contact) {
            contact.tier = batchTargetTier;
            contact.attitudeTasks = TIER_CONFIG[batchTargetTier]?.defaultTasks || [];
            await StorageManager.saveContact(contact, currentUser?.uid);
          }
        }
        isBatchModalOpen = false;
        batchSelectedIds.clear();
        renderApp();
      }
    });

    // Social Import Modal Controls
    const openSocialModal = () => {
      isSocialModalOpen = true;
      renderApp();
    };
    document.getElementById('btnOpenSocialModal')?.addEventListener('click', openSocialModal);
    document.getElementById('btnOpenSocialModalTop')?.addEventListener('click', openSocialModal);
    document.getElementById('btnCloseSocialModal')?.addEventListener('click', () => {
      isSocialModalOpen = false;
      renderApp();
    });
    document.getElementById('socialModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'socialModalBackdrop') {
        isSocialModalOpen = false;
        renderApp();
      }
    });

    document.getElementById('btnSubmitSocialImport')?.addEventListener('click', async () => {
      const input = document.getElementById('socialImportInput');
      const targetTierSelect = document.getElementById('socialTargetTierSelect');
      const raw = input ? input.value.trim() : '';
      const tier = targetTierSelect ? targetTierSelect.value : 'acquaintances';

      if (raw) {
        const lines = raw.split('\n');
        for (const line of lines) {
          const text = line.trim();
          if (!text) continue;
          const parts = text.split(',');
          const name = parts[0].trim();
          const instagram = parts.length > 1 ? parts[1].trim() : '';
          const initials = (name.split(' ').length >= 2 ? name.split(' ')[0][0] + name.split(' ')[1][0] : name.substring(0, 2)).toUpperCase();

          await StorageManager.saveContact({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
            name,
            avatar: 'work',
            initials,
            tier,
            phone: '',
            instagram,
            whatsappNumber: '',
            instagramHandle: instagram,
            notes: 'Diimpor dari LinkedIn / Social Followers',
            attitudeTasks: TIER_CONFIG[tier]?.defaultTasks || []
          }, currentUser?.uid);
        }
        isSocialModalOpen = false;
        renderApp();
      }
    });

    // Contact Form Submit Modal
    document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const tier = formData.get('tier');
      const phoneVal = formData.get('phone') || formData.get('whatsappNumber') || '';
      const igVal = formData.get('instagram') || formData.get('instagramHandle') || '';
      const nameVal = formData.get('name') || '';

      const parts = nameVal.trim().split(' ');
      const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : nameVal.substring(0, 2).toUpperCase();

      const contactData = {
        id: formData.get('id') || Date.now().toString(),
        name: nameVal,
        avatar: formData.get('avatar') || 'person',
        initials,
        tier,
        phone: phoneVal,
        whatsappNumber: phoneVal,
        instagram: igVal,
        instagramHandle: igVal,
        notes: formData.get('notes') || '',
        attitudeTasks: editingContact?.attitudeTasks || TIER_CONFIG[tier]?.defaultTasks || [],
        createdAt: editingContact?.createdAt || new Date().toISOString()
      };

      await StorageManager.saveContact(contactData, currentUser?.uid);
      isModalOpen = false;
      editingContact = null;
      renderApp();
    });

    // Fullscreen view back button
    document.getElementById('btnCloseFullscreen')?.addEventListener('click', () => {
      activeTab = 'orbit';
      renderApp();
    });

    // Auth Button
    document.getElementById('authBtn')?.addEventListener('click', async () => {
      if (currentUser) {
        await signOut(auth);
      } else {
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (err) {
          console.warn('Auth popup error:', err);
        }
      }
    });
  }

  // Initial Render
  renderApp();
});
