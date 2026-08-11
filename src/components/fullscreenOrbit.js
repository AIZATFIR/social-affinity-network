import { TIER_CONFIG } from '../types.js';

export function renderFullscreenOrbit(contacts) {
  const lovers = contacts.filter(c => c.tier === 'lovers');
  const closeFriends = contacts.filter(c => c.tier === 'close_friends');
  const family = contacts.filter(c => c.tier === 'family');
  const friends = contacts.filter(c => c.tier === 'friends');
  const acquaintances = contacts.filter(c => c.tier === 'acquaintances');

  return `
    <div class="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-fade-in">
      
      <!-- Top Action Bar -->
      <header class="px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div class="flex items-center gap-3">
          <button id="btnCloseFullscreen" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h1 class="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-400">blur_on</span>
              <span>Obsidian Orbit Canvas</span>
            </h1>
            <p class="text-xs text-slate-400">Visual Dunbar Intimacy Orbit (1500 Outer Limit)</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-full border border-indigo-800">
            Total: ${contacts.length} Contacts
          </span>
        </div>
      </header>

      <!-- Main Canvas Area -->
      <main class="flex-1 relative flex items-center justify-center bg-slate-950 p-4 overflow-hidden">
        
        <!-- Background Ambient Grid Lines -->
        <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:36px_36px]"></div>

        <div class="orbit-container w-full max-w-[560px] aspect-square relative flex items-center justify-center">
          
          <!-- Concentric Orbit Rings -->
          <div class="ring w-full h-full border-slate-700/60 bg-slate-800/10"></div>
          <div class="ring w-[75%] h-[75%] border-indigo-500/30 bg-indigo-950/20"></div>
          <div class="ring w-[55%] h-[55%] border-emerald-500/30 bg-emerald-950/20"></div>
          <div class="ring w-[38%] h-[38%] border-amber-500/30 bg-amber-950/20"></div>
          <div class="ring w-[20%] h-[20%] border-rose-500/40 bg-rose-950/30"></div>

          <!-- Center Node: YOU -->
          <div class="relative z-10 w-16 h-16 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 shadow-2xl flex items-center justify-center text-2xl animate-pulse" style="box-shadow: 0 0 30px rgba(255, 204, 0, 0.5);">
            <span class="material-symbols-outlined text-3xl">account_circle</span>
          </div>

          <!-- Floating Orbit Avatars -->
          ${renderFullscreenAvatars(contacts, lovers, closeFriends, family, friends, acquaintances)}

        </div>

        <!-- Tier Legend Overlay -->
        <div class="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-2 text-xs product-shadow">
          <div class="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">Orbit Ring Legend</div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#FF2D55]"></span> Lovers / Pasangan (1)</div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#FFCC00]"></span> Close Friends (5)</div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#34C759]"></span> Keluarga (10)</div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#5856D6]"></span> Teman (150)</div>
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#64748B]"></span> Kenalan / Network (1500)</div>
        </div>

      </main>

    </div>
  `;
}

function renderFullscreenAvatars(contacts, lovers, closeFriends, family, friends, acquaintances) {
  const getPos = (idx, total, pct) => {
    const angle = (idx / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
    const radius = pct / 2;
    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`
    };
  };

  const renderGroup = (group, ringPct) => {
    return group.map((c, idx) => {
      const pos = getPos(idx, group.length, ringPct);
      const delay = (idx * 0.3) % 4;
      const initials = getContactInitials(c);
      return `
        <div 
          data-contact-id="${c.id}"
          class="contact-orbit-avatar absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 hover:scale-130 transition-transform duration-300 animate-float"
          style="left: ${pos.left}; top: ${pos.top}; animation-delay: ${delay}s;"
          title="${escapeHtml(c.name)}"
        >
          <div class="w-11 h-11 rounded-full bg-slate-900 border-2 product-shadow flex items-center justify-center font-bold text-xs text-slate-100 overflow-hidden hover:ring-4 ring-indigo-500/50" style="border-color: ${TIER_CONFIG[c.tier]?.color || '#0066cc'}">
            ${c.avatar && isSymbol(c.avatar) ? `<span class="material-symbols-outlined text-lg">${c.avatar}</span>` : `<span>${initials}</span>`}
          </div>
        </div>
      `;
    }).join('');
  };

  return `
    ${renderGroup(lovers, 20)}
    ${renderGroup(closeFriends, 38)}
    ${renderGroup(family, 55)}
    ${renderGroup(friends, 75)}
    ${renderGroup(acquaintances, 98)}
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
