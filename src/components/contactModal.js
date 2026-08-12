import { TIER_CONFIG, AVATAR_PRESETS } from '../types.js';

export function renderContactModal(contact = null) {
  const isEdit = !!contact;
  const initialTier = contact ? contact.tier : 'friends';
  const initialAvatar = contact ? (contact.avatar || contact.avatarSymbol || 'person') : 'person';

  const phoneVal = contact ? (contact.phone || contact.whatsappNumber || '') : '';
  const igVal = contact ? (contact.instagram || contact.instagramHandle || '') : '';
  const notesVal = contact ? (contact.notes || contact.attitudeGuide?.notes || '') : '';

  return `
    <div id="contactModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl product-shadow border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">${isEdit ? 'edit' : 'person_add'}</span>
            <span>${isEdit ? 'Edit Kontak' : 'Tambah Kontak Baru'}</span>
          </h2>
          <button id="btnCloseModal" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Modal Form Body -->
        <form id="contactForm" class="p-6 space-y-4 overflow-y-auto">
          <input type="hidden" name="id" value="${contact ? contact.id : ''}">

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Kontak *</label>
            <input 
              type="text" 
              name="name" 
              value="${escapeHtml(contact ? contact.name : '')}" 
              required 
              placeholder="Contoh: Sarah Rostova / Budi Santoso" 
              class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <!-- Avatar Vector Icon Selector -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Ikon Lencana Vektor</label>
            <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              ${AVATAR_PRESETS.map(preset => `
                <button 
                  type="button" 
                  data-avatar="${preset.symbol}" 
                  class="avatar-preset-btn w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${initialAvatar === preset.symbol ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 scale-110 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'}"
                  title="${preset.label}"
                >
                  <span class="material-symbols-outlined text-xl">${preset.symbol}</span>
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="selectedAvatarInput" name="avatar" value="${initialAvatar}">
          </div>

          <!-- Dunbar Tier Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lingkaran Dunbar Social Circle *</label>
            <select name="tier" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">
              ${Object.entries(TIER_CONFIG).map(([key, config]) => `
                <option value="${key}" ${initialTier === key ? 'selected' : ''}>
                  ${config.name} (${config.description})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Social Contact Links -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp</label>
              <input 
                type="text" 
                name="phone" 
                value="${escapeHtml(phoneVal)}" 
                placeholder="628123456789" 
                class="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram Handle</label>
              <input 
                type="text" 
                name="instagram" 
                value="${escapeHtml(igVal)}" 
                placeholder="@username" 
                class="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <!-- Notes Field -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Memori & Pengingat</label>
            <textarea name="notes" rows="2" placeholder="Catatan memori, tanggal ulang tahun, dll..." class="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium">${escapeHtml(notesVal)}</textarea>
          </div>

          <!-- Modal Action Buttons -->
          <div class="pt-4 flex gap-3">
            <button type="button" id="btnCancelModal" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-full hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-md shadow-indigo-500/20 transition-colors">
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
