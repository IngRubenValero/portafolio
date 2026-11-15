/* =============================================================
   TEXTOS Y ENLACES CONFIGURABLES DEL SITIO
   Lee data/content.json y aplica los valores a [data-content],
   [data-content-text] y [data-content-link]. El HTML conserva los
   textos actuales como respaldo: si el JSON falta, falla la red o
   una clave no es válida, la portada sigue viéndose exactamente igual.
   admin.html escribe data/content.json, NUNCA index.html.
   ============================================================= */
(function () {
    'use strict';

    const FALLBACK = { email: 'Ing.RubenValero@outlook.com', phone: '59176982955' };
    const state = { texts: {}, links: {}, loaded: false };
    const VALID_KEY = /^[A-Za-z][A-Za-z0-9]*$/;
    const isEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

    function hrefFor(key) {
        const value = String(state.links[key] || '').trim();
        switch (key) {
            case 'email': {
                const mail = String(state.links.email || FALLBACK.email).trim();
                return isEmail(mail) ? 'mailto:' + mail : '';
            }
            case 'emailConsulta': {
                const mail = String(state.links.email || FALLBACK.email).trim();
                return isEmail(mail)
                    ? 'mailto:' + mail + '?subject=Consulta%20de%20proyecto%20estructural' : '';
            }
            case 'phone': {
                const digits = String(state.links.phone || FALLBACK.phone).replace(/[^0-9]/g, '');
                return digits ? 'tel:+' + digits : '';
            }
            case 'whatsapp': {
                const digits = String(state.links.phone || FALLBACK.phone).replace(/[^0-9]/g, '');
                return digits ? 'https://wa.me/' + digits : '';
            }
            case 'linkedin':
            case 'cv': {
                try {
                    const url = new URL(value);
                    return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : '';
                } catch (e) { return ''; }
            }
            default: return '';
        }
    }

    function textFor(key) {
        if (key === 'phoneLabel') return String(state.links.phoneLabel || '').trim();
        if (key === 'email') return String(state.links.email || FALLBACK.email).trim();
        return String(state.texts[key] || '').trim();
    }

    /* Saltos de línea y **negrita** sin innerHTML: el texto lo escribe el
       usuario en el admin y nunca debe interpretarse como marcado. */
    function setLines(el, value) {
        el.textContent = '';
        String(value).split('\n').forEach((line, i) => {
            if (i) el.appendChild(document.createElement('br'));
            el.appendChild(document.createTextNode(line));
        });
    }

    function setRich(el, value) {
        el.textContent = '';
        String(value).split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
            if (!part) return;
            if (part.startsWith('**') && part.endsWith('**')) {
                const strong = document.createElement('strong');
                strong.textContent = part.slice(2, -2);
                el.appendChild(strong);
            } else {
                el.appendChild(document.createTextNode(part));
            }
        });
    }

    function apply() {
        document.querySelectorAll('[data-content]').forEach((el) => {
            const key = el.dataset.content;
            if (!VALID_KEY.test(key) || !(key in state.texts)) return;
            const value = String(state.texts[key]);
            if (el.hasAttribute('data-content-lines')) setLines(el, value);
            else if (el.hasAttribute('data-content-bold')) setRich(el, value);
            else el.textContent = value;
        });

        document.querySelectorAll('[data-content-text]').forEach((el) => {
            const value = textFor(el.dataset.contentText);
            if (value) el.textContent = value;
        });

        document.querySelectorAll('[data-content-link]').forEach((el) => {
            const href = hrefFor(el.dataset.contentLink);
            if (href) el.setAttribute('href', href);
        });

        if (state.texts.pageTitle) {
            document.title = state.texts.pageTitle;
            ['meta[property="og:title"]', 'meta[property="twitter:title"]'].forEach((sel) => {
                const meta = document.querySelector(sel);
                if (meta) meta.setAttribute('content', state.texts.pageTitle);
            });
        }
        if (state.texts.metaDescription) {
            ['meta[name="description"]', 'meta[property="og:description"]',
             'meta[property="twitter:description"]'].forEach((sel) => {
                const meta = document.querySelector(sel);
                if (meta) meta.setAttribute('content', state.texts.metaDescription);
            });
        }
    }

    /* API que consume js/script.js para el mailto de la ficha y el
       WhatsApp de los productos. Lee el estado en el momento de la llamada,
       así funciona aunque el fetch termine después de cargar script.js. */
    window.SiteContent = {
        email: () => String(state.links.email || FALLBACK.email).trim(),
        phone: () => String(state.links.phone || FALLBACK.phone).replace(/[^0-9]/g, ''),
        text: (key) => String(state.texts[key] || ''),
        get loaded() { return state.loaded; }
    };

    async function load() {
        try {
            const res = await fetch(`data/content.json?t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            if (!data || typeof data.texts !== 'object' || !data.texts ||
                typeof data.links !== 'object' || !data.links) return;
            state.texts = data.texts;
            state.links = data.links;
            state.loaded = true;
            apply();
        } catch (e) {
            /* el HTML ya trae los textos correctos como respaldo */
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load);
    } else {
        load();
    }
})();
