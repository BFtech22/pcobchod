// Mobile navigation toggle
(function () {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// Sticky header shadow on scroll
(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;
    function update() {
        if (window.scrollY > 12) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    update();
})();

// Scroll reveal via IntersectionObserver
(function () {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
})();

// Active section highlight in nav
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]:not(.btn)');
    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map();
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.length > 1) linkMap.set(href.slice(1), link);
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const link = linkMap.get(entry.target.id);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(function (l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
})();

// Web3Forms AJAX submission
(function () {
    const form = document.querySelector('.form');
    if (!form || !form.action) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const original = button.innerHTML;
        const origBg = button.style.background;
        const origShadow = button.style.boxShadow;
        button.disabled = true;
        button.innerHTML = 'Odesílám…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success !== false) {
                button.innerHTML = '✓ Odesláno – děkujeme!';
                button.style.background = '#16a34a';
                button.style.boxShadow = 'none';
                form.reset();
            } else {
                throw new Error(data.message || 'send failed');
            }
        } catch (err) {
            button.innerHTML = 'Chyba odeslání – zkuste znovu';
            button.style.background = '#9c0f11';
        }

        setTimeout(function () {
            button.disabled = false;
            button.innerHTML = original;
            button.style.background = origBg;
            button.style.boxShadow = origShadow;
        }, 4500);
    });
})();
