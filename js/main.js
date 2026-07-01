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
  // Hero Background Swiper (Fade effect)
  new Swiper('.hero-swiper', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    speed: 1200,
  });
}

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

// ── 6. Video Autoplay Booster & Scroll Progress ──────────── //
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
    // Explicit play request (must be muted to succeed)
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay prevented. Retrying on user interaction.', error);
        // Play fallback on first user interaction if blocked
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
});

