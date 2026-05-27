/* ============================================================
   DENNIS KAMAU — script.js  (Complete v4)
   Preloader · PDF Modal · Reveal · Counters
   Mobile Nav · Smooth Scroll · Contact Form
============================================================ */

/* ============================================================
   1. PRELOADER — hides after page fully loads
============================================================ */
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    // Give the bar animation time to finish (2s) then fade out
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2200);
});

/* ============================================================
   2. PDF MODAL — view only, no download
============================================================ */
const pdfModal    = document.getElementById('pdf-modal');
const pdfFrame    = document.getElementById('pdf-frame');
const pdfClose    = document.getElementById('pdf-close');
const openBtn1    = document.getElementById('open-pdf-btn');
const openBtn2    = document.getElementById('open-pdf-btn-2');

// PDF source — Google Docs viewer strips download button
const PDF_SRC = 'https://docs.google.com/viewer?url=https://denniskamau.me/assets/Engineering_Portfolio.pdf&embedded=true';

function openPDF() {
    // Load the frame only when opened (saves bandwidth)
    if (!pdfFrame.src || pdfFrame.src === 'about:blank' || pdfFrame.src === '') {
        pdfFrame.src = PDF_SRC;
    }
    pdfModal.classList.add('open');
    document.body.style.overflow = 'hidden';
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
   3. DESKTOP NAV — shadow on scroll
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
            // Stagger each element slightly
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 90);
            revealObs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
});

revealEls.forEach(el => revealObs.observe(el));

/* ============================================================
   5. COUNT-UP ANIMATION
============================================================ */
const counters = document.querySelectorAll('[data-count]');

const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let current  = 0;
        const step   = target / 50;

        const tick = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.ceil(current) + '+';
            if (current >= target) clearInterval(tick);
        }, 28);

        countObs.unobserve(el);
    });
}, { threshold: 0.6 });

counters.forEach(c => countObs.observe(c));

/* ============================================================
   6. MOBILE BOTTOM NAV
   — active highlight synced with scroll position
   — tap triggers smooth scroll with offset
============================================================ */
const sections = document.querySelectorAll('section[id]');
const mobLinks = document.querySelectorAll('.mob-link');

function syncActiveNav() {
    let current = sections[0]?.id || '';
    const OFFSET = 90;
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= OFFSET) {
            current = sec.id;
        }
    });
    mobLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}

window.addEventListener('scroll', syncActiveNav, { passive: true });
syncActiveNav(); // run immediately on load

mobLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id     = this.getAttribute('href').replace('#', '');
        const target = document.getElementById(id);
        if (!target) return;

        // Immediately show active state on tap
        mobLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Scroll with top bar offset
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

// Logo click scrolls to top
document.querySelectorAll('.nav-logo').forEach(logo => {
    logo.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

/* ============================================================
   8. CONTACT FORM — async submit via Formspree
============================================================ */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Loading state
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

                // Reset after 5 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    submitBtn.classList.remove('sending');
                    successMsg.classList.remove('show');
                }, 5000);
            } else {
                throw new Error('Server error');
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