/**
 * Casamento Ana Luiza e Caio Henrique
 * JavaScript Principal - Interatividades do Convite Digital
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMobileMenu();
  initAudioPlayer();
  initCalendarModal();
  initGiftList();
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
 * 5. LISTA DE PRESENTES, PIX E MODAL INTERATIVO
 * ----------------------------------------------------------- */
const OFFICIAL_PIX_KEY = "daa47fc1-c89c-4df3-a29f-89f05c273a2f";

function initGiftList() {
  const toast = document.getElementById('pix-toast');
  const toastMessage = document.getElementById('pix-toast-message');
  const modal = document.getElementById('gift-modal');
  const modalTitle = document.getElementById('modal-gift-title');
  const modalValue = document.getElementById('modal-gift-value');
  const modalPixKey = document.getElementById('modal-pix-key');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');

  // Copiar chave Pix dos botões com data-copy-pix
  const copyButtons = document.querySelectorAll('[data-copy-pix]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyPixToClipboard(OFFICIAL_PIX_KEY, btn);
    });
  });

  // Botões de "Presentear" dos cards de presente
  const giftButtons = document.querySelectorAll('.gift-action-btn');
  giftButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.gift-card');
      if (!card || !modal) return;

      const title = card.getAttribute('data-title') || 'Cota de Presente';
      const value = card.getAttribute('data-value') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalValue) modalValue.textContent = value;
      if (modalPixKey) modalPixKey.value = OFFICIAL_PIX_KEY;

      openGiftModal();
    });
  });

  // Fechar modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeGiftModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeGiftModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeGiftModal();
    }
  });

  // Função para copiar com suporte robusto
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
      if (successful) {
        showCopyFeedback(triggerBtn);
      }
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  }

  function showCopyFeedback(triggerBtn) {
    // Altera texto do botão temporariamente se aplicável
    if (triggerBtn) {
      const originalHTML = triggerBtn.innerHTML;
      triggerBtn.classList.add('bg-green-600', 'text-white', 'border-green-600');
      triggerBtn.innerHTML = `
        <svg class="w-4 h-4 text-white inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Chave Copiada!</span>
      `;

      setTimeout(() => {
        triggerBtn.innerHTML = originalHTML;
        triggerBtn.classList.remove('bg-green-600', 'text-white', 'border-green-600');
      }, 3000);
    }

    // Exibe Toast
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
}

