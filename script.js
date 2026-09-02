
'use strict';

// 1. THEME  (dark/light toggle + colour picker) 
(function initTheme() {
  // Dark / Light toggle 
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const MOON = '🌙', SUN = '☀️';

  function applyLight(isLight) {
    body.classList.toggle('light', isLight);
    if (toggleBtn) {
      toggleBtn.textContent = isLight ? MOON : SUN;
      toggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }

  const savedMode = localStorage.getItem('theme');
  const preferLight = savedMode ? savedMode === 'light'
    : window.matchMedia('(prefers-color-scheme: light)').matches;
  applyLight(preferLight);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = body.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      applyLight(isLight);
    });
  }

  /* Colour Theme Picker */
  const pickerBtn = document.getElementById('theme-picker-btn');
  const pickerPanel = document.getElementById('theme-picker-panel');
  const swatches = document.querySelectorAll('.swatch');
  const root = document.documentElement;

  // Colour definitions: maps data-theme CSS vars
  const THEMES = {
    cyan: { accent: '#00f5ff', accent2: '#f5c518', glassBdr: 'rgba(0,245,255,0.15)', btnGlow: 'rgba(0,245,255,0.35)' },
    violet: { accent: '#a855f7', accent2: '#e879f9', glassBdr: 'rgba(168,85,247,0.18)', btnGlow: 'rgba(168,85,247,0.35)' },
    rose: { accent: '#f43f5e', accent2: '#fb7185', glassBdr: 'rgba(244,63,94,0.18)', btnGlow: 'rgba(244,63,94,0.35)' },
    amber: { accent: '#f59e0b', accent2: '#fbbf24', glassBdr: 'rgba(245,158,11,0.18)', btnGlow: 'rgba(245,158,11,0.35)' },
    emerald: { accent: '#10b981', accent2: '#34d399', glassBdr: 'rgba(16,185,129,0.18)', btnGlow: 'rgba(16,185,129,0.35)' },
    sky: { accent: '#38bdf8', accent2: '#7dd3fc', glassBdr: 'rgba(56,189,248,0.18)', btnGlow: 'rgba(56,189,248,0.35)' },
  };

  function applyAccent(themeName) {
    const t = THEMES[themeName] || THEMES.cyan;
    root.setAttribute('data-accent', themeName);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent2', t.accent2);
    root.style.setProperty('--glass-bdr', t.glassBdr);
    root.style.setProperty('--btn-glow', t.btnGlow);

    // Update active swatch ring
    swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === themeName));
  }

  // Load saved accent (default: cyan)
  const savedAccent = localStorage.getItem('accent') || 'cyan';
  applyAccent(savedAccent);

  // Toggle picker panel open/close
  if (pickerBtn && pickerPanel) {
    pickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pickerPanel.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!pickerPanel.contains(e.target) && e.target !== pickerBtn) {
        pickerPanel.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') pickerPanel.classList.remove('open');
    });
  }

  // Swatch clicks
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const themeName = swatch.dataset.theme;
      applyAccent(themeName);
      localStorage.setItem('accent', themeName);
      // Close panel after a short delay so user sees the ring animate
      setTimeout(() => pickerPanel && pickerPanel.classList.remove('open'), 250);
    });
  });
})();

// 2. MAIN  (cursor, preloader, navbar, typed, counters, skills, slideshow)

// Preloader 
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.classList.add('hidden');
    setTimeout(() => pre.remove(), 700);
  }
});

// Custom Cursor
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
  });

  function animateRing() {
    rx += (dx - rx) * 0.12;
    ry += (dy - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mousedown', () => ring.style.transform = 'translate(-50%,-50%) scale(0.75)');
  document.addEventListener('mouseup', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');

  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(1.6)'; ring.style.opacity = '0.4'; });
    el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '0.6'; });
  });
})();

// Navbar scroll + active link
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Back-to-top
    const btn = document.getElementById('back-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 300);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const ham = document.getElementById('nav-hamburger');
  const menu = document.querySelector('.nav-links');
  if (ham && menu) {
    ham.addEventListener('click', () => {
      menu.classList.toggle('open');
      ham.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  // Back to top
  const btt = document.getElementById('back-top');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

//Typed.js (vanilla)
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = ['CS Engineer', 'ML Enthusiast', 'Problem Solver', 'Java Developer', 'Python Developer'];
  let wi = 0, ci = 0, deleting = false;
  const typingSpeed = 90, deletingSpeed = 45, pauseMs = 1800;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, pauseMs); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
  }
  setTimeout(type, 800);
})();

// Intersection Observer reveal
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Stat Counters
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// Skill bar animations
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// About Image Slideshow
(function initAboutSlideshow() {
  const slides = document.querySelectorAll('#about-slideshow .slide');
  if (slides.length < 2) return;

  let currentIndex = 0;
  let slideshowTimer = null;

  function nextSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }

  function startSlideshow() {
    if (!slideshowTimer) {
      slideshowTimer = setInterval(nextSlide, 2000);
    }
  }

  function stopSlideshow() {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  // Pause when tab is hidden (saves CPU/battery)
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopSlideshow() : startSlideshow();
  });

  startSlideshow();
})();

// 3. VALIDATION  (contact form – fully client-side)

(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('cf-name');
  const emailInput = document.getElementById('cf-email');
  const messageInput = document.getElementById('cf-message');
  const successBox = document.getElementById('cf-success');

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = document.getElementById(input.id + '-error');
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = document.getElementById(input.id + '-error');
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
  }

  // Anti-Spam & Fake Email Protection Lists
  const DISPOSABLE_DOMAINS = [
    'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'trashmail.com', 'fakeinbox.com', 'yopmail.com', 'dispostable.com',
    'sharklasers.com', 'getnada.com', 'temp-mail.org', 'throwawaymail.com',
    'maildrop.cc', 'inboxalias.com', 'crazymailing.com', 'tmail.ws',
    'tempmail.net', 'byom.de', 'dayrep.com', 'teleworm.us', 'armyspy.com'
  ];

  const FAKE_PATTERNS = [
    'test@test.com', 'asdf@asdf.com', 'abc@abc.com', '123@123.com',
    'test@gmail.com', 'fake@fake.com', 'sample@sample.com', 'a@b.com'
  ];

  function validateEmail(v) {
    // Strict format check
    const isValidFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(v);
    if (!isValidFormat) return false;

    const lower = v.toLowerCase();
    const domain = lower.split('@')[1];

    // Block known dummy/fake patterns
    if (FAKE_PATTERNS.includes(lower)) return false;

    // Block disposable email providers
    if (DISPOSABLE_DOMAINS.includes(domain)) return false;

    return true;
  }

  // Live validation
  [nameInput, emailInput, messageInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => clearError(inp));
    inp.addEventListener('blur', () => validateField(inp));
  });

  function validateField(inp) {
    const v = inp.value.trim();
    if (inp === nameInput) {
      if (!v) return showError(inp, 'Name is required.');
      if (v.length < 2) return showError(inp, 'Name must be at least 2 characters.');
      if (/^[0-9]+$/.test(v)) return showError(inp, 'Please enter a valid name.');
    }
    if (inp === emailInput) {
      if (!v) return showError(inp, 'Email is required.');
      if (!validateEmail(v)) return showError(inp, 'Please enter a valid, non-disposable email address.');
    }
    if (inp === messageInput) {
      if (!v) return showError(inp, 'Message is required.');
      if (v.length < 10) return showError(inp, 'Message must be at least 10 characters.');
    }
    clearError(inp);
  }

  form.addEventListener('submit', e => {
    e.preventDefault(); // Always handle client-side — no server required

    // Check Honeypot Trap (Automated bots trigger this)
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) {
      // Silent discard for bots
      return;
    }

    let valid = true;

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Name
    if (!name) { showError(nameInput, 'Name is required.'); valid = false; }
    else if (name.length < 2 || /^[0-9]+$/.test(name)) { showError(nameInput, 'Please enter a valid name.'); valid = false; }
    else clearError(nameInput);

    // Email
    if (!email) { showError(emailInput, 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError(emailInput, 'Please enter a valid, non-disposable email address.'); valid = false; }
    else clearError(emailInput);

    // Message
    if (!message) { showError(messageInput, 'Message is required.'); valid = false; }
    else if (message.length < 10) { showError(messageInput, 'Message must be at least 10 characters.'); valid = false; }
    else clearError(messageInput);

    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message →';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    // Submit message directly to spal973547@gmail.com via FormSubmit AJAX with anti-spam protections
    fetch('https://formsubmit.co/ajax/spal973547@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Portfolio Message from ${name}`,
        _template: 'table',
        _captcha: 'false'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (successBox) {
          successBox.textContent = "✓ Your message has been sent successfully! I'll get back to you soon.";
          successBox.classList.add('show');
          form.reset();
          setTimeout(() => successBox.classList.remove('show'), 6000);
        }
      })
      .catch(() => {
        if (successBox) {
          successBox.textContent = '⚠ Failed to send. Please try emailing directly at spal973547@gmail.com';
          successBox.classList.add('show');
          setTimeout(() => successBox.classList.remove('show'), 7000);
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
  });
})();

//4. PARTICLES  (hero canvas animation)

(function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const properties = {
    bgColor: 'rgba(0, 0, 0, 0)',
    particleColor: 'rgba(255, 255, 255, 0.4)',
    lineColor: 'rgba(255, 255, 255, 0.1)',
    particleRadius: 1.5,
    particleCount: 60,
    particleMaxVelocity: 0.5,
    lineLength: 120,
    mouseRadius: 150
  };

  let mouse = { x: null, y: null };

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      this.radius = properties.particleRadius * (Math.random() + 0.5);
    }
    position() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < properties.mouseRadius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (properties.mouseRadius - distance) / properties.mouseRadius;
          let directionX = forceDirectionX * force * 2;
          let directionY = forceDirectionY * force * 2;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      if (this.x + this.radius > width || this.x - this.radius < 0) this.velocityX *= -1;
      if (this.y + this.radius > height || this.y - this.radius < 0) this.velocityY *= -1;

      this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
    }
    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
    }
  }

  function redrawBackground() { ctx.clearRect(0, 0, width, height); }

  function drawLines() {
    let x1, y1, x2, y2, length, opacity;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        x1 = particles[i].x; y1 = particles[i].y;
        x2 = particles[j].x; y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (length < properties.lineLength) {
          opacity = 1 - length / properties.lineLength;
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + opacity * 0.3 + ')';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    redrawBackground();
    for (let i = 0; i < particles.length; i++) {
      particles[i].position();
      particles[i].reDraw();
    }
    drawLines();
    requestAnimationFrame(loop);
  }

  function init() {
    resizeCanvas();
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push(new Particle());
    }
    loop();
  }

  window.addEventListener('resize', resizeCanvas);

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  init();
})();

// Dynamic Copyright Year
(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
