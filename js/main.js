/* ============================================
   MAIN.JS — Shared Interactive Logic
   ============================================ */

// ---- Scroll Reveal ----
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

// ---- Navbar Scroll ----
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  // Mobile toggle
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('.navbar__link').forEach(l => l.addEventListener('click', () => links.classList.remove('open')));
  }
  // Active link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(l => {
    const href = l.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) l.classList.add('active');
  });
}

// ---- Particles ----
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -999, y: -999 };
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = ['#00d4ff', '#a855f7', '#06fdd8'][Math.floor(Math.random() * 3)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      const dx = mouse.x - this.x, dy = mouse.y - this.y, dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) { this.x -= dx * 0.008; this.y -= dy * 0.008; this.opacity = Math.min(this.opacity + 0.02, 0.8); }
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }
  const count = Math.min(80, Math.floor(w * h / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0,212,255,' + (1 - dist/150) * 0.12 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

// ---- Custom Cursor ----
function initCursor() {
  if (window.innerWidth < 769) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function update() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(update);
  }
  update();
  document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ---- Typing Effect ----
function initTyping(elementId, words, speed = 100, pause = 2000) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let wordIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const word = words[wordIndex];
    if (deleting) {
      el.textContent = word.substring(0, charIndex--);
      if (charIndex < 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 400); return; }
    } else {
      el.textContent = word.substring(0, ++charIndex);
      if (charIndex === word.length) { deleting = true; setTimeout(type, pause); return; }
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

// ---- Tilt Effect ----
function initTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ---- Counter Animation ----
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initParticles();
  initCursor();
  if (document.getElementById('typing-text')) {
    initTyping('typing-text', ['Developer', 'IT Student', 'Problem Solver', 'Creative Technologist']);
  }
});
