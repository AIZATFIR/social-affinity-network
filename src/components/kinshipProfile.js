import { TIER_CONFIG } from '../types.js';

export function renderKinshipProfileDrawer(contact, onClose, onEdit, onDelete) {
  if (!contact) return '';

  const tier = TIER_CONFIG[contact.tier] || TIER_CONFIG.friends;
  const waUrl = contact.whatsappNumber 
    ? `https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}` 
    : null;
  const igUrl = contact.instagramHandle 
    ? `https://instagram.com/${contact.instagramHandle.replace('@', '')}` 
    : null;

  return `
    <div id="profileDrawerBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-slide-left">
        
        <!-- Drawer Content Header -->
        <div>
          <div class="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Detail Kontak</span>
            <button id="btnCloseDrawer" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <div class="p-6 space-y-6">
            
            <!-- Contact Avatar & Title Card -->
            <div class="text-center space-y-3">
              <div class="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border-4 shadow-lg flex items-center justify-center text-4xl" style="border-color: ${tier.color}">
                <span>${contact.avatar || '🍎'}</span>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">${escapeHtml(contact.name)}</h2>
                <div class="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm" style="background-color: ${tier.color}">
                  <span>${tier.icon}</span>
                  <span>${tier.name}</span>
                </div>
              </div>
            </div>

            <!-- Quick Action Links (WhatsApp / Instagram) -->
            <div class="flex gap-3">
              ${waUrl ? `
                <a href="${waUrl}" target="_blank" rel="noopener" class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
                  <span>💬 WhatsApp</span>
                </a>
              ` : ''}
              ${igUrl ? `
                <a href="${igUrl}" target="_blank" rel="noopener" class="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
                  <span>📸 Instagram</span>
                </a>
              ` : ''}
            </div>

            <!-- Attitude Guidelines Section -->
            <div class="space-y-4 pt-2">
              <h3 class="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span class="material-icons text-sm">psychology</span>
                <span>Panduan Sikap & Interaksi</span>
              </h3>

              <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                
                <div>
                  <div class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">🔥 Cara Memperlakukan:</div>
                  <div class="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    ${escapeHtml(contact.attitudeGuide?.howToTreat || tier.template.howToTreat)}
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ DO & ❌ DONT:</div>
                  <div class="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    ${escapeHtml(contact.attitudeGuide?.doAndDonts || tier.template.doAndDonts)}
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">📌 Catatan Memori & Ulang Tahun:</div>
                  <div class="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    ${escapeHtml(contact.attitudeGuide?.notes || tier.template.notes)}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Drawer Action Footer -->
        <div class="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button id="btnEditContact" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5">
            <span class="material-icons text-base">edit</span>
            <span>Edit Kontak</span>
          </button>
          <button id="btnDeleteContact" class="py-3 px-4 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1">
            <span class="material-icons text-base">delete</span>
            <span>Hapus</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
