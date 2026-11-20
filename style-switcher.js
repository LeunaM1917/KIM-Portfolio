(() => {
    'use strict';
    const toggle = document.querySelector('.style-switcher-toggler');
    const panel = document.querySelector('.style-switcher');
    const options = document.getElementById('theme-options');
    const styles = document.querySelectorAll('.alternate-style');
    const swatches = document.querySelectorAll('[data-color]');
    const dayNight = document.querySelector('.day-night');
    const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
    const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
    function closePanel() {
        const hadFocus = options.contains(document.activeElement);
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        options.inert = true;
        if (hadFocus) toggle.focus({ preventScroll: true });
    }
    toggle.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        options.inert = !open;
    });
    window.addEventListener('scroll', closePanel, { passive: true });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanel(); });
    function setActiveStyle(color) {
        if (![...styles].some(style => style.title === color)) color = 'color-1';
        styles.forEach(style => { style.disabled = style.title !== color; });
        swatches.forEach(swatch => {
            const active = swatch.dataset.color === color;
            swatch.classList.toggle('active', active);
            swatch.setAttribute('aria-pressed', String(active));
        });
        save('portfolio-color', color);
    }
    swatches.forEach(swatch => swatch.addEventListener('click', () => setActiveStyle(swatch.dataset.color)));
    function setDark(dark) {
        document.body.classList.toggle('dark', dark);
        dayNight.setAttribute('aria-pressed', String(dark));
        dayNight.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        dayNight.querySelector('i').classList.toggle('fa-sun', dark);
        dayNight.querySelector('i').classList.toggle('fa-moon', !dark);
        save('portfolio-dark', dark);
    }
    dayNight.addEventListener('click', () => setDark(!document.body.classList.contains('dark')));
    setActiveStyle(read('portfolio-color') || 'color-1');
    setDark(read('portfolio-dark') === 'true');
})();
