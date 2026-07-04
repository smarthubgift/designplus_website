// ============================================================
// DESIGNPLUS — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const pre = document.getElementById('preloader');
  if (pre) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pre.classList.add('hide');
        document.body.style.overflow = '';
      }, 2600);
    });
    document.body.style.overflow = 'hidden';
    // Safety fallback in case load event is delayed
    setTimeout(() => { pre.classList.add('hide'); document.body.style.overflow=''; }, 4200);
  }

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.querySelector('header.site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(10,21,38,.92)';
      nav.style.boxShadow = '0 10px 30px rgba(0,0,0,.25)';
    } else {
      nav.style.background = 'rgba(10,21,38,.72)';
      nav.style.boxShadow = 'none';
    }
    // back to top button
    const toTop = document.querySelector('.to-top');
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(eased * target);
        el.textContent = val + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countIO.observe(el));

  /* ---------- Portfolio filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pCards = document.querySelectorAll('.p-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      pCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Lightbox gallery ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCap = lightbox.querySelector('.lightbox-cap');
    document.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('h3')?.textContent || '';
        const loc = card.querySelector('.p-loc span')?.textContent || '';
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = title + (loc ? ' — ' + loc : '');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLB);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });
    function closeLB() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Back to top ---------- */
  const toTopBtn = document.querySelector('.to-top');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact form validation ---------- */
  const form = document.querySelector('form.inquiry');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const errEl = field.closest('.field').querySelector('.err');
        let msg = '';
        if (!field.value.trim()) {
          msg = 'This field is required.';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          msg = 'Enter a valid email address.';
        } else if (field.type === 'tel' && field.value.trim().length < 7) {
          msg = 'Enter a valid phone number.';
        }
        if (errEl) errEl.textContent = msg;
        if (msg) valid = false;
      });
      if (!valid) {
        status.textContent = '';
        return;
      }
      status.textContent = 'Sending…';
      setTimeout(() => {
        status.textContent = 'Thank you — your enquiry has been received. We\u2019ll respond within one business day.';
        form.reset();
      }, 900);
    });
    form.querySelectorAll('input,textarea,select').forEach(f => {
      f.addEventListener('input', () => {
        const errEl = f.closest('.field').querySelector('.err');
        if (errEl) errEl.textContent = '';
      });
    });
  }

  /* ---------- Lazy image fade-in ---------- */
  document.querySelectorAll('img.lazy').forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  });

});
