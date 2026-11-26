/**
 * Casamento Ana Luiza e Caio Henrique
 * JavaScript Principal - Interatividades do Convite Digital
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMobileMenu();
  initAudioPlayer();
  initCalendarModal();
  initGalleryLightbox();
  initGiftList();
  initAdminPanel();
});

/* -------------------------------------------------------------
 * 1. CONTAGEM REGRESSIVA PARA 09/02/2026 ÀS 16:00 (BRASÍLIA)
 * ----------------------------------------------------------- */
function initCountdown() {
  const weddingDate = new Date('2026-02-09T16:00:00-03:00').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  const containerEl = document.getElementById('countdown-container');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (containerEl) {
        containerEl.innerHTML = `
          <div class="text-center py-4">
            <span class="font-editorial text-2xl md:text-3xl text-gold-metallic tracking-wider">
              O Grande Dia Chegou! Sejam muito bem-vindos à nossa celebração.
            </span>
          </div>
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------
 * 2. MENU MOBILE
 * ----------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* -------------------------------------------------------------
 * 3. ÁUDIO / MÚSICA DO CONVITE (Web Audio API Melódica + Fallback)
 * ----------------------------------------------------------- */
let audioCtx = null;
let isPlayingAudio = false;
let audioTimer = null;

function initAudioPlayer() {
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (!isPlayingAudio) {
      startAmbientMusic();
      isPlayingAudio = true;
      if (musicIcon) musicIcon.classList.add('animate-spin');
      if (musicText) musicText.textContent = 'Pausar Melodia';
      musicBtn.classList.add('bg-[#C5A059]', 'text-white');
      musicBtn.classList.remove('bg-white/90', 'text-[#5B492A]');
    } else {
      stopAmbientMusic();
      isPlayingAudio = false;
      if (musicIcon) musicIcon.classList.remove('animate-spin');
      if (musicText) musicText.textContent = 'Música do Convite';
      musicBtn.classList.remove('bg-[#C5A059]', 'text-white');
      musicBtn.classList.add('bg-white/90', 'text-[#5B492A]');
    }
  });
}

function startAmbientMusic() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Melodia romântica suave em arpeggios estilo harpa (Canon in D / notas clássicas: D4, F#4, A4, D5, etc.)
    const notes = [
      293.66, 369.99, 440.00, 587.33, 440.00, 369.99, // D
      220.00, 277.18, 329.63, 440.00, 329.63, 277.18, // A
      246.94, 293.66, 369.99, 493.88, 369.99, 293.66, // Bm
      185.00, 220.00, 277.18, 369.99, 277.18, 220.00, // F#m
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94, // G
      146.83, 185.00, 220.00, 293.66, 220.00, 185.00, // D
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94, // G
      220.00, 277.18, 329.63, 440.00, 329.63, 277.18  // A
    ];

    let noteIdx = 0;
    function playNextNote() {
      if (!isPlayingAudio || !audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.25);

      noteIdx++;
      audioTimer = setTimeout(playNextNote, 420);
    }

    playNextNote();
  } catch (e) {
    console.warn('Áudio context indisponível:', e);
  }
}

function stopAmbientMusic() {
  if (audioTimer) {
    clearTimeout(audioTimer);
    audioTimer = null;
  }
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
}

/* -------------------------------------------------------------
 * 4. ADICIONAR AO CALENDÁRIO (Google Calendar & .ICS)
 * ----------------------------------------------------------- */
function initCalendarModal() {
  const gcalBtn = document.getElementById('save-gcalendar-btn');
  const icsBtn = document.getElementById('save-ics-btn');

  const title = encodeURIComponent("Casamento Ana Luiza e Caio Henrique");
  const details = encodeURIComponent("Celebração do casamento de Ana Luiza e Caio Henrique.\nVersículo: Efésios 5:31\nEsperamos você com muito carinho!");
  const location = encodeURIComponent("ESPAÇO WIILIAM - Colônia Agrícola Córrego do Crispim - Chácara, 43 - Gama Leste, Brasília - DF");
  
  // 09/02/2026 16:00 BRT (-03:00) = 19:00:00Z até 23:59:00Z
  const startTime = "20260209T190000Z";
  const endTime = "20260210T030000Z";

  if (gcalBtn) {
    gcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    gcalBtn.target = "_blank";
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadIcsFile();
    });
  }
}

function downloadIcsFile() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Casamento Ana Luiza e Caio Henrique//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:casamento-ana-luiza-caio-henrique-20260209',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20260209T190000Z',
    'DTEND:20260210T030000Z',
    'SUMMARY:Casamento Ana Luiza e Caio Henrique',
    'DESCRIPTION:Celebração do casamento de Ana Luiza e Caio Henrique.\\nVersículo: Efésios 5:31',
    'LOCATION:ESPAÇO WIILIAM - Colônia Agrícola Córrego do Crispim - Chácara, 43 - Gama Leste, Brasília - DF',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'casamento-ana-luiza-e-caio-henrique.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------
 * 5. LISTA DE PRESENTES OFICIAL (PLANILHA) + PIX + BANCO LOCAL
 * ----------------------------------------------------------- */
const OFFICIAL_PIX_KEY = "daa47fc1-c89c-4df3-a29f-89f05c273a2f";
const GIFT_DB_STORAGE_KEY = "casamento_ac_gifts_db_v1";

// Lista oficial extraída da planilha COMPRAS-APTO.xlsx (itens a conquistar)
const WEDDING_GIFTS = [
  { id: "talheres", name: "Talheres", category: "Cozinha" },
  { id: "sofa", name: "Sofá", category: "Móveis & Casa" },
  { id: "tapetes", name: "Tapetes", category: "Móveis & Casa" },
  { id: "potes-hermeticos", name: "Potes Herméticos", category: "Cozinha" },
  { id: "aparelho-de-jantar", name: "Aparelho de Jantar", category: "Cozinha" },
  { id: "chaleira-eletrica", name: "Chaleira Elétrica", category: "Eletrodomésticos" },
  { id: "tabua-de-passar", name: "Tábua de Passar", category: "Enxoval & Lavanderia" },
  { id: "aspirador-de-po", name: "Aspirador de Pó", category: "Eletrodomésticos" },
  { id: "guarda-roupa", name: "Guarda Roupa", category: "Móveis & Casa" },
  { id: "base-cama-bau-queen", name: "Base Cama de Baú Queen", category: "Móveis & Casa" },
  { id: "armario-da-cozinha", name: "Armário da Cozinha", category: "Móveis & Casa" },
  { id: "bancada-do-escritorio", name: "Bancada do Escritório", category: "Móveis & Casa" },
  { id: "banquetas-cozinha", name: "Banquetas Cozinha", category: "Móveis & Casa" },
  { id: "ar-condicionado", name: "Ar Condicionado", category: "Eletrodomésticos" },
  { id: "garrafa-de-cafe", name: "Garrafa de Café", category: "Cozinha" },
  { id: "protetor-colchao", name: "Protetor Colchão", category: "Enxoval & Lavanderia" },
  { id: "jarra-de-suco", name: "Jarra de Suco", category: "Cozinha" },
  { id: "porta-mantimentos", name: "Porta Mantimentos", category: "Cozinha" },
  { id: "marinex", name: "Marinex", category: "Cozinha" },
  { id: "ralador", name: "Ralador", category: "Cozinha" },
  { id: "abridor-de-lata", name: "Abridor de Lata", category: "Cozinha" },
  { id: "porta-saco", name: "Porta Saco", category: "Enxoval & Lavanderia" },
  { id: "varal-de-chao", name: "Varal de Chão", category: "Enxoval & Lavanderia" },
  { id: "filtro-de-agua", name: "Filtro de Água", category: "Eletrodomésticos" },
  { id: "panela-pressao-eletrica", name: "Panela de Pressão Elétrica", category: "Eletrodomésticos" },
  { id: "cobertor", name: "Cobertor", category: "Enxoval & Lavanderia" },
  { id: "luva-termica", name: "Luva Térmica", category: "Cozinha" },
  { id: "assadeiras", name: "Assadeiras", category: "Cozinha" },
  { id: "liquidificador", name: "Liquidificador", category: "Eletrodomésticos" },
  { id: "multiprocessador", name: "Multiprocessador", category: "Eletrodomésticos" },
  { id: "pano-de-chao", name: "Pano de Chão", category: "Enxoval & Lavanderia" },
  { id: "cortina", name: "Cortina", category: "Móveis & Casa" },
  { id: "edredom", name: "Edredom", category: "Enxoval & Lavanderia" },
  { id: "lixeiras", name: "Lixeiras", category: "Enxoval & Lavanderia" },
  { id: "rodo-vassoura-pa", name: "Rodo / Vassoura / Pá", category: "Enxoval & Lavanderia" },
  { id: "sanduicheira-grill", name: "Sanduicheira Grill", category: "Eletrodomésticos" },
  { id: "cesto-de-roupa-suja", name: "Cesto de Roupa Suja", category: "Enxoval & Lavanderia" },
  { id: "peneiras", name: "Peneiras", category: "Cozinha" },
  { id: "escorredor-de-macarrao", name: "Escorredor de Macarrão", category: "Cozinha" }
];

const GiftDatabase = {
  getAll() {
    try {
      const raw = localStorage.getItem(GIFT_DB_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erro ao ler banco de presentes:", e);
      return [];
    }
  },
  add(entry) {
    const records = this.getAll();
    records.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...entry,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(GIFT_DB_STORAGE_KEY, JSON.stringify(records));
    return records;
  },
  remove(id) {
    const records = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(GIFT_DB_STORAGE_KEY, JSON.stringify(records));
    return records;
  },
  getCountByItem(itemId) {
    return this.getAll().filter(r => r.itemId === itemId).length;
  }
};

function initGiftList() {
  const toast = document.getElementById('pix-toast');
  const modal = document.getElementById('gift-modal');
  const modalTitle = document.getElementById('modal-gift-title');
  const modalCategory = document.getElementById('modal-gift-category');
  const modalAlreadyNote = document.getElementById('modal-already-selected-note');
  const modalPixKey = document.getElementById('modal-pix-key');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const giftForm = document.getElementById('gift-confirm-form');
  const successView = document.getElementById('gift-success-view');
  const guestNameInput = document.getElementById('gift-guest-name');
  const guestMessageInput = document.getElementById('gift-guest-message');
  const whatsappLink = document.getElementById('modal-whatsapp-link');
  const giftsGrid = document.getElementById('gifts-grid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchInput = document.getElementById('gift-search-input');

  let activeCategory = 'todos';
  let searchQuery = '';
  let currentSelectedGift = null;

  function renderGifts() {
    if (!giftsGrid) return;

    const filtered = WEDDING_GIFTS.filter(item => {
      const matchesCat = activeCategory === 'todos' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      giftsGrid.innerHTML = `
        <div class="col-span-full py-10 text-center text-xs text-wedding-bronze-light">
          Nenhum presente encontrado para "${searchQuery}".
        </div>
      `;
      return;
    }

    giftsGrid.innerHTML = filtered.map(item => {
      const count = GiftDatabase.getCountByItem(item.id);
      const isSelected = count > 0;

      return `
        <div class="gift-card bg-white/90 backdrop-blur rounded-2xl p-5 border ${isSelected ? 'border-[#C5A059]/60 bg-[#FCF9F2]/60' : 'border-[#C5A059]/25'} flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FCF9F2] text-wedding-gold border border-[#C5A059]/30 uppercase tracking-wider">
                ${item.category}
              </span>
              ${isSelected ? `
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-wedding-bronze border border-[#C5A059]/40">
                  <svg class="w-3 h-3 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Já selecionado${count > 1 ? ` (${count})` : ''}
                </span>
              ` : ''}
            </div>
            <h4 class="font-editorial font-bold text-lg text-wedding-bronze leading-snug">${item.name}</h4>
          </div>

          <div class="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between">
            <button type="button" data-select-gift="${item.id}" class="text-xs font-semibold uppercase tracking-wider text-wedding-gold hover:text-wedding-bronze transition-colors flex items-center gap-1.5">
              <span>${isSelected ? 'Presentear novamente' : 'Selecionar presente'}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Reatribui listeners dos cards
    giftsGrid.querySelectorAll('[data-select-gift]').forEach(btn => {
      btn.addEventListener('click', () => {
        const giftId = btn.getAttribute('data-select-gift');
        const giftObj = WEDDING_GIFTS.find(g => g.id === giftId);
        if (giftObj) openModalForGift(giftObj);
      });
    });
  }

  function openModalForGift(giftObj) {
    currentSelectedGift = giftObj;
    const count = GiftDatabase.getCountByItem(giftObj.id);

    if (modalTitle) modalTitle.textContent = giftObj.name;
    if (modalCategory) modalCategory.textContent = giftObj.category;
    if (modalPixKey) modalPixKey.value = OFFICIAL_PIX_KEY;

    if (modalAlreadyNote) {
      modalAlreadyNote.classList.toggle('hidden', count === 0);
    }

    if (giftForm) {
      giftForm.reset();
      giftForm.classList.remove('hidden');
    }
    if (successView) {
      successView.classList.add('hidden');
    }

    openGiftModal();
  }

  // Envio do formulário de confirmação de presente
  if (giftForm) {
    giftForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentSelectedGift) return;

      const guestName = guestNameInput ? guestNameInput.value.trim() : '';
      if (!guestName) return;

      const methodEl = giftForm.querySelector('input[name="gift-method"]:checked');
      const method = methodEl ? methodEl.value : 'Pix';
      const message = guestMessageInput ? guestMessageInput.value.trim() : '';

      GiftDatabase.add({
        itemId: currentSelectedGift.id,
        itemName: currentSelectedGift.name,
        guestName,
        method,
        message
      });

      if (whatsappLink) {
        const msgText = encodeURIComponent(
          `Olá Ana Luiza e Caio! Aqui é ${guestName}. Selecionei o presente "${currentSelectedGift.name}" (${method}) na lista do casamento!${message ? ' Mensagem: ' + message : ''}`
        );
        whatsappLink.href = `https://wa.me/5561999999999?text=${msgText}`;
      }

      giftForm.classList.add('hidden');
      if (successView) successView.classList.remove('hidden');
      renderGifts();
    });
  }

  // Filtros e Busca
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'todos';
      renderGifts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderGifts();
    });
  }

  // Copiar chave Pix dos botões com data-copy-pix
  document.querySelectorAll('[data-copy-pix]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyPixToClipboard(OFFICIAL_PIX_KEY, btn);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeGiftModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeGiftModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeGiftModal();
    }
  });

  function copyPixToClipboard(text, triggerBtn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(triggerBtn);
      }).catch(() => {
        fallbackCopyText(text, triggerBtn);
      });
    } else {
      fallbackCopyText(text, triggerBtn);
    }
  }

  function fallbackCopyText(text, triggerBtn) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) showCopyFeedback(triggerBtn);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  }

  function showCopyFeedback(triggerBtn) {
    if (triggerBtn) {
      const originalHTML = triggerBtn.innerHTML;
      triggerBtn.classList.add('bg-green-600', 'text-white', 'border-green-600');
      triggerBtn.innerHTML = `
        <svg class="w-4 h-4 text-white inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Copiado!</span>
      `;
      setTimeout(() => {
        triggerBtn.innerHTML = originalHTML;
        triggerBtn.classList.remove('bg-green-600', 'text-white', 'border-green-600');
      }, 3000);
    }

    if (toast) {
      toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8');
      toast.classList.add('show', 'opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('show', 'opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8');
      }, 3500);
    }
  }

  function openGiftModal() {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      const content = document.getElementById('gift-modal-content');
      if (content) {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
      }
    }, 10);
  }

  function closeGiftModal() {
    if (!modal) return;
    const content = document.getElementById('gift-modal-content');
    if (content) {
      content.classList.remove('scale-100', 'opacity-100');
      content.classList.add('scale-95', 'opacity-0');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }

  // Renderização inicial
  const countTodos = document.getElementById('count-todos');
  if (countTodos) countTodos.textContent = WEDDING_GIFTS.length;
  renderGifts();

  // Expor re-render para o painel Admin atualizar quando excluir registro
  window.__rerenderGiftsGrid = renderGifts;
}

/* -------------------------------------------------------------
 * 6. GALERIA LIGHTBOX (ETAPA 2)
 * ----------------------------------------------------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  if (!lightbox || items.length === 0) return;

  let currentIdx = 0;

  function showPhoto(idx) {
    currentIdx = (idx + items.length) % items.length;
    const el = items[currentIdx];
    const src = el.getAttribute('data-photo');
    const caption = el.getAttribute('data-caption') || '';
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showPhoto(idx);
      lightbox.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showPhoto(currentIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showPhoto(currentIdx + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIdx - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIdx + 1);
  });
}

/* -------------------------------------------------------------
 * 7. PAINEL ADMIN (BANCO DE DADOS RESTRITO AOS NOIVOS)
 * ----------------------------------------------------------- */
const ADMIN_PIN = "09022026";

function initAdminPanel() {
  const openBtn = document.getElementById('open-admin-btn');
  const modal = document.getElementById('admin-modal');
  const backdrop = document.getElementById('admin-backdrop');
  const closeBtn = document.getElementById('admin-close-btn');
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('admin-password-input');
  const loginError = document.getElementById('admin-login-error');
  const tableBody = document.getElementById('admin-table-body');
  const exportBtn = document.getElementById('admin-export-csv');

  if (!modal) return;

  let isAuthenticated = false;

  function openAdmin() {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (isAuthenticated) {
      renderDashboard();
    } else if (passwordInput) {
      passwordInput.value = '';
      if (loginError) loginError.classList.add('hidden');
      setTimeout(() => passwordInput.focus(), 50);
    }
  }

  function closeAdmin() {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function renderDashboard() {
    const records = GiftDatabase.getAll();
    const statTotal = document.getElementById('admin-stat-total');
    const statUnique = document.getElementById('admin-stat-unique');
    const statMethods = document.getElementById('admin-stat-methods');

    const uniqueItems = new Set(records.map(r => r.itemId)).size;
    const pixCount = records.filter(r => r.method === 'Pix').length;
    const physCount = records.filter(r => r.method !== 'Pix').length;

    if (statTotal) statTotal.textContent = records.length;
    if (statUnique) statUnique.textContent = uniqueItems;
    if (statMethods) statMethods.textContent = `${pixCount} / ${physCount}`;

    if (!tableBody) return;

    if (records.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-4 py-8 text-center text-wedding-bronze-light italic">
            Nenhum presente registrado ainda.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = records.map(r => {
      const dateStr = new Date(r.createdAt).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr class="hover:bg-[#FCF9F2]/70">
          <td class="px-4 py-3 whitespace-nowrap">${dateStr}</td>
          <td class="px-4 py-3 font-medium text-wedding-bronze">${escapeHtml(r.guestName)}</td>
          <td class="px-4 py-3 font-semibold text-wedding-gold">${escapeHtml(r.itemName)}</td>
          <td class="px-4 py-3 whitespace-nowrap">${escapeHtml(r.method)}</td>
          <td class="px-4 py-3 max-w-xs truncate" title="${escapeHtml(r.message || '')}">${escapeHtml(r.message || '—')}</td>
          <td class="px-4 py-3 text-right">
            <button type="button" data-delete-record="${r.id}" class="text-red-500 hover:text-red-700 text-[11px] uppercase tracking-wider font-medium">
              Excluir
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.querySelectorAll('[data-delete-record]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-record');
        GiftDatabase.remove(id);
        renderDashboard();
        if (window.__rerenderGiftsGrid) window.__rerenderGiftsGrid();
      });
    });
  }

  if (openBtn) openBtn.addEventListener('click', openAdmin);
  if (closeBtn) closeBtn.addEventListener('click', closeAdmin);
  if (backdrop) backdrop.addEventListener('click', closeAdmin);

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (passwordInput && passwordInput.value === ADMIN_PIN) {
        isAuthenticated = true;
        if (loginView) loginView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        renderDashboard();
      } else if (loginError) {
        loginError.classList.remove('hidden');
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const records = GiftDatabase.getAll();
      const header = ['Data', 'Convidado', 'Presente', 'Forma', 'Mensagem'];
      const rows = records.map(r => [
        new Date(r.createdAt).toLocaleString('pt-BR'),
        `"${(r.guestName || '').replace(/"/g, '""')}"`,
        `"${(r.itemName || '').replace(/"/g, '""')}"`,
        `"${(r.method || '').replace(/"/g, '""')}"`,
        `"${(r.message || '').replace(/"/g, '""')}"`
      ].join(';'));
      const csv = '\uFEFF' + [header.join(';'), ...rows].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentes-casamento-ana-caio.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Abre direto se acessar ?admin=1
  if (new URLSearchParams(window.location.search).get('admin') === '1') {
    openAdmin();
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

