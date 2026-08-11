import { TIER_CONFIG } from '../types.js';

function getOrbitPosition(index, total, ringPercentage) {
  const angle = (index / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
  const radius = ringPercentage / 2;
  const left = 50 + radius * Math.cos(angle);
  const top = 50 + radius * Math.sin(angle);
  return { left: `${left}%`, top: `${top}%` };
}

export function renderOrbitDashboard(contacts, selectedTierFilter, searchQuery) {
  let filtered = contacts;
  if (selectedTierFilter && selectedTierFilter !== 'all') {
    filtered = filtered.filter(c => c.tier === selectedTierFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.notes && c.notes.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(query))
    );
  }

  const lovers = contacts.filter(c => c.tier === 'lovers');
  const closeFriends = contacts.filter(c => c.tier === 'close_friends');
  const family = contacts.filter(c => c.tier === 'family');
  const friends = contacts.filter(c => c.tier === 'friends');
  const acquaintances = contacts.filter(c => c.tier === 'acquaintances');

  const totalContacts = contacts.length;
  const maxCapacity = 1666; // Dunbar total limit sum (1+5+10+150+1500)

  return `
    <div class="max-w-md md:max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      <!-- Search & Quick Action Controls Bar -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow space-y-3">
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              id="searchInput"
              value="${escapeHtml(searchQuery || '')}"
              placeholder="Cari nama, WhatsApp, atau catatan..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button id="btnOpenBatchModalTop" class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-all border border-indigo-200 dark:border-indigo-800 flex items-center justify-center" title="Pindah Batch">
            <span class="material-symbols-outlined text-lg">swap_horiz</span>
          </button>
          <button id="btnOpenSocialModalTop" class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-all border border-indigo-200 dark:border-indigo-800 flex items-center justify-center" title="Import Social / LinkedIn">
            <span class="material-symbols-outlined text-lg">share</span>
          </button>
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button data-filter="all" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedTierFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
            All Circles (${contacts.length})
          </button>
          ${Object.entries(TIER_CONFIG).map(([key, config]) => {
            const count = contacts.filter(c => c.tier === key).length;
            const isActive = selectedTierFilter === key;
            return `
              <button data-filter="${key}" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                <span class="material-symbols-outlined text-sm">${config.icon}</span>
                <span>${config.name.split('/')[0].trim()}</span>
                <span class="opacity-75">(${count})</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Concentric Orbit Ring Container (Stitch Canvas Style) -->
      <div class="relative py-4">
        <div class="orbit-container w-full max-w-[360px] md:max-w-[440px] mx-auto flex items-center justify-center">
          
          <!-- Ring 5: Acquaintances / Network (1500) -->
          <div class="ring w-full h-full bg-slate-500/10 dark:bg-blue-500/5"></div>
          
          <!-- Ring 4: Friends (150) -->
          <div class="ring w-[78%] h-[78%] bg-indigo-500/15 dark:bg-indigo-500/10"></div>
          
          <!-- Ring 3: Family (10) -->
          <div class="ring w-[56%] h-[56%] bg-emerald-500/15 dark:bg-emerald-500/10"></div>
          
          <!-- Ring 2: Close Friends (5) -->
          <div class="ring w-[36%] h-[36%] bg-amber-500/20 dark:bg-amber-500/15"></div>

          <!-- Ring 1: Intimate / Lovers (1) -->
          <div class="ring w-[20%] h-[20%] bg-rose-500/25 dark:bg-rose-500/20"></div>

          <!-- Center Node: YOU -->
          <div class="relative z-10 w-14 h-14 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 shadow-xl flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform" style="box-shadow: 0 0 25px rgba(255, 204, 0, 0.4);" title="Pusat Energi Sosialisasi (YOU)">
            <span class="material-symbols-outlined text-2xl">account_circle</span>
          </div>

          <!-- Floating Orbit Avatars -->
          ${renderOrbitAvatars(filtered, lovers, closeFriends, family, friends, acquaintances)}

        </div>
      </div>

      <!-- Bento Grid Utility Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2 product-shadow">
          <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">schema</span> Dunbar Capacity
          </p>
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Limit Kognitif 1500
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Menjaga energi emosional agar tidak burnout.
          </p>
        </div>

        <div class="p-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2 product-shadow">
          <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">hub</span> Growth Map
          </p>
          <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Balanced Distribution
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            ${totalContacts > 0 ? `${totalContacts} kontak terdistribusi.` : 'Tambahkan kontak untuk memulai.'}
          </p>
        </div>
      </div>

      <!-- Dunbar Slot Capacity Summary Card -->
      <section class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl product-shadow border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>Dunbar Circles Summary</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Ringkasan Kapasitas Orbit Sosialisasi</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            ${totalContacts} / ${maxCapacity} Max
          </span>
        </div>

        <div class="space-y-4 pt-1">
          ${Object.entries(TIER_CONFIG).map(([key, config]) => {
            const count = contacts.filter(c => c.tier === key).length;
            const percent = Math.min(Math.round((count / config.recMax) * 100), 100);
            return `
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${config.color}"></div>
                <div class="flex-1">
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm">${config.icon}</span> ${config.name}
                    </span>
                    <span class="text-slate-500 dark:text-slate-400">${count} / ${config.recMax}</span>
                  </div>
                  <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${config.color}"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button id="btnOpenCircles" class="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all product-shadow flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">tune</span>
          <span>Kelola Lingkaran Sosial</span>
        </button>
      </section>

    </div>
  `;
}

function renderOrbitAvatars(filteredContacts, lovers, closeFriends, family, friends, acquaintances) {
  if (filteredContacts.length === 0) {
    return `
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-2xl product-shadow border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500">
          Tidak ada kontak yang cocok
        </div>
      </div>
    `;
  }

  const renderTierAvatars = (groupList, ringPercentage) => {
    return groupList.map((contact, idx) => {
      if (!filteredContacts.some(c => c.id === contact.id)) return '';
      const pos = getOrbitPosition(idx, groupList.length, ringPercentage);
      const delay = (idx * 0.4) % 3;
      const initials = getContactInitials(contact);

      return `
        <div 
          data-contact-id="${contact.id}"
          class="contact-orbit-avatar absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 hover:scale-125 hover:z-30 transition-all duration-300 animate-float"
          style="left: ${pos.left}; top: ${pos.top}; animation-delay: ${delay}s;"
          title="${escapeHtml(contact.name)} (${TIER_CONFIG[contact.tier]?.name || ''})"
        >
          <div class="relative group">
            <div class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-slate-800 border-2 product-shadow flex items-center justify-center font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 overflow-hidden" style="border-color: ${TIER_CONFIG[contact.tier]?.color || '#0066cc'}">
              ${contact.avatar && isSymbol(contact.avatar) ? `<span class="material-symbols-outlined text-base">${contact.avatar}</span>` : `<span>${initials}</span>`}
            </div>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg z-40 pointer-events-none">
              ${escapeHtml(contact.name)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  return `
    ${renderTierAvatars(lovers, 20)}
    ${renderTierAvatars(closeFriends, 36)}
    ${renderTierAvatars(family, 56)}
    ${renderTierAvatars(friends, 78)}
    ${renderTierAvatars(acquaintances, 98)}
  `;
}

function getContactInitials(c) {
  if (c.initials) return c.initials;
  const parts = (c.name || '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (c.name || 'C').substring(0, 2).toUpperCase();
}

function isSymbol(str) {
  return typeof str === 'string' && /^[a-z0-9_]+$/.test(str);
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
