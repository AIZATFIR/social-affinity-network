import { StorageManager } from './storage.js';
import { TIER_CONFIG } from './types.js';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';

import { renderOrbitDashboard } from './components/orbitDashboard.js';
import { renderFullscreenOrbit } from './components/fullscreenOrbit.js';
import { renderMyCircles } from './components/myCircles.js';
import { renderNetworkInsights } from './components/networkInsights.js';
import { renderKinshipProfileDrawer } from './components/kinshipProfile.js';
import { renderContactModal } from './components/contactModal.js';

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
    const stats = StorageManager.getCapacityStats();
    const selectedContact = contacts.find(c => c.id === selectedContactId) || null;

    app.innerHTML = `
      <div class="min-h-screen bg-parchment flex flex-col font-display text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
        
        <!-- Sticky Top Header Navbar -->
        <header class="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
          <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
            
            <div class="flex items-center gap-3 cursor-pointer" id="brandLogo">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-500/30 flex items-center justify-center text-white text-xl font-bold">
                🌌
              </div>
              <div>
                <h1 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Social Circle Manager</h1>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Dunbar's Kinship Orbit System</p>
              </div>
            </div>

            <!-- Top Actions -->
            <div class="flex items-center gap-2">
              ${'contacts' in navigator && 'Select' in window.ContactsManager ? `
                <button id="importContactsBtn" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-2xl transition-all flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                  <span class="material-icons text-sm">contacts</span>
                  <span class="hidden sm:inline">Import HP</span>
                </button>
              ` : ''}

              <button id="addContactBtn" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1">
                <span class="material-icons text-base">add</span>
                <span class="hidden sm:inline">Tambah Teman</span>
              </button>

              <button id="authBtn" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-2xl transition-all flex items-center gap-1">
                <span class="material-icons text-sm">${currentUser ? 'lock' : 'vpn_key'}</span>
                <span>${currentUser ? 'Logout' : 'Login'}</span>
              </button>

              <button id="themeToggleBtn" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-all">
                <span class="material-icons text-sm">dark_mode</span>
              </button>
            </div>

          </div>
        </header>

        <!-- Main Body View Area -->
        <main class="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 pb-28">
          ${renderActiveView(contacts)}
        </main>

        <!-- Fixed Bottom Navigation Bar -->
        <nav class="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 py-2.5 px-6 z-40">
          <div class="max-w-md mx-auto flex justify-around items-center">
            
            <button data-tab="orbit" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'orbit' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-icons text-xl">blur_on</span>
              <span class="text-[10px] uppercase tracking-wider">Orbit</span>
            </button>

            <button data-tab="fullscreen" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'fullscreen' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-icons text-xl">fullscreen</span>
              <span class="text-[10px] uppercase tracking-wider">Canvas</span>
            </button>

            <button data-tab="circles" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'circles' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-icons text-xl">groups</span>
              <span class="text-[10px] uppercase tracking-wider">Circles</span>
            </button>

            <button data-tab="insights" class="nav-tab-btn flex flex-col items-center gap-1 ${activeTab === 'insights' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}">
              <span class="material-icons text-xl">analytics</span>
              <span class="text-[10px] uppercase tracking-wider">Stats</span>
            </button>

          </div>
        </nav>

        <!-- Slide-over Kinship Profile Drawer -->
        ${selectedContact ? renderKinshipProfileDrawer(selectedContact) : ''}

        <!-- Add/Edit Contact Modal -->
        ${isModalOpen ? renderContactModal(editingContact) : ''}

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

    // Dashboard Buttons
    document.getElementById('btnOpenCircles')?.addEventListener('click', () => {
      activeTab = 'circles';
      renderApp();
    });
    document.getElementById('btnOpenInsights')?.addEventListener('click', () => {
      activeTab = 'insights';
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
        const container = document.querySelector('.orbit-container');
        if (container) {
          const contacts = StorageManager.getContacts();
          const lovers = contacts.filter(c => c.tier === 'lovers');
          const closeFriends = contacts.filter(c => c.tier === 'close_friends');
          const family = contacts.filter(c => c.tier === 'family');
          const friends = contacts.filter(c => c.tier === 'friends');
          const acquaintances = contacts.filter(c => c.tier === 'acquaintances');
        }
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

    // Modal Controls
    document.getElementById('addContactBtn')?.addEventListener('click', () => {
      editingContact = null;
      isModalOpen = true;
      renderApp();
    });
    document.getElementById('btnQuickAdd')?.addEventListener('click', () => {
      editingContact = null;
      isModalOpen = true;
      renderApp();
    });
    document.getElementById('btnCloseModal')?.addEventListener('click', () => {
      isModalOpen = false;
      editingContact = null;
      renderApp();
    });
    document.getElementById('btnCancelModal')?.addEventListener('click', () => {
      isModalOpen = false;
      editingContact = null;
      renderApp();
    });

    // Avatar Selector in Modal
    document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const emoji = e.currentTarget.getAttribute('data-avatar');
        document.querySelectorAll('.avatar-preset-btn').forEach(b => {
          b.classList.remove('border-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-950', 'scale-110');
          b.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-800');
        });
        e.currentTarget.classList.add('border-indigo-600', 'bg-indigo-50', 'dark:bg-indigo-950', 'scale-110');
        const input = document.getElementById('selectedAvatarInput');
        if (input) input.value = emoji;
      });
    });

    // Contact Form Submit
    document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const contactData = {
        id: formData.get('id') || Date.now().toString(),
        name: formData.get('name'),
        avatar: formData.get('avatar') || '🍎',
        tier: formData.get('tier'),
        whatsappNumber: formData.get('whatsappNumber'),
        instagramHandle: formData.get('instagramHandle'),
        attitudeGuide: {
          howToTreat: formData.get('howToTreat') || TIER_CONFIG[formData.get('tier')]?.template.howToTreat,
          doAndDonts: TIER_CONFIG[formData.get('tier')]?.template.doAndDonts,
          notes: formData.get('notes') || TIER_CONFIG[formData.get('tier')]?.template.notes
        },
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

    // Import Contacts from Device
    document.getElementById('importContactsBtn')?.addEventListener('click', async () => {
      if ('contacts' in navigator && 'Select' in window.ContactsManager) {
        try {
          const props = ['name', 'tel'];
          const opts = { multiple: true };
          const imported = await navigator.contacts.select(props, opts);
          if (imported && imported.length > 0) {
            for (const item of imported) {
              const name = item.name ? item.name[0] : 'Kontak HP';
              const tel = item.tel ? item.tel[0] : '';
              await StorageManager.saveContact({
                name,
                avatar: '📱',
                tier: 'friends',
                whatsappNumber: tel,
                instagramHandle: '',
                attitudeGuide: TIER_CONFIG.friends.template
              }, currentUser?.uid);
            }
            renderApp();
          }
        } catch (e) {
          console.warn('Import error:', e);
        }
      }
    });
  }

  // Initial Render
  renderApp();
});
