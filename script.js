/* ===================================================================
   WEDDING INVITATION — JAVASCRIPT LOGIC
   Ahmed & Jermina Wedding Page
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initCountdown();
  initAudioPlayer();
});

/* -------------------------------------------------------------------
   1. COUNTDOWN TIMER
   Target: October 13, 2026 at 19:00:00 Cairo Time (16:00:00 UTC)
   ------------------------------------------------------------------- */
function initCountdown() {
  const targetDate = new Date('2026-10-13T16:00:00Z').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? '0' + n : n);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------------
   2. AUDIO PLAYER WITH FLOATING GLASS BUTTON
   ------------------------------------------------------------------- */
function initAudioPlayer() {
  const audio = document.getElementById('weddingAudio');
  const toggleBtn = document.getElementById('audioToggle');
  const soundWave = document.getElementById('soundWave');
  const musicIcon = document.getElementById('musicIcon');
  const audioText = document.getElementById('audioText');

  let isPlaying = false;

  function setPlayingState() {
    isPlaying = true;
    soundWave.classList.add('playing');
    musicIcon.className = 'fa-solid fa-pause';
    audioText.textContent = 'إيقاف مؤقت';
  }

  function setPausedState() {
    isPlaying = false;
    soundWave.classList.remove('playing');
    musicIcon.className = 'fa-solid fa-play';
    audioText.textContent = 'تشغيل الموسيقى';
  }

  audio.addEventListener('play', setPlayingState);
  audio.addEventListener('pause', setPausedState);

  function startAudio() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setPlayingState();
        removeAutoplayTriggers();
      }).catch(() => {
        // Autoplay policy prevented playback, awaiting interaction
      });
    }
  }

  function toggleAudio() {
    if (audio.paused) {
      audio.play().then(setPlayingState).catch(() => {});
    } else {
      audio.pause();
      setPausedState();
    }
  }

  toggleBtn.addEventListener('click', toggleAudio);

  // Instant trigger on page load
  startAudio();

  // Multi-event triggers for instant autoplay upon any interaction
  const triggerEvents = ['click', 'touchstart', 'touchend', 'scroll', 'pointerdown', 'keydown', 'wheel'];

  function handleFirstInteraction() {
    startAudio();
  }

  function removeAutoplayTriggers() {
    triggerEvents.forEach((ev) => {
      window.removeEventListener(ev, handleFirstInteraction);
      document.removeEventListener(ev, handleFirstInteraction);
    });
  }

  triggerEvents.forEach((ev) => {
    window.addEventListener(ev, handleFirstInteraction, { passive: true });
    document.addEventListener(ev, handleFirstInteraction, { passive: true });
  });
}

/* -------------------------------------------------------------------
   3. AMBIENT GOLD DUST / PARTICLES CANVAS
   ------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = Math.random() * 0.45 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.55 + 0.2;
      this.fade = Math.random() * 0.005 + 0.002;
      this.color = Math.random() > 0.3 ? '223, 177, 91' : '255, 230, 160';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.opacity)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(width > 768 ? 45 : 25, 50);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* -------------------------------------------------------------------
   4. COPY VENUE ADDRESS & INVITATION LINK
   ------------------------------------------------------------------- */
const VENUE_FULL_ADDRESS = 'قاعة رومانيكا (Romanica Hall)، مجمع جولدن جروب إيجيبت فيو (Golden Group Egypt View)، هضبة المقطم، محافظة القاهرة، مصر';

function copyAddress() {
  navigator.clipboard.writeText(VENUE_FULL_ADDRESS).then(() => {
    showToast('تم نسخ عنوان القاعة بنجاح! 📍');
  }).catch(() => {
    fallbackCopy(VENUE_FULL_ADDRESS);
  });
}

function copyInvitationLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('تم نسخ رابط الدعوة بنجاح! 🔗');
  }).catch(() => {
    fallbackCopy(url);
  });
}

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showToast('تم النسخ بنجاح!');
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');
  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* -------------------------------------------------------------------
   5. WHATSAPP SHARE
   ------------------------------------------------------------------- */
function shareWhatsApp() {
  const text = `يشرفنا دعوتكم لحضور حفل زفاف أحمد وجيرمين ❤️💍\n🗓 الثلاثاء 13 أكتوبر 2026\n📍 قاعة رومانيكا - جولدن جروب إيجيبت فيو - المقطم\nلمشاهدة تفاصيل الدعوة والخريطة:\n${window.location.href}`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/* -------------------------------------------------------------------
   6. GENERATE & DOWNLOAD iCAL (.ICS) FOR APPLE / OUTLOOK
   ------------------------------------------------------------------- */
function downloadICal() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ahmed & Jermine Wedding//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-ahmed-jermine-20261013@gogo-wid',
    'DTSTAMP:20261013T000000Z',
    'DTSTART:20261013T160000Z',
    'DTEND:20261013T200000Z',
    'SUMMARY:The Wedding of Ahmed & Jermine (حفل زفاف أحمد وجيرمين)',
    'DESCRIPTION:يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا في قاعة رومانيكا، مجمع جولدن جروب إيجيبت فيو، المقطم.',
    'LOCATION:Golden Group Egypt View\\, Romanica Hall\\, El Mokattam hills\\, Cairo\\, Egypt',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Ahmed-and-Jermine-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('تم تحميل موعد الزفاف للتقويم 📅');
}

/* -------------------------------------------------------------------
   7. PHOTO GALLERY LIGHTBOX
   ------------------------------------------------------------------- */
function openLightbox(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  img.src = src;
  cap.textContent = caption;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event && event.target && (event.target.id === 'lightboxImg' || event.target.id === 'lightboxCaption')) {
    return;
  }
  const modal = document.getElementById('lightboxModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

