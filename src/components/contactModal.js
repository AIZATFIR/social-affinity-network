import { TIER_CONFIG, AVATAR_PRESETS } from '../types.js';

export function renderContactModal(contact = null, onClose, onSave) {
  const isEdit = !!contact;
  const initialTier = contact ? contact.tier : 'friends';
  const initialAvatar = contact ? contact.avatar : '🍎';

  return `
    <div id="contactModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>${isEdit ? '✏️ Edit Kontak' : '➕ Tambah Kontak Baru'}</span>
          </h2>
          <button id="btnCloseModal" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 transition-colors">
            <span class="material-icons text-base">close</span>
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
              placeholder="Contoh: Sarah / Budi" 
              class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Avatar Emoji Selector -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Emoji Avatar</label>
            <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              ${AVATAR_PRESETS.map(preset => `
                <button 
                  type="button" 
                  data-avatar="${preset.emoji}" 
                  class="avatar-preset-btn w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-xl transition-all flex-shrink-0 ${initialAvatar === preset.emoji ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 scale-110' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:scale-105'}"
                >
                  <span>${preset.emoji}</span>
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="selectedAvatarInput" name="avatar" value="${initialAvatar}">
          </div>

          <!-- Dunbar Tier Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lingkaran Sosialisasi (Tier) *</label>
            <select name="tier" class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">
              ${Object.entries(TIER_CONFIG).map(([key, config]) => `
                <option value="${key}" ${initialTier === key ? 'selected' : ''}>
                  ${config.icon} ${config.name} (${config.description})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Social Contact Links -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">No WhatsApp</label>
              <input 
                type="text" 
                name="whatsappNumber" 
                value="${escapeHtml(contact ? contact.whatsappNumber || '' : '')}" 
                placeholder="628123456789" 
                class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username IG</label>
              <input 
                type="text" 
                name="instagramHandle" 
                value="${escapeHtml(contact ? contact.instagramHandle || '' : '')}" 
                placeholder="@username" 
                class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Attitude Guide Fields -->
          <div class="space-y-3 pt-2">
            <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400">Panduan Sikap Personal</div>
            
            <div>
              <label class="block text-[11px] text-slate-500 mb-1">Cara Memperlakukan (How to Treat)</label>
              <textarea name="howToTreat" rows="2" class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">${escapeHtml(contact?.attitudeGuide?.howToTreat || '')}</textarea>
            </div>

            <div>
              <label class="block text-[11px] text-slate-500 mb-1">Catatan Memori & Ulang Tahun</label>
              <textarea name="notes" rows="2" class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500">${escapeHtml(contact?.attitudeGuide?.notes || '')}</textarea>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="pt-4 flex gap-3">
            <button type="button" id="btnCancelModal" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-2xl hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-indigo-500/20 transition-colors">
              Simpan Kontak
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
