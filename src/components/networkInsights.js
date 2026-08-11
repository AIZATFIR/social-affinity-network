import { TIER_CONFIG } from '../types.js';

export function renderNetworkInsights(contacts) {
  const totalCount = contacts.length;
  const loversCount = contacts.filter(c => c.tier === 'lovers').length;
  const closeCount = contacts.filter(c => c.tier === 'close_friends').length;

  // Calculate Health Index (0-100%) based on Dunbar balance
  let healthScore = 95;
  if (loversCount > 1) healthScore -= 20;
  if (closeCount > 5) healthScore -= 15;
  if (totalCount === 0) healthScore = 100;
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Calculate Social Energy Budget Expenditure
  let totalEnergySpent = 0.0;
  contacts.forEach(c => {
    const cfg = TIER_CONFIG[c.tier];
    if (cfg && cfg.energyWeight) {
      totalEnergySpent += cfg.energyWeight;
    }
  });

  const isBurnoutRisk = totalEnergySpent > 100.0 || loversCount > 1;
  const priorityContacts = contacts.filter(c => ['lovers', 'close_friends', 'family'].includes(c.tier));

  return `
    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow">
        <h1 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">insights</span>
          <span>Alokasi Energi & Health Score</span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Menjaga batasan energi sosial agar tidak burnout emosional.
        </p>
      </div>

      <!-- Health Score Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 product-shadow flex items-center gap-5">
        <div class="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path class="text-slate-100 dark:text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="${healthScore >= 80 ? 'text-emerald-500' : healthScore >= 50 ? 'text-amber-500' : 'text-rose-500'}" stroke-dasharray="${healthScore}, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span class="absolute text-xl font-extrabold text-slate-900 dark:text-white">${healthScore}</span>
        </div>

        <div class="space-y-1">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">Kesehatan Relasi Sosial</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ${healthScore >= 80 ? 'Sangat Ideal! Kapasitas relasi sosial Anda seimbang sesuai batas Dunbar.' : (loversCount > 1 ? 'Peringatan: Lovers melebihi batas 1 orang.' : 'Perlu penyesuaian alokasi energi relasi.')}
          </p>
        </div>
      </div>

      <!-- Social Energy Budget Expenditure Card -->
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border ${isBurnoutRisk ? 'border-rose-500 dark:border-rose-700' : 'border-slate-200/80 dark:border-slate-800'} product-shadow space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <span class="material-symbols-outlined text-amber-500">bolt</span>
            <h2>Alokasi Energi Emosional Harian</h2>
          </div>
          <span class="text-xs font-extrabold ${isBurnoutRisk ? 'text-rose-500' : 'text-emerald-500'}">
            ${totalEnergySpent.toFixed(1)}% / 100%
          </span>
        </div>

        <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500 ${isBurnoutRisk ? 'bg-rose-500' : 'bg-indigo-600'}" style="width: ${Math.min(100, totalEnergySpent)}%"></div>
        </div>

        <p class="text-xs ${isBurnoutRisk ? 'text-rose-500 font-semibold' : 'text-slate-500 dark:text-slate-400'}">
          ${isBurnoutRisk ? '⚠️ Peringatan Overload: Anda menginvestasikan energi melebihi batas 100%. Pindahkan beberapa kontak ke Kenalan (1500 limit).' : '💡 Investasi energi Anda sehat. Ingat, kenalan 1500 tidak sedalam Teman Dekat (5) & Teman (150).'}
        </p>
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
                    <span class="material-symbols-outlined text-sm">${config.icon}</span> ${config.name}
                  </span>
                  <span class="text-slate-500 dark:text-slate-400">${count} Kontak (${percent}%)</span>
                </div>
                <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
            ${priorityContacts.map(c => {
              const initials = getContactInitials(c);
              return `
                <div class="py-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-100" style="border-color: ${TIER_CONFIG[c.tier]?.color || '#0066cc'}">
                      ${c.avatar && isSymbol(c.avatar) ? `<span class="material-symbols-outlined text-sm">${c.avatar}</span>` : `<span>${initials}</span>`}
                    </div>
                    <div>
                      <div class="font-bold text-xs text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</div>
                      <div class="text-[10px] text-slate-400">${TIER_CONFIG[c.tier]?.name || ''}</div>
                    </div>
                  </div>
                  <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Prioritas Utama
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="text-xs text-slate-400 italic py-2">Belum ada kontak di kategori prioritas utama.</div>
        `}
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
