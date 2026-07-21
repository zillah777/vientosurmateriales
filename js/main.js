/* ──────────────────────────────────────────────────────────
   main.js — Viento Sur Materiales
   Karpathy style: flat, direct, no abstractions unless needed
   ────────────────────────────────────────────────────────── */

// Lucide is loaded before this script in the HTML body (non-deferred).
// By the time this script runs it's already defined.
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ── 1. Mobile Menu ─────────────────────────────────────── //
const menuBtn   = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon  = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('hidden');
  menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  if (menuIcon)  menuIcon.style.display  = 'block';
  if (closeIcon) closeIcon.style.display = 'none';
}

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('hidden');
  menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
  if (menuIcon)  menuIcon.style.display  = 'none';
  if (closeIcon) closeIcon.style.display = 'block';
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close on any nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

// ── 2. Swiper Category Slider ─────────────────────────── //
if (typeof Swiper !== 'undefined') {
  new Swiper('.category-swiper', {
    slidesPerView: 1.2,
    spaceBetween: 12,
    grabCursor: true,
    freeMode: true, // Allows smooth continuous sliding
    speed: 600, // Slightly slower and more elegant transition speed
    mousewheel: {
      forceToAxis: true, // Enables smooth trackpad scrolling
    },
    keyboard: {
      enabled: true, // Enables arrow keys
    },
    navigation: {
      nextEl: '.swiper-next-custom',
      prevEl: '.swiper-prev-custom',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      480:  { slidesPerView: 2.1, spaceBetween: 16 },
      768:  { slidesPerView: 3.1, spaceBetween: 20 },
      1024: { slidesPerView: 4,   spaceBetween: 24 },
    }
  });
  // Hero Background Swiper (Fade effect) — Inicializar inmediatamente
  const heroSwiper = new Swiper('.hero-swiper', {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    autoplay: {
      delay: 7500, // 7.5 segundos por imagen
      disableOnInteraction: false,
    },
    speed: 1800, // Transición suave
  });

  const HERO_FALLBACK = 'assets/images/hero_bg.png';
  const heroLayers = Array.from(document.querySelectorAll('.hero-swiper .hero-bg-layer'));

  function preloadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async function checkHeroImages() {
    if (!heroLayers.length) return;

    await Promise.all(heroLayers.map(async layer => {
      const desired = layer.dataset.heroImg;
      if (!desired) return;
      
      const ok = await preloadImage(desired);
      
      if (!ok) {
        // Imagen original falla, intentamos fallback
        const fbOk = await preloadImage(HERO_FALLBACK);
        if (fbOk) {
          layer.style.backgroundImage = `url('${HERO_FALLBACK}')`;
        } else {
          // Fallback también falla, quitamos la imagen y se verá el background-color del padre
          layer.style.backgroundImage = 'none';
        }
      }
    }));
  }

  checkHeroImages();
} // end if (typeof Swiper !== 'undefined')

// ── 3. Navbar Sticky Shadow ───────────────────────────── //
const navHeader = document.querySelector('.nav-header');
if (navHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ── 4. Reveal on Scroll ────────────────────────────────── //
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0 && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );
  reveals.forEach(el => io.observe(el));
} else {
  // Fallback: show everything immediately (e.g. older browsers)
  reveals.forEach(el => el.classList.add('visible'));
}

// ── 4. Animated Stat Counters ─────────────────────────── //
const counters = document.querySelectorAll('[data-counter]');
if (counters.length > 0 && 'IntersectionObserver' in window) {
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1600;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString('es-AR');
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach(el => counterIO.observe(el));
}

// ── 5. Navbar scroll state (optional shadow) ──────────── //
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 10
      ? 'rgba(224,111,43,0.15)'
      : 'var(--border)';
  }, { passive: true });
}

// ── 6. Video Autoplay Booster & Scroll Progress & Live Status ── //
window.addEventListener('DOMContentLoaded', () => {
  // Scroll Progress Indicator
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // Video Autoplay Booster
  const video = document.getElementById('construction-video');
  if (video) {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay prevented. Retrying on user interaction.', error);
        const playOnInteraction = () => {
          video.play();
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    }
  }

  // Live Hours Status Indicator
  updateStoreStatus();
  setInterval(updateStoreStatus, 60000); // Check every minute
});

function getArgentinaDateTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const dateValues = {};
    parts.forEach(p => {
      dateValues[p.type] = p.value;
    });
    const arYear = parseInt(dateValues.year, 10);
    const arMonth = parseInt(dateValues.month, 10) - 1;
    const arDay = parseInt(dateValues.day, 10);
    const arHour = parseInt(dateValues.hour, 10);
    const arMinute = parseInt(dateValues.minute, 10);
    
    const arDate = new Date(arYear, arMonth, arDay, arHour, arMinute);
    const dayOfWeek = arDate.getDay();
    return { hour: arHour, minute: arMinute, dayOfWeek };
  } catch (e) {
    return { hour: now.getHours(), minute: now.getMinutes(), dayOfWeek: now.getDay() };
  }
}

function updateStoreStatus() {
  const topStatus = document.getElementById('live-status-top');
  const schedStatus = document.getElementById('live-status-schedule');
  if (!topStatus && !schedStatus) return;

  const arTime = getArgentinaDateTime();
  const day = arTime.dayOfWeek;
  const hour = arTime.hour;
  const minute = arTime.minute;
  const totalMinutes = hour * 60 + minute;

  let isOpen = false;
  let closingInfo = "";
  let openingInfo = "";

  const openTime = 8 * 60; // 08:00
  const closeTimeWeek = 19 * 60 + 30; // 19:30
  const closeTimeSat = 12 * 60 + 30; // 12:30

  if (day >= 1 && day <= 5) {
    if (totalMinutes >= openTime && totalMinutes < closeTimeWeek) {
      isOpen = true;
      closingInfo = "cierra a las 19:30";
    } else {
      isOpen = false;
      if (totalMinutes < openTime) {
        openingInfo = "abre hoy a las 08:00";
      } else {
        openingInfo = day === 5 ? "abre mañana a las 08:00" : "abre mañana a las 08:00";
      }
    }
  } else if (day === 6) {
    if (totalMinutes >= openTime && totalMinutes < closeTimeSat) {
      isOpen = true;
      closingInfo = "cierra a las 12:30";
    } else {
      isOpen = false;
      if (totalMinutes < openTime) {
        openingInfo = "abre hoy a las 08:00";
      } else {
        openingInfo = "abre el lunes a las 08:00";
      }
    }
  } else {
    isOpen = false;
    openingInfo = "abre mañana a las 08:00";
  }

  const statusClass = isOpen ? 'status-open' : 'status-closed';
  const statusLabel = isOpen ? 'Abierto' : 'Cerrado';
  const detailLabel = isOpen ? ` (${closingInfo})` : ` (${openingInfo})`;

  [topStatus, schedStatus].forEach(el => {
    if (!el) return;
    const dot = el.querySelector('.status-dot');
    const textSpan = el.querySelector('span:last-child');
    
    if (dot) {
      dot.className = 'status-dot ' + statusClass;
    }
    if (textSpan) {
      textSpan.textContent = `${statusLabel}${detailLabel}`;
    }
  });
}


