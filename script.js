/* ============================================================
   DENNIS KAMAU — script.js (v5)
   Intro · PDF Modal · Reveal · Counters · Nav · Form
============================================================ */

/* ============================================================
   1. CINEMATIC INTRO — 10 seconds, field-themed
============================================================ */
const introScreen = document.getElementById('intro-screen');
const enterBtn    = document.getElementById('intro-enter');
const countEl     = document.getElementById('intro-count');

let introCountdown = 4;
let countTimer;

function dismissIntro() {
    clearInterval(countTimer);
    introScreen.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger page reveals after intro
    triggerReveal();
}

// Block scroll during intro
document.body.style.overflow = 'hidden';

// Start the 4-second auto countdown (starts after phase-3 appears at 6s)
setTimeout(() => {
    countTimer = setInterval(() => {
        introCountdown--;
        if (countEl) countEl.textContent = introCountdown;
        if (introCountdown <= 0) dismissIntro();
    }, 1000);
}, 6200); // starts counting at ~6.2s (after "Enter Portfolio" button appears)

if (enterBtn) {
    enterBtn.addEventListener('click', dismissIntro);
}

// Safety fallback — always dismiss after 11s no matter what
setTimeout(dismissIntro, 11000);

/* ============================================================
   2. PDF MODAL
   Uses direct <object> embed — works on all hosting platforms
   including GitHub Pages. No Google Docs needed.
   The PDF path below assumes your file is at:
   assets/Engineering_Portfolio.pdf
============================================================ */
const pdfModal   = document.getElementById('pdf-modal');
const pdfFrame   = document.getElementById('pdf-frame');
const pdfLoading = document.getElementById('pdf-loading');
const pdfClose   = document.getElementById('pdf-close');
const openBtn1   = document.getElementById('open-pdf-btn');
const openBtn2   = document.getElementById('open-pdf-btn-2');

// Direct path to your PDF — adjust if different
const PDF_PATH = 'assets/Engineering_Portfolio.pdf';

function openPDF() {
    pdfModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Only load the iframe the first time
    if (!pdfFrame.src || pdfFrame.src === window.location.href) {
        pdfLoading.style.display  = 'flex';
        pdfFrame.style.display    = 'none';

        // Embed PDF with #toolbar=0 which hides the Chrome/Firefox download toolbar
        pdfFrame.src = PDF_PATH + '#toolbar=0&navpanes=0&scrollbar=1&view=FitH';

        pdfFrame.onload = () => {
            pdfLoading.style.display = 'none';
            pdfFrame.style.display   = 'block';
        };

        // Fallback if iframe fails to fire onload (some browsers)
        setTimeout(() => {
            pdfLoading.style.display = 'none';
            pdfFrame.style.display   = 'block';
        }, 3500);
    }
}

function closePDF() {
    pdfModal.classList.remove('open');
    document.body.style.overflow = '';
}

if (openBtn1) openBtn1.addEventListener('click', openPDF);
if (openBtn2) openBtn2.addEventListener('click', openPDF);
if (pdfClose) pdfClose.addEventListener('click', closePDF);

// Close on backdrop click
pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closePDF();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.classList.contains('open')) closePDF();
});

/* ============================================================
   3. DESKTOP NAV SHADOW
============================================================ */
const mainNav = document.getElementById('main-nav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

/* ============================================================
   4. SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 90);
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function triggerReveal() {
    revealEls.forEach(el => revealObs.observe(el));
}
// Also attach observer right away (for fast skips)
revealEls.forEach(el => revealObs.observe(el));

/* ============================================================
   5. COUNT-UP ANIMATION (FIXED — works on page load)
============================================================ */
const counters = document.querySelectorAll('[data-count]');

const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let   cur    = 0;
        const step   = Math.max(target / 50, 0.1);

        const tick = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = Math.ceil(cur) + '+';
            if (cur >= target) clearInterval(tick);
        }, 28);

        countObs.unobserve(el);
    });
}, { threshold: 0.5 });

counters.forEach(c => countObs.observe(c));

/* ============================================================
   6. MOBILE BOTTOM NAV — active state + smooth scroll
============================================================ */
const sections = document.querySelectorAll('section[id]');
const mobLinks = document.querySelectorAll('.mob-link');

function syncActiveNav() {
    let current = sections[0]?.id || '';
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= 90) current = sec.id;
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
        mobLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const topBar = document.querySelector('.mobile-topbar');
        const offset = topBar ? topBar.offsetHeight + 6 : 0;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ============================================================
   7. DESKTOP NAV SMOOTH SCROLL
============================================================ */
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
    a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = mainNav ? mainNav.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

document.querySelectorAll('.nav-logo').forEach(logo => {
    logo.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

/* ============================================================
   8. CONTACT FORM — async Formspree submit
============================================================ */
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
                method:  'POST',
                body:    new FormData(form),
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
                throw new Error('fail');
            }
        } catch {
            submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error — Try Again';
            submitBtn.classList.remove('sending');
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            }, 4000);
        }
    });
}