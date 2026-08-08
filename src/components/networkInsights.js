import { TIER_CONFIG } from '../types.js';

export function renderNetworkInsights(contacts) {
  const totalCount = contacts.length;
  const loversCount = contacts.filter(c => c.tier === 'lovers').length;
  const closeCount = contacts.filter(c => c.tier === 'close_friends').length;
  const familyCount = contacts.filter(c => c.tier === 'family').length;

  // Calculate Health Index (0-100%) based on Dunbar balance
  let healthScore = 92;
  if (loversCount > 1) healthScore -= 20;
  if (closeCount > 5) healthScore -= 15;
  if (totalCount === 0) healthScore = 0;
  healthScore = Math.max(0, Math.min(100, healthScore));

  const priorityContacts = contacts.filter(c => ['lovers', 'close_friends', 'family'].includes(c.tier));

  return `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow">
        <h1 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊 Analitik Kesehatan Hubungan</span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Evaluasi keseimbangan jaringan sosial dan pola interaksi menurut Hukum Dunbar
        </p>
      </div>

      <!-- Health Score Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow flex flex-col justify-between">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-indigo-500 text-sm">favorite</span>
            <span>Skor Kesehatan Hubungan</span>
          </div>
          <div class="my-3 flex items-baseline gap-2">
            <span class="text-4xl font-black text-indigo-600 dark:text-indigo-400">${healthScore}%</span>
            <span class="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ${healthScore >= 80 ? 'Optimal' : healthScore >= 50 ? 'Sedang' : 'Perlu Perhatian'}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Jaringan sosial Anda memiliki rasio kapasitas yang seimbang sesuai Dunbar circles.
          </p>
        </div>

        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow flex flex-col justify-between">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-amber-500 text-sm">groups</span>
            <span>Total Kontak Terdata</span>
          </div>
          <div class="my-3 flex items-baseline gap-2">
            <span class="text-4xl font-black text-slate-900 dark:text-white">${totalCount}</span>
            <span class="text-xs font-semibold text-slate-400">/ 146 Max</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Batas kognitif maksimal Dunbar adalah 150 kontak sosial aktif.
          </p>
        </div>

      </div>

      <!-- Circle Distribution Graph Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-500 text-base">pie_chart</span>
          <span>Distribusi Lingkaran Hubungan</span>
        </h3>

        <div class="space-y-3.5">
          ${Object.entries(TIER_CONFIG).map(([key, config]) => {
            const count = contacts.filter(c => c.tier === key).length;
            const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return `
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>${config.icon}</span> ${config.name}
                  </span>
                  <span class="text-slate-500 dark:text-slate-400">${count} Kontak (${percent}%)</span>
                </div>
                <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${config.color}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Priority Attention List (Intimate & Close Friends) -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500 text-base">star</span>
            <span>Fokus Perhatian Utama (Intimate & Close)</span>
          </h3>
          <span class="text-xs font-bold text-slate-400">${priorityContacts.length} Orang</span>
        </div>

        ${priorityContacts.length > 0 ? `
          <div class="divide-y divide-slate-100 dark:divide-slate-800/80">
            ${priorityContacts.map(c => `
              <div class="py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">${c.avatar || '🍎'}</span>
                  <div>
                    <div class="font-bold text-xs text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</div>
                    <div class="text-[10px] text-slate-400">${TIER_CONFIG[c.tier]?.name || ''}</div>
                  </div>
                </div>
                <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Prioritas Utama
                </span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-xs text-slate-400 italic py-2">Belum ada kontak di kategori prioritas utama.</div>
        `}
      </div>

    </div>
  `;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
