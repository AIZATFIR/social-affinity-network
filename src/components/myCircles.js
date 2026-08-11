import { TIER_CONFIG } from '../types.js';

export function renderMyCircles(contacts) {
  return `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      <!-- Page Header with Batch Transfer & Social Import -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">blur_on</span>
            <span>Lingkaran Sosial (Dunbar Tiers)</span>
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen batas kapasitas hubungan emosional & sosial yang sehat
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button id="btnOpenBatchModal" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full transition-all flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800">
            <span class="material-symbols-outlined text-base">swap_horiz</span>
            <span>Pindah Batch</span>
          </button>
          <button id="btnOpenSocialModal" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full transition-all flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800">
            <span class="material-symbols-outlined text-base">share</span>
            <span>Import Social</span>
          </button>
        </div>
      </div>

      <!-- Dunbar Tier Cards -->
      <div class="space-y-4">
        ${Object.entries(TIER_CONFIG).map(([key, config]) => {
          const members = contacts.filter(c => c.tier === key);
          const percent = Math.min(Math.round((members.length / config.recMax) * 100), 100);
          const isOverCapacity = members.length > config.recMax;

          return `
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border ${isOverCapacity ? 'border-rose-400 dark:border-rose-700' : 'border-slate-200/80 dark:border-slate-800'} product-shadow space-y-4">
              
              <!-- Tier Card Header -->
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner" style="background-color: ${config.color}20; color: ${config.color}">
                    <span class="material-symbols-outlined text-xl">${config.icon}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>${config.name}</span>
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${config.description}</p>
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-xs font-bold px-3 py-1 rounded-full ${isOverCapacity ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}">
                    ${members.length} / ${config.recMax}
                  </span>
                  ${isOverCapacity ? `
                    <div class="text-[10px] text-rose-500 font-bold mt-1 flex items-center justify-end gap-0.5">
                      <span class="material-symbols-outlined text-xs">warning</span> Melebihi Rekomendasi
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Capacity Progress Bar -->
              <div class="space-y-1">
                <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${config.color}"></div>
                </div>
              </div>

              <!-- Contact Member Avatars Grid -->
              ${members.length > 0 ? `
                <div class="pt-2">
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Anggota Lingkaran:</div>
                  <div class="flex flex-wrap gap-2">
                    ${members.map(c => {
                      const initials = getContactInitials(c);
                      return `
                        <button 
                          data-contact-id="${c.id}"
                          class="contact-chip-item px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 transition-all product-shadow"
                        >
                          ${c.avatar && isSymbol(c.avatar) ? `<span class="material-symbols-outlined text-sm">${c.avatar}</span>` : `<span class="text-[10px] font-bold px-1 rounded bg-slate-200 dark:bg-slate-700">${initials}</span>`}
                          <span>${escapeHtml(c.name)}</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : `
                <div class="text-xs text-slate-400 italic pt-1">Belum ada kontak di lingkaran ini.</div>
              `}

            </div>
          `;
        }).join('')}
      </div>

    </div>
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
