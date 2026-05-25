/* ============================================================
   DENNIS KAMAU — script.js
   Professional Portfolio · Mobile-First
============================================================ */

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
}, { passive: true });

/* ---------- STICKY NAV SHADOW ---------- */
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ---------- COUNT-UP NUMBERS ---------- */
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = +entry.target.dataset.count;
        let cur = 0;
        const step = target / 50;
        const tick = setInterval(() => {
            cur = Math.min(cur + step, target);
            entry.target.textContent = Math.ceil(cur) + (target > 10 ? '+' : '+');
            if (cur >= target) clearInterval(tick);
        }, 28);
        countObs.unobserve(entry.target);
    });
}, { threshold: 0.6 });
counters.forEach(c => countObs.observe(c));

/* ---------- MOBILE BOTTOM NAV — ACTIVE + CLICK ---------- */
const sections = document.querySelectorAll('section[id]');
const mobLinks = document.querySelectorAll('.mob-link');

function syncActiveNav() {
    let current = sections[0]?.id || '';
    const offset = 100;
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= offset) current = sec.id;
    });
    mobLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}
window.addEventListener('scroll', syncActiveNav, { passive: true });
syncActiveNav();

mobLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id     = this.getAttribute('href').replace('#', '');
        const target = document.getElementById(id);
        if (!target) return;

        // Instantly highlight tapped item
        mobLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Scroll with offset for mobile top bar
        const topBar = document.querySelector('.mobile-topbar');
        const offset = topBar ? topBar.offsetHeight + 8 : 0;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ---------- DESKTOP NAV SMOOTH SCROLL ---------- */
document.querySelectorAll('.nav-links a:not(.nav-cta), .nav-logo').forEach(a => {
    a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = mainNav ? mainNav.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ---------- CONTACT FORM — ASYNC SUBMIT ---------- */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.classList.add('sending');

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body:   new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                form.reset();
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
                successMsg.classList.add('show');
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    submitBtn.classList.remove('sending');
                    successMsg.classList.remove('show');
                }, 5000);
            } else {
                submitBtn.innerHTML = 'Error — Try Again';
                submitBtn.classList.remove('sending');
            }
        } catch {
            submitBtn.innerHTML = 'Error — Try Again';
            submitBtn.classList.remove('sending');
        }
    });
}