/* ═══════════════════════════════════════════════════════
   AVOLOGY PRO — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════════════ */

/* ─── PAGE LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);
});

/* ─── CUSTOM CURSOR ─── */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();
  document.querySelectorAll('a,button,.btn,.service-card,.portfolio-item,.team-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
  });
}

/* ─── NAVBAR SCROLL ─── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── UNIFIED RESPONSIVE NAV ─── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.getElementById('navLinks');

function closeNav() {
  if (!hamburger || !navLinks) return;
  hamburger.classList.remove('active');
  navLinks.classList.remove('nav-open');
  document.body.style.overflow = '';
  // close all open dropdowns
  document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('nav-open');
    if (isOpen) {
      closeNav();
    } else {
      hamburger.classList.add('active');
      navLinks.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close nav when a plain nav link is clicked (not dropdown triggers)
  navLinks.querySelectorAll('li:not(.nav-dropdown) > a, .nav-mobile-cta a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // Mobile dropdown toggles
  document.querySelectorAll('.nav-dd-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const li = btn.closest('.nav-dropdown');
      if (!li) return;
      const isOpen = li.classList.contains('open');
      // close all others first
      document.querySelectorAll('.nav-dropdown.open').forEach(d => {
        if (d !== li) d.classList.remove('open');
      });
      li.classList.toggle('open', !isOpen);
    });
  });

  // Desktop: close nav if window resizes above breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeNav();
  }, { passive: true });
}

/* ─── LEGACY ACCORDION (kept for any remaining .mm-accordion elements) ─── */
function toggleMmAccordion(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.mm-accordion').forEach(a => a.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('revealed'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  revealObserver.observe(el);
});

/* ─── STAGGER CHILDREN ─── */
document.querySelectorAll('.stagger-children').forEach(parent => {
  parent.querySelectorAll('.reveal').forEach((child, i) => {
    child.style.setProperty('--i', i);
    child.dataset.delay = i * 100;
  });
});

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
// Support both data-target and data-count attributes
document.querySelectorAll('[data-target],[data-count]').forEach(el => {
  if (el.dataset.count && !el.dataset.target) el.dataset.target = el.dataset.count;
  counterObserver.observe(el);
});

/* ─── PORTFOLIO FILTER ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.opacity = show ? '1' : '0.2';
      item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
      item.style.pointerEvents = show ? 'all' : 'none';
    });
  });
});

/* ─── PORTFOLIO MODAL ─── */
const modal = document.getElementById('portfolio-modal');
if (modal) {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || 'Project';
      const client = item.dataset.client || '';
      const category = item.dataset.category || '';
      const desc = item.dataset.desc || 'A premium digital solution crafted with precision and expertise.';
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-client').textContent = client;
      modal.querySelector('.modal-category').textContent = category;
      modal.querySelector('.modal-desc').textContent = desc;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ─── FAQ ACCORDION (v1 + v2) ─── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
document.querySelectorAll('.faq-v2-item').forEach(item => {
  item.querySelector('.faq-v2-q')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-v2-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── TESTIMONIAL CAROUSEL (single-card) ─── */
(function () {
  const track = document.querySelector('.testi-track');
  if (!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.querySelector('.testi-dots');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');
  let current = 0, autoTimer;

  function setSlideWidths() {
    slides.forEach(s => { s.style.minWidth = '100%'; });
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'testi-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => { current = i; render(); resetAuto(); });
      dotsWrap.appendChild(d);
    });
  }

  function render() {
    const slideW = slides[0].offsetWidth;
    track.style.transform = `translateX(-${current * slideW}px)`;
    dotsWrap && dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function go(dir) {
    current = dir > 0 ? (current >= slides.length - 1 ? 0 : current + 1) : (current <= 0 ? slides.length - 1 : current - 1);
    render(); resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => go(1), 5500);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));

  setSlideWidths(); buildDots(); render(); resetAuto();

  let debounce;
  window.addEventListener('resize', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { render(); }, 150);
  }, { passive: true });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) go(diff > 0 ? 1 : -1);
  });
})();

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
});

/* ─── HERO PARTICLE CANVAS ─── */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '216,31,39' : '255,80,80';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  let mouseX = W/2, mouseY = H/2;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(216,31,39,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ─── SMOOTH LENIS-STYLE SCROLL ─── */
// Lightweight version without full Lenis library
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
}, { passive: true });

/* ─── PARALLAX ─── */
window.addEventListener('scroll', () => {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    const rect = el.getBoundingClientRect();
    const offset = (rect.top + rect.height/2 - window.innerHeight/2) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
}, { passive: true });

/* ─── FORM VALIDATION ─── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1200);
    }
  });
});

/* ─── ACTIVE NAV LINK ─── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('nav-active');
});
