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

// Demo form handler
(function () {
    const form = document.querySelector('.form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const original = button.textContent;
        button.disabled = true;
        button.textContent = 'Odesláno – děkujeme!';
        button.style.background = '#16a34a';
        button.style.boxShadow = 'none';
        form.reset();
        setTimeout(function () {
            button.disabled = false;
            button.textContent = original;
            button.style.background = '';
            button.style.boxShadow = '';
        }, 3500);
    });
})();
