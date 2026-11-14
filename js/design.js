/* =============================================================
   MEJORAS DE INTERACCIÓN DEL DISEÑO EDITORIAL
   Archivo independiente: complementa js/script.js y js/viewer.js.
   ============================================================= */
(function () {
    'use strict';

    const $ = (sel) => document.querySelector(sel);

    /* --- Estado de la barra de navegación al hacer scroll --- */
    const nav = $('#siteNav');
    const updateNav = () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    /* --- Menú móvil --- */
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    const closeMenu = () => {
        if (!toggle || !links) return;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
        links.classList.remove('open');
    };
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });
        links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) closeMenu();
        }, { passive: true });
    }

    /* --- Scroll spy: resalta la sección visible --- */
    const navItems = Array.from(document.querySelectorAll('.nav-links a[data-nav]'));
    if ('IntersectionObserver' in window && navItems.length) {
        const sections = navItems
            .map((a) => document.getElementById(a.dataset.nav))
            .filter(Boolean);
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navItems.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === entry.target.id));
            });
        }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
        sections.forEach((s) => spy.observe(s));
    }

    /* --- Contadores de proyectos (se llenan cuando script.js inyecta las fichas) --- */
    const gallery = $('#projectGallery');
    const setCounts = () => {
        if (!gallery) return;
        const total = gallery.querySelectorAll('.project-card').length;
        if (!total) return;
        const label = String(total).padStart(2, '0');
        const heroCount = $('#projectCount');
        const indexCount = $('#projectIndexCount');
        if (heroCount) heroCount.textContent = label;
        if (indexCount) indexCount.textContent = label;
    };
    if (gallery) {
        if ('MutationObserver' in window) {
            const obs = new MutationObserver(() => {
                setCounts();
                if (gallery.querySelectorAll('.project-card').length) obs.disconnect();
            });
            obs.observe(gallery, { childList: true });
        }
        window.addEventListener('load', setCounts);
        setCounts();
    }

    /* --- Salto a la galería dentro de la ficha de proyecto --- */
    const sheetJump = $('#sheetJump');
    if (sheetJump) {
        sheetJump.addEventListener('click', () => {
            const gallery = $('#sheet-gallery');
            if (gallery) gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* --- Reajustar el titular de la ficha al girar la pantalla --- */
    window.addEventListener('resize', () => {
        const modal = $('#projectModal');
        if (modal && modal.style.display === 'block' && typeof fitDisplayTitle === 'function') {
            fitDisplayTitle($('#modalTitle'));
        }
    }, { passive: true });

    /* --- Año del footer --- */
    const year = $('#footerYear');
    if (year) year.textContent = String(new Date().getFullYear());
})();
