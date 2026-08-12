import { TIER_CONFIG, AVATAR_PRESETS } from '../types.js';

export function renderContactModal(contact = null) {
  const isEdit = !!contact;
  const initialTier = contact ? contact.tier : 'friends';
  const initialAvatar = contact ? (contact.avatar || contact.avatarSymbol || 'person') : 'person';

  const phoneVal = contact ? (contact.phone || contact.whatsappNumber || '') : '';
  const igVal = contact ? (contact.instagram || contact.instagramHandle || '') : '';
  const notesVal = contact ? (contact.notes || contact.attitudeGuide?.notes || '') : '';

  return `
    <div id="contactModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl product-shadow border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-lg">${isEdit ? 'edit' : 'person_add'}</span>
            </div>
            <div>
              <h2 class="text-sm font-extrabold text-slate-900 dark:text-white">
                ${isEdit ? 'Edit Data Kontak' : 'Tambah Kontak Baru'}
              </h2>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">Atur posisi orbit & lingkaran sosial Dunbar</p>
            </div>
          </div>

          <button id="btnCloseModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Modal Form Body -->
        <form id="contactForm" class="p-6 space-y-4 overflow-y-auto">
          <input type="hidden" name="id" value="${contact ? contact.id : ''}">

          <!-- Contact Name -->
          <div>
            <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
              Nama Kontak <span class="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              name="name" 
              value="${escapeHtml(contact ? contact.name : '')}" 
              required 
              placeholder="Contoh: Sarah Rostova / Budi Santoso" 
              class="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 font-semibold transition-all"
            />
          </div>

          <!-- Avatar Vector Icon Selector -->
          <div>
            <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Ikon Lencana Vektor
            </label>
            <div class="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              ${AVATAR_PRESETS.map(preset => `
                <button 
                  type="button" 
                  data-avatar="${preset.symbol}" 
                  class="avatar-preset-btn w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${initialAvatar === preset.symbol ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 scale-105 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:scale-105'}"
                  title="${preset.label}"
                >
                  <span class="material-symbols-outlined text-lg">${preset.symbol}</span>
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="selectedAvatarInput" name="avatar" value="${initialAvatar}">
          </div>

          <!-- Dunbar Tier Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
              Lingkaran Dunbar Social Circle <span class="text-rose-500">*</span>
            </label>
            <select name="tier" class="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
              ${Object.entries(TIER_CONFIG).map(([key, config]) => `
                <option value="${key}" ${initialTier === key ? 'selected' : ''}>
                  ${config.name} (Max: ${config.recMax})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Social Contact Links -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Nomor WhatsApp</label>
              <input 
                type="text" 
                name="phone" 
                value="${escapeHtml(phoneVal)}" 
                placeholder="628123456789" 
                class="w-full px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Username Instagram</label>
              <input 
                type="text" 
                name="instagram" 
                value="${escapeHtml(igVal)}" 
                placeholder="@username" 
                class="w-full px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
              />
            </div>
          </div>

          <!-- Notes Field -->
          <div>
            <label class="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">Catatan Memori & Pengingat</label>
            <textarea name="notes" rows="2" placeholder="Catatan memori, hal yang disukai, dll..." class="w-full px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all">${escapeHtml(notesVal)}</textarea>
          </div>

          <!-- Modal Action Buttons -->
          <div class="pt-3 flex gap-3">
            <button type="button" id="btnCancelModal" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-500/25 transition-all">
              ${isEdit ? 'Simpan Perubahan' : 'Tambahkan ke Orbit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
