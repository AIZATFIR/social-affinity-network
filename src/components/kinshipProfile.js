import { TIER_CONFIG } from '../types.js';

export function renderKinshipProfileDrawer(contact) {
  if (!contact) return '';

  const tier = TIER_CONFIG[contact.tier] || TIER_CONFIG.friends;
  const cleanHandle = encodeURIComponent(contact.instagramHandle ? contact.instagramHandle.replace(/^@/, '').trim() : '');
  const waUrl = contact.whatsappNumber 
    ? `https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, '')}` 
    : null;
  const igUrl = contact.instagramHandle ? `https://instagram.com/${cleanHandle}` : null;
  const initials = getContactInitials(contact);

  return `
    <div id="profileDrawerBackdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div class="w-full max-w-md bg-canvas-parchment dark:bg-slate-900 h-full overflow-y-auto product-shadow flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-slide-left">
        
        <!-- Drawer Header -->
        <header class="w-full h-16 flex items-center justify-between px-6 sticky top-0 z-10 bg-canvas-parchment/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
          <button id="btnCloseDrawer" class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 product-shadow text-slate-800 dark:text-slate-100 hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div class="text-base font-bold text-slate-900 dark:text-white">${escapeHtml(contact.name)}</div>
          <button id="btnEditContact" class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 product-shadow text-slate-800 dark:text-slate-100 hover:opacity-80 transition-opacity" title="Edit Contact">
            <span class="material-symbols-outlined text-lg">edit</span>
          </button>
        </header>

        <div class="p-6 space-y-6 flex-1">
          
          <!-- Hero Section: Museum Gallery Style -->
          <section class="flex flex-col items-center justify-center pt-2 pb-4 gap-3 text-center">
            <div class="relative w-28 h-28 rounded-2xl overflow-hidden product-shadow border-4 border-white dark:border-slate-800 bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center text-3xl font-bold">
              ${contact.avatar && isSymbol(contact.avatar) ? `<span class="material-symbols-outlined text-4xl" style="color: ${tier.color}">${contact.avatar}</span>` : `<span>${initials}</span>`}
              
              <!-- Inner Orbit Indicator Badge -->
              <div class="absolute bottom-2 right-2 backdrop-blur-md rounded-full px-2.5 py-0.5 flex items-center gap-1 border shadow-sm" style="background-color: ${tier.color}15; border-color: ${tier.color}30;">
                <span class="w-2 h-2 rounded-full" style="background-color: ${tier.color}"></span>
                <span class="text-[10px] font-bold" style="color: ${tier.color}">${tier.name.split('/')[0].trim()}</span>
              </div>
            </div>

            <div class="space-y-1">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">${escapeHtml(contact.name)}</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Dunbar Circle: <span class="font-semibold" style="color: ${tier.color}">${tier.name}</span></p>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex gap-3 mt-2 w-full">
              ${waUrl ? `
                <a href="${waUrl}" target="_blank" rel="noopener" class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full text-xs flex items-center justify-center gap-2 transition-all product-shadow">
                  <span class="material-symbols-outlined text-sm">chat_bubble</span>
                  <span>WhatsApp</span>
                </a>
              ` : ''}
              ${igUrl ? `
                <a href="${igUrl}" target="_blank" rel="noopener" class="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-xs flex items-center justify-center gap-2 transition-all product-shadow">
                  <span class="material-symbols-outlined text-sm">photo_camera</span>
                  <span>Instagram</span>
                </a>
              ` : ''}
            </div>
          </section>

          <!-- How to Treat Them (Quote Style Card) -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl p-5 product-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-3">
            <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>
              <h2>How to Treat Them</h2>
            </div>
            <div class="border-l-4 pl-4 py-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300 relative whitespace-pre-line" style="border-color: ${tier.color}">
              ${escapeHtml(contact.attitudeGuide?.howToTreat || tier.template.howToTreat)}
            </div>
          </section>

          <!-- Do's & Don'ts Card -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl p-5 product-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-3">
            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span class="material-symbols-outlined text-lg">checklist</span>
              <h2>Do's & Don'ts</h2>
            </div>
            <div class="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              ${escapeHtml(contact.attitudeGuide?.doAndDonts || tier.template.doAndDonts)}
            </div>
          </section>

          <!-- Personal Notes & Reminders Card -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl p-5 product-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-3">
            <div class="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <span class="material-symbols-outlined text-lg">bookmark</span>
              <h2>Memory Notes & Reminders</h2>
            </div>
            <div class="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              ${escapeHtml(contact.attitudeGuide?.notes || tier.template.notes)}
            </div>
          </section>

          <!-- Memory Log Timeline Section -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl p-5 product-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <span class="material-symbols-outlined text-lg">history_edu</span>
                <h2>Memory Log</h2>
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline</span>
            </div>
            <div class="flex flex-col gap-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 text-xs">
              <div class="relative">
                <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <p class="text-[10px] font-bold text-slate-400 mb-0.5">Added to Orbit</p>
                <p class="text-slate-700 dark:text-slate-300">${new Date(contact.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </section>

        </div>

        <!-- Footer Actions -->
        <footer class="p-6 bg-canvas-parchment/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex gap-3">
          <button id="btnDeleteContact" class="w-full py-3 px-4 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-base">delete</span>
            <span>Hapus Kontak</span>
          </button>
        </footer>

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
