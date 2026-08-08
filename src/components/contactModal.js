import { TIER_CONFIG, AVATAR_PRESETS } from '../types.js';

export function renderContactModal(contact = null) {
  const isEdit = !!contact;
  const initialTier = contact ? contact.tier : 'friends';
  const initialAvatar = contact ? contact.avatar : 'person';

  return `
    <div id="contactModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div class="w-full max-w-lg bg-canvas-parchment dark:bg-slate-900 rounded-3xl product-shadow border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">${isEdit ? 'edit' : 'person_add'}</span>
            <span>${isEdit ? 'Edit Contact' : 'Add New Contact'}</span>
          </h2>
          <button id="btnCloseModal" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Modal Form Body -->
        <form id="contactForm" class="p-6 space-y-4 overflow-y-auto">
          <input type="hidden" name="id" value="${contact ? contact.id : ''}">

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Name *</label>
            <input 
              type="text" 
              name="name" 
              value="${escapeHtml(contact ? contact.name : '')}" 
              required 
              placeholder="e.g. Sarah Rostova / Budi Santoso" 
              class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <!-- Avatar Vector Icon Selector -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Vector Badge Icon</label>
            <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              ${AVATAR_PRESETS.map(preset => `
                <button 
                  type="button" 
                  data-avatar="${preset.symbol}" 
                  class="avatar-preset-btn w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${initialAvatar === preset.symbol ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 scale-110 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'}"
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
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dunbar Social Tier *</label>
            <select name="tier" class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium">
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
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number</label>
              <input 
                type="text" 
                name="whatsappNumber" 
                value="${escapeHtml(contact ? contact.whatsappNumber || '' : '')}" 
                placeholder="628123456789" 
                class="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram Handle</label>
              <input 
                type="text" 
                name="instagramHandle" 
                value="${escapeHtml(contact ? contact.instagramHandle || '' : '')}" 
                placeholder="@username" 
                class="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          <!-- Attitude Guide Fields -->
          <div class="space-y-3 pt-2">
            <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400">Personal Interaction Guide</div>
            
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">How to Treat Them</label>
              <textarea name="howToTreat" rows="2" class="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium">${escapeHtml(contact?.attitudeGuide?.howToTreat || '')}</textarea>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Memory Notes & Reminders</label>
              <textarea name="notes" rows="2" class="w-full px-3.5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium">${escapeHtml(contact?.attitudeGuide?.notes || '')}</textarea>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div class="pt-4 flex gap-3">
            <button type="button" id="btnCancelModal" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-full shadow-md shadow-indigo-500/20 transition-colors">
              Save Contact
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
