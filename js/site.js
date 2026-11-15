/* =============================================================
   IMÁGENES CONFIGURABLES DEL SITIO
   Lee data/site.json y aplica las rutas a los <img data-site-image>.
   index.html conserva un src válido como respaldo: si el JSON falta
   o falla la red, la portada sigue viéndose exactamente igual.
   El panel admin.html escribe este archivo en disco.
   ============================================================= */
(function () {
    'use strict';

    /* Mismo patrón que SITE_PATH_RE en admin.html: si aquí fuera más estricto,
       una ruta guardada desde el panel se ignoraría en silencio y la portada
       seguiría mostrando la imagen anterior. Se rechaza cualquier '..'. */
    const VALID_PATH = /^img\/[A-Za-z0-9._%\-/]+\.(?:webp|png|jpe?g|svg|gif)$/i;

    async function applySiteImages() {
        let data;
        try {
            const response = await fetch(`data/site.json?t=${Date.now()}`, { cache: 'no-store' });
            if (!response.ok) return;
            data = await response.json();
        } catch (error) {
            return; // el src del HTML ya es un respaldo válido
        }

        const images = data && data.images;
        if (!images || typeof images !== 'object') return;

        document.querySelectorAll('img[data-site-image]').forEach((img) => {
            const path = images[img.dataset.siteImage];
            if (typeof path !== 'string' || path.includes('..') || !VALID_PATH.test(path.trim())) return;
            const clean = path.trim();
            if (img.getAttribute('src') === clean) return;
            img.src = clean;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySiteImages);
    } else {
        applySiteImages();
    }
})();
