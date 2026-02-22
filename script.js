// ===== LOADING =====
window.addEventListener('load', () => setTimeout(() => document.querySelector('.loader').classList.add('hidden'), 2000));

// ===== PROGRESS BAR =====
const prog = document.querySelector('.progress');
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (window.scrollY / h * 100) + '%';
});

// ===== PARTICLES (sparse, elegant) =====
const cv = document.getElementById('particles'), cx = cv.getContext('2d');
let pts = [], mx = -100, my = -100;
function rsz() { cv.width = innerWidth; cv.height = innerHeight } rsz();
addEventListener('resize', rsz);

class P {
    constructor() { this.r() }
    r() {
        this.x = Math.random() * cv.width; this.y = Math.random() * cv.height; this.s = Math.random() * 1.2 + .3;
        this.vx = (Math.random() - .5) * .1; this.vy = (Math.random() - .5) * .1; this.o = Math.random() * .35 + .05; this.ph = Math.random() * Math.PI * 2
    }
    u() {
        this.x += this.vx; this.y += this.vy; this.ph += .005;
        if (this.x < 0 || this.x > cv.width) this.vx *= -1;
        if (this.y < 0 || this.y > cv.height) this.vy *= -1;
        const dx = mx - this.x, dy = my - this.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { this.x -= dx * .003; this.y -= dy * .003 }
        cx.beginPath(); cx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
        cx.fillStyle = `rgba(200,162,77,${Math.max(0, this.o + Math.sin(this.ph) * .08)})`; cx.fill()
    }
}
for (let i = 0; i < 40; i++)pts.push(new P);

function lines() {
    for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
            cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(200,162,77,${.025 * (1 - d / 140)})`; cx.lineWidth = .5; cx.stroke()
        }
    }
}

function anim() { cx.clearRect(0, 0, cv.width, cv.height); pts.forEach(p => p.u()); lines(); requestAnimationFrame(anim) } anim();

// ===== CURSOR =====
const cd = document.querySelector('.cur-d'), cr = document.querySelector('.cur-r');
let crx = -100, cry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cd.style.left = e.clientX - 2.5 + 'px'; cd.style.top = e.clientY - 2.5 + 'px' });
function uCur() { crx += (mx - crx) * .08; cry += (my - cry) * .08; cr.style.left = crx - 20 + 'px'; cr.style.top = cry - 20 + 'px'; requestAnimationFrame(uCur) } uCur();

document.querySelectorAll('a,button,.v-card,.man-item,.com-card,.meet-vis,.discord-card,.discord-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cr.classList.add('hov'));
    el.addEventListener('mouseleave', () => cr.classList.remove('hov'))
});

// ===== SPOTLIGHT HOVER ON CARDS =====
document.querySelectorAll('.v-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

// ===== 3D TILT ON CARDS =====
document.querySelectorAll('.v-card,.com-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = '' });
});

// ===== 3D TILT ON MEETINGS VISUAL =====
const meetVis = document.querySelector('.meet-vis');
if (meetVis) {
    meetVis.addEventListener('mousemove', e => {
        const r = meetVis.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        meetVis.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    });
    meetVis.addEventListener('mouseleave', () => { meetVis.style.transform = '' });
}

// ===== SCROLL REVEAL =====
const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') }) }, { threshold: .06, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.rv,.rv-3d').forEach(el => obs.observe(el));

// ===== NAV =====
addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', scrollY > 80));
function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); document.getElementById('hamburger').classList.toggle('active') }
function closeMenu() { document.getElementById('navLinks').classList.remove('open'); document.getElementById('hamburger').classList.remove('active') }

// ===== COUNTER =====
const cObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting) return; const el = e.target, t = +el.dataset.target, sf = el.dataset.suffix || '';
        let c = 0; const st = Math.max(t / 70, 1); const ti = setInterval(() => { c += st; if (c >= t) { el.textContent = t + sf; clearInterval(ti) } else el.textContent = Math.floor(c) + sf }, 18); cObs.unobserve(el)
    })
}, { threshold: .5 });
document.querySelectorAll('.c-num').forEach(c => cObs.observe(c));

// ===== PARALLAX HERO =====
document.addEventListener('mousemove', e => {
    const px = (e.clientX / innerWidth - .5) * 25, py = (e.clientY / innerHeight - .5) * 25;
    document.querySelectorAll('.hero-glow').forEach((g, i) => { const f = (i + 1) * .35; g.style.transform = `translate(${px * f}px,${py * f}px)` });
    document.querySelectorAll('.shape').forEach((s, i) => {
        const f = (i + 1) * .2;
        s.style.transform = `translate(${px * f}px,${py * f}px) rotateX(${py * f * .3}deg) rotateY(${px * f * .3}deg)`
    });
});

// ===== JOIN =====
function handleJoin(e) {
    e.preventDefault(); const btn = e.target.querySelector('button'), inp = document.getElementById('joinEmail');
    btn.textContent = 'Welcome ✦'; setTimeout(() => { btn.textContent = 'Join Free'; inp.value = '' }, 2500)
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', function (e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }) }) });

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-p,.btn-s,.nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * .15}px,${y * .15}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = '' });
});
