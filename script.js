/* ==============================================
   script.js — Dennis Kamau Portfolio
   Mobile-first, fully fixed navigation
=============================================== */

/* ============================================
   1. DETECT TOUCH / MOBILE
============================================ */
const isMobile = () => window.innerWidth <= 900;
const isTouch  = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* ============================================
   2. CUSTOM CURSOR (desktop only)
============================================ */
if (!isTouch) {
    // Inject cursor elements only on desktop
    const cursorEl = document.createElement('div');
    cursorEl.id = 'cursor';
    cursorEl.style.cssText = `
        position:fixed;width:10px;height:10px;background:#00c8ff;
        border-radius:50%;pointer-events:none;z-index:9999;
        mix-blend-mode:screen;transition:transform 0.1s,background 0.2s;
    `;
    const ringEl = document.createElement('div');
    ringEl.id = 'cursor-ring';
    ringEl.style.cssText = `
        position:fixed;width:38px;height:38px;
        border:1.5px solid rgba(0,200,255,0.5);border-radius:50%;
        pointer-events:none;z-index:9998;
        transition:transform 0.18s ease,width 0.2s,height 0.2s,opacity 0.2s;
    `;
    document.body.appendChild(cursorEl);
    document.body.appendChild(ringEl);
    document.body.style.cursor = 'none';

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animCursor() {
        cursorEl.style.left = mx - 5 + 'px';
        cursorEl.style.top  = my - 5 + 'px';
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ringEl.style.left = rx - 19 + 'px';
        ringEl.style.top  = ry - 19 + 'px';
        requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll('a,button,.proj-card,.stat-block').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorEl.style.transform = 'scale(2.5)';
            cursorEl.style.background = '#00ff9d';
            ringEl.style.width = '55px';
            ringEl.style.height = '55px';
        });
        el.addEventListener('mouseleave', () => {
            cursorEl.style.transform = 'scale(1)';
            cursorEl.style.background = '#00c8ff';
            ringEl.style.width = '38px';
            ringEl.style.height = '38px';
        });
    });
}

/* ============================================
   3. PARTICLE NETWORK CANVAS
============================================ */
const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];
// Fewer particles on mobile = better performance
const COUNT  = isMobile() ? 40 : 80;
const DIST   = isMobile() ? 90 : 130;

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.4 + 0.4;
        this.a  = Math.random() * 0.45 + 0.15;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${this.a})`;
        ctx.fill();
    }
}
for (let i = 0; i < COUNT; i++) particles.push(new Particle());

function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx*dx + dy*dy);
            if (d < DIST) {
                const a = (1 - d / DIST) * 0.22;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,200,255,${a})`;
                ctx.lineWidth   = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================================
   4. SCROLL PROGRESS BAR
============================================ */
const bar = document.getElementById('progress-bar');
function updateProgress() {
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ============================================
   5. DESKTOP NAV SHRINK
============================================ */
const desktopNav = document.getElementById('main-nav');
if (desktopNav) {
    window.addEventListener('scroll', () => {
        desktopNav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

/* ============================================
   6. SCROLL REVEAL
============================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 55);
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ============================================
   7. SKILL BAR ANIMATION
============================================ */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.w + '%';
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
skillBars.forEach(b => barObs.observe(b));

/* ============================================
   8. COUNT-UP ANIMATION
============================================ */
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const target = +e.target.dataset.count;
            let cur = 0;
            const step = target / 40;
            const t = setInterval(() => {
                cur += step;
                if (cur >= target) {
                    e.target.textContent = target + '+';
                    clearInterval(t);
                } else {
                    e.target.textContent = Math.ceil(cur);
                }
            }, 28);
            countObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

/* ============================================
   9. MOBILE BOTTOM NAV — ACTIVE STATE + CLICK
   This is the main fix for mobile navigation
============================================ */
const sections  = document.querySelectorAll('section[id]');
const mobItems  = document.querySelectorAll('.mob-item');
const MOB_OFFSET = 80; // px offset for active detection

// Set active on scroll
function setActiveNav() {
    let current = sections[0]?.getAttribute('id') || '';
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= MOB_OFFSET) current = sec.getAttribute('id');
    });
    mobItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === current);
    });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav(); // run on load

// Handle tap/click on mobile nav items
mobItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').replace('#', '');
        const target   = document.getElementById(targetId);
        if (!target) return;

        // Update active immediately on tap
        mobItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Smooth scroll with offset for top bar
        const topBar   = document.querySelector('.mobile-topbar');
        const offset   = topBar ? topBar.offsetHeight + 8 : 0;
        const top      = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ============================================
   10. DESKTOP NAV SMOOTH SCROLL
============================================ */
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = desktopNav ? desktopNav.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ============================================
   11. CONTACT FORM — ASYNC SUBMIT
============================================ */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.textContent = 'Transmitting...';
        submitBtn.classList.add('sending');
        try {
            const res = await fetch(form.action, {
                method:  'POST',
                body:    new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                form.reset();
                submitBtn.textContent = '✓ Sent';
                successMsg.style.display = 'block';
                setTimeout(() => {
                    submitBtn.textContent = 'Send Transmission';
                    submitBtn.classList.remove('sending');
                    successMsg.style.display = 'none';
                }, 4000);
            } else {
                submitBtn.textContent = 'Error — Try Again';
                submitBtn.classList.remove('sending');
            }
        } catch {
            submitBtn.textContent = 'Error — Try Again';
            submitBtn.classList.remove('sending');
        }
    });
}

/* ============================================
   12. FIX iOS SCROLL BOUNCE ISSUE
   Prevents the nav from disappearing behind
   iOS Safari's bouncing scroll
============================================ */
document.addEventListener('touchmove', function(e) {
    // Allow scroll inside form textareas
}, { passive: true });