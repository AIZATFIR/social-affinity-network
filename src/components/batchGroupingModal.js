import { TIER_CONFIG } from '../types.js';

export function renderBatchGroupingModal(contacts, selectedIds = new Set(), targetTier = 'friends', searchFilter = '') {
  let list = contacts;
  if (searchFilter.trim()) {
    const q = searchFilter.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q));
  }

  const isAllSelected = list.length > 0 && selectedIds.size === list.length;

  return `
    <div id="batchModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl product-shadow border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 max-h-[85vh] animate-scale-up">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
            <span class="material-symbols-outlined text-xl">swap_horiz</span>
            <h2>Pindah Kontak Batch</h2>
          </div>
          <button id="btnCloseBatchModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Target Tier Dropdown Picker -->
        <div class="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Pilih Lingkaran Tujuan:</label>
          <select id="batchTargetTierSelect" class="w-full py-2 px-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white">
            ${Object.entries(TIER_CONFIG).map(([key, config]) => `
              <option value="${key}" ${key === targetTier ? 'selected' : ''}>
                ${config.name} (${config.description})
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Search & Select All Bar -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input 
              type="text" 
              id="batchSearchInput"
              value="${escapeHtml(searchFilter)}"
              placeholder="Cari nama kontak..." 
              class="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
          <button id="btnToggleSelectAll" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700">
            ${isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <!-- Contacts Checkbox List -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 no-scrollbar min-h-[220px]">
          ${list.length > 0 ? list.map(c => {
            const isChecked = selectedIds.has(c.id);
            const tierConfig = TIER_CONFIG[c.tier];
            return `
              <label class="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer">
                <div class="flex items-center gap-3">
                  <input type="checkbox" class="batch-contact-checkbox w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500" data-id="${c.id}" ${isChecked ? 'checked' : ''} />
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white">${escapeHtml(c.name)}</div>
                    <div class="text-[10px] text-slate-400">Sekarang: <span style="color: ${tierConfig?.color}">${tierConfig?.name || c.tier}</span></div>
                  </div>
                </div>
              </label>
            `;
          }).join('') : `
            <div class="text-xs text-slate-400 italic text-center py-8">Tidak ada kontak yang cocok.</div>
          `}
        </div>

        <!-- Submit Action Button -->
        <button id="btnSubmitBatchMove" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-500/20 ${selectedIds.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
          Pindahkan ${selectedIds.size} Kontak Ke ${TIER_CONFIG[targetTier]?.name || targetTier}
        </button>

      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
