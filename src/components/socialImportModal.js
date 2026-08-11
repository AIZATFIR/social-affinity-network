import { TIER_CONFIG } from '../types.js';

export function renderSocialImportModal(targetTier = 'acquaintances') {
  return `
    <div id="socialModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl product-shadow border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 animate-scale-up">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
            <span class="material-symbols-outlined text-xl">share</span>
            <h2>Import Social / LinkedIn / CSV</h2>
          </div>
          <button id="btnCloseSocialModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <p class="text-xs text-slate-500 dark:text-slate-400">
          Tempel (paste) daftar follower Instagram, koneksi LinkedIn, atau nama kontak (1 nama per baris):
        </p>

        <textarea 
          id="socialImportInput"
          rows="6"
          placeholder="Contoh:&#10;Budi Santoso, @budi_tech&#10;Sarah Rostova, @sarah.rostova&#10;Alex Rivers"
          class="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 font-mono"
        ></textarea>

        <!-- Target Tier Selector -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block">Lingkaran Tujuan Import *</label>
          <select id="socialTargetTierSelect" class="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none text-xs font-semibold text-slate-900 dark:text-white">
            ${Object.entries(TIER_CONFIG).map(([key, config]) => `
              <option value="${key}" ${key === targetTier ? 'selected' : ''}>
                ${config.name} (${config.description})
              </option>
            `).join('')}
          </select>
        </div>

        <button id="btnSubmitSocialImport" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-500/20">
          Import Kontak Sekarang
        </button>

      </div>
    </div>
  `;
}
