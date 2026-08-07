import { TIER_CONFIG } from '../types.js';

/**
 * Calculates (x, y) offset percentages for avatars along concentric orbit rings
 */
function getOrbitPosition(index, total, ringPercentage) {
  const angle = (index / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
  const radius = ringPercentage / 2; // radius as percentage of container width
  const left = 50 + radius * Math.cos(angle);
  const top = 50 + radius * Math.sin(angle);
  return { left: `${left}%`, top: `${top}%` };
}

export function renderOrbitDashboard(contacts, selectedTierFilter, searchQuery, onSelectContact, onNavigate) {
  // Filter contacts by selected tier & search query
  let filtered = contacts;
  if (selectedTierFilter && selectedTierFilter !== 'all') {
    filtered = filtered.filter(c => c.tier === selectedTierFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.notes && c.notes.toLowerCase().includes(query))
    );
  }

  // Group contacts by tier for orbit positioning
  const lovers = contacts.filter(c => c.tier === 'lovers');
  const closeFriends = contacts.filter(c => c.tier === 'close_friends');
  const family = contacts.filter(c => c.tier === 'family');
  const friends = contacts.filter(c => c.tier === 'friends');
  const acquaintances = contacts.filter(c => c.tier === 'acquaintances');

  const totalContacts = contacts.length;
  const maxCapacity = 146; // Dunbar total recommendation sum

  return `
    <div class="max-w-2xl mx-auto space-y-6">
      
      <!-- Search & Filter Controls -->
      <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div class="relative">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            id="searchInput"
            value="${escapeHtml(searchQuery || '')}"
            placeholder="Cari teman, keluarga, atau catatan..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button data-filter="all" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedTierFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
            🌟 Semua (${contacts.length})
          </button>
          ${Object.entries(TIER_CONFIG).map(([key, config]) => {
            const count = contacts.filter(c => c.tier === key).length;
            const isActive = selectedTierFilter === key;
            return `
              <button data-filter="${key}" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
                <span>${config.icon}</span>
                <span>${config.name.split('/')[0].trim()}</span>
                <span class="opacity-75">(${count})</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Concentric Orbit Ring Container -->
      <div class="relative py-4">
        <div class="orbit-container w-full max-w-[420px] mx-auto flex items-center justify-center">
          
          <!-- Outer Ring 4: Acquaintances & Friends -->
          <div class="ring w-full h-full bg-slate-500/5 border-slate-300 dark:border-slate-700"></div>
          
          <!-- Ring 3: Family -->
          <div class="ring w-[75%] h-[75%] bg-emerald-500/5 border-emerald-400/30"></div>
          
          <!-- Ring 2: Close Friends -->
          <div class="ring w-[50%] h-[50%] bg-amber-500/10 border-amber-400/40"></div>
          
          <!-- Ring 1: Intimate / Lovers -->
          <div class="ring w-[28%] h-[28%] bg-rose-500/15 border-rose-400/50"></div>

          <!-- Center Node: Me / You -->
          <div class="relative z-10 w-14 h-14 rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:scale-105 transition-transform" title="Pusat Orbit (Anda)">
            🌌
          </div>

          <!-- Floating Orbit Avatars -->
          ${renderOrbitAvatars(filtered, lovers, closeFriends, family, friends, acquaintances)}

        </div>
      </div>

      <!-- Dunbar Slot Capacity Summary Card -->
      <section class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯 Slot Kapasitas Dunbar</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Ringkasan kapasitas pertemanan sehat</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            ${totalContacts} / ${maxCapacity} Terisi
          </span>
        </div>

        <div class="space-y-3 pt-1">
          ${Object.entries(TIER_CONFIG).map(([key, config]) => {
            const count = contacts.filter(c => c.tier === key).length;
            const percent = Math.min(Math.round((count / config.recMax) * 100), 100);
            return `
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${config.color}"></div>
                <div class="flex-1">
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>${config.icon}</span> ${config.name}
                    </span>
                    <span class="text-slate-500 dark:text-slate-400">${count} / ${config.recMax}</span>
                  </div>
                  <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${config.color}"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="pt-2 flex gap-3">
          <button id="btnOpenCircles" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2">
            <span class="material-icons text-base">tune</span>
            <span>Atur Batas Kapasitas</span>
          </button>
          <button id="btnOpenInsights" class="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5">
            <span class="material-icons text-base">analytics</span>
            <span>Analitik</span>
          </button>
        </div>
      </section>

    </div>
  `;
}

function renderOrbitAvatars(filteredContacts, lovers, closeFriends, family, friends, acquaintances) {
  if (filteredContacts.length === 0) {
    return `
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500">
          Belum ada kontak di filter ini
        </div>
      </div>
    `;
  }

  // Helper to render avatars on specific ring percentages
  const renderTierAvatars = (groupList, ringPercentage) => {
    return groupList.map((contact, idx) => {
      if (!filteredContacts.some(c => c.id === contact.id)) return '';
      const pos = getOrbitPosition(idx, groupList.length, ringPercentage);
      const delay = (idx * 0.4) % 3;

      return `
        <div 
          data-contact-id="${contact.id}"
          class="contact-orbit-avatar absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 hover:scale-125 hover:z-30 transition-all duration-300 animate-float"
          style="left: ${pos.left}; top: ${pos.top}; animation-delay: ${delay}s;"
          title="${escapeHtml(contact.name)} (${TIER_CONFIG[contact.tier]?.name || ''})"
        >
          <div class="relative group">
            <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 shadow-md flex items-center justify-center text-xl overflow-hidden" style="border-color: ${TIER_CONFIG[contact.tier]?.color || '#6366f1'}">
              <span>${contact.avatar || '🍎'}</span>
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
    ${renderTierAvatars(lovers, 28)}
    ${renderTierAvatars(closeFriends, 50)}
    ${renderTierAvatars(family, 75)}
    ${renderTierAvatars([...friends, ...acquaintances], 98)}
  `;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
