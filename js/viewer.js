/* =============================================================
   VISOR DE IMÁGENES — móvil primero, sin dependencias
   Reemplaza al lightbox anterior. Usa Pointer Events (ratón,
   táctil y lápiz) con touch-action: none, por lo que el navegador
   no se queda los gestos: swipe, pinch, doble toque y arrastre
   funcionan igual en escritorio y en el teléfono.
   ============================================================= */
(function () {
    'use strict';

    const MIN = 1, MAX = 5, STEP = 0.5, DOUBLE_ZOOM = 2.5;
    const $ = (id) => document.getElementById(id);

    const root = $('viewer');
    const stage = $('viewerStage');
    const img = $('viewerImage');
    const loader = $('viewerLoading');
    const titleEl = $('viewerTitle');
    const counterEl = $('viewerCounter');
    const thumbsEl = $('viewerThumbs');
    const hintEl = $('viewerHint');
    const zoomLabel = $('viewerZoomReset');
    const closeBtn = $('viewerClose');
    const prevBtn = $('viewerPrev');
    const nextBtn = $('viewerNext');

    if (!root || !stage || !img) return;

    const state = {
        open: false,
        gallery: [],
        title: '',
        index: 0,
        zoom: 1,
        tx: 0,
        ty: 0,
        pointers: new Map(),
        pinchStartDist: 0,
        pinchStartZoom: 1,
        dragStart: null,
        moved: false,
        lastTap: 0,
        lastTapX: 0,
        lastTapY: 0,
        loadToken: 0,
        savedOverflow: '',
        savedFocus: null,
        hintTimer: null
    };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function setKeyboardFlag(value) {
        try {
            if (typeof lightboxState !== 'undefined') lightboxState.isOpen = value;
        } catch (e) { /* el puente no está disponible */ }
    }

    function applyTransform() {
        const maxX = (img.offsetWidth * (state.zoom - 1)) / 2;
        const maxY = (img.offsetHeight * (state.zoom - 1)) / 2;
        state.tx = clamp(state.tx, -maxX, maxX);
        state.ty = clamp(state.ty, -maxY, maxY);
        img.style.transform = `translate3d(${state.tx}px, ${state.ty}px, 0) scale(${state.zoom})`;
        zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
    }

    function resetZoom() {
        state.zoom = 1;
        state.tx = 0;
        state.ty = 0;
        applyTransform();
    }

    function zoom(direction) {
        const next = direction === 'in'
            ? Math.min(MAX, state.zoom + STEP)
            : Math.max(MIN, state.zoom - STEP);
        if (next === state.zoom) return;
        state.zoom = next;
        if (next <= MIN) { state.tx = 0; state.ty = 0; }
        applyTransform();
        hideHint();
    }

    function hideHint() {
        if (hintEl) hintEl.classList.add('hidden');
    }

    function scheduleHint() {
        if (!hintEl) return;
        hintEl.classList.remove('hidden');
        clearTimeout(state.hintTimer);
        state.hintTimer = setTimeout(hideHint, 5000);
    }

    function preload(index) {
        state.gallery.forEach((src, i) => {
            if (Math.abs(i - index) === 1) {
                const pre = new Image();
                pre.src = src;
            }
        });
    }

    function buildThumbs() {
        if (!thumbsEl) return;
        thumbsEl.innerHTML = '';
        state.gallery.forEach((src, i) => {
            const btn = document.createElement('button');
            btn.className = 'viewer-thumb';
            btn.type = 'button';
            btn.setAttribute('aria-label', `Ver imagen ${i + 1} de ${state.gallery.length}`);
            btn.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async">`;
            btn.addEventListener('click', () => show(i));
            thumbsEl.appendChild(btn);
        });
    }

    function show(index) {
        if (!state.gallery.length) return;
        state.index = (index + state.gallery.length) % state.gallery.length;
        resetZoom();

        const token = ++state.loadToken;
        img.classList.add('loading', 'dragging');
        if (loader) loader.classList.add('active');
        img.alt = `${state.title} — imagen ${state.index + 1} de ${state.gallery.length}`;
        img.src = state.gallery[state.index];

        const done = () => {
            if (token !== state.loadToken) return;
            img.classList.remove('loading', 'dragging');
            if (loader) loader.classList.remove('active');
            applyTransform();
        };
        if (img.complete && img.naturalWidth > 0) {
            done();
        } else {
            img.onload = done;
            img.onerror = done;
        }

        if (counterEl) counterEl.textContent = `${state.index + 1} / ${state.gallery.length}`;
        if (titleEl) titleEl.textContent = state.title;
        const thumbnails = thumbsEl ? thumbsEl.querySelectorAll('.viewer-thumb') : [];
        thumbnails.forEach((t, i) => t.classList.toggle('active', i === state.index));
        const active = thumbnails[state.index];
        if (active && active.scrollIntoView) {
            active.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
        preload(state.index);
    }

    function navigate(direction) {
        if (!state.open) return;
        show(state.index + direction);
        hideHint();
    }

    function open(project, index) {
        if (!project || !Array.isArray(project.gallery) || !project.gallery.length) return;
        state.gallery = project.gallery.slice();
        state.title = project.title || '';
        state.open = true;
        setKeyboardFlag(true);
        state.savedOverflow = document.body.style.overflow;
        state.savedFocus = document.activeElement;

        buildThumbs();
        show(index || 0);
        root.classList.add('open');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        scheduleHint();
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function close() {
        if (!state.open) return;
        state.open = false;
        setKeyboardFlag(false);
        root.classList.remove('open');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = state.savedOverflow || '';
        clearTimeout(state.hintTimer);
        state.pointers.clear();
        state.dragStart = null;
        if (state.savedFocus && state.savedFocus.focus) {
            state.savedFocus.focus({ preventScroll: true });
        }
    }

    /* ---------- Gestos con Pointer Events ---------- */
    function pointerDistance() {
        const pts = Array.from(state.pointers.values());
        if (pts.length < 2) return 0;
        return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }

    stage.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.viewer-nav')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (state.pointers.size === 1) {
            state.dragStart = { x: e.clientX, y: e.clientY, time: Date.now(), dx: 0, dy: 0 };
            state.moved = false;
            img.classList.add('dragging');
        } else if (state.pointers.size === 2) {
            state.pinchStartDist = pointerDistance();
            state.pinchStartZoom = state.zoom;
            state.dragStart = null;
            img.classList.add('dragging');
        }
    });

    stage.addEventListener('pointermove', (e) => {
        if (!state.pointers.has(e.pointerId)) return;
        e.preventDefault();
        state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (state.pointers.size >= 2) {
            const dist = pointerDistance();
            if (state.pinchStartDist > 0 && dist > 0) {
                state.zoom = clamp(state.pinchStartZoom * (dist / state.pinchStartDist), MIN, MAX);
                if (state.zoom <= MIN) { state.tx = 0; state.ty = 0; }
                applyTransform();
                hideHint();
            }
            return;
        }

        const start = state.dragStart;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        start.dx = dx;
        start.dy = dy;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) state.moved = true;

        if (state.zoom > 1) {
            state.tx += dx;
            state.ty += dy;
            start.x = e.clientX;
            start.y = e.clientY;
            applyTransform();
            hideHint();
        } else if (Math.abs(dx) > Math.abs(dy)) {
            img.style.transform = `translate3d(${dx * 0.25}px, 0, 0) scale(1)`;
        }
    });

    function endPointer(e) {
        if (!state.pointers.has(e.pointerId)) return;
        state.pointers.delete(e.pointerId);
        try { stage.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }

        if (state.pointers.size > 0) return;

        const start = state.dragStart;
        state.dragStart = null;
        img.classList.remove('dragging');

        if (!start) { applyTransform(); return; }

        const duration = Date.now() - start.time;
        const dx = start.dx;
        const dy = start.dy;

        if (state.zoom <= 1 && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
            navigate(dx < 0 ? 1 : -1);
            state.lastTap = 0;
            return;
        }

        if (!state.moved && duration < 260) {
            const now = Date.now();
            const near = Math.hypot(e.clientX - state.lastTapX, e.clientY - state.lastTapY) < 40;
            if (now - state.lastTap < 320 && near) {
                if (state.zoom > 1) {
                    resetZoom();
                } else {
                    const rect = stage.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    state.zoom = DOUBLE_ZOOM;
                    state.tx = clamp((cx - e.clientX) * 0.6, -400, 400);
                    state.ty = clamp((cy - e.clientY) * 0.6, -400, 400);
                    applyTransform();
                }
                hideHint();
                state.lastTap = 0;
                return;
            }
            state.lastTap = now;
            state.lastTapX = e.clientX;
            state.lastTapY = e.clientY;
        }
        applyTransform();
    }

    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    stage.addEventListener('wheel', (e) => {
        if (!state.open) return;
        e.preventDefault();
        zoom(e.deltaY < 0 ? 'in' : 'out');
    }, { passive: false });

    /* ---------- Controles ---------- */
    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));
    $('viewerZoomIn')?.addEventListener('click', () => zoom('in'));
    $('viewerZoomOut')?.addEventListener('click', () => zoom('out'));
    zoomLabel?.addEventListener('click', resetZoom);
    window.addEventListener('resize', () => { if (state.open) applyTransform(); });

    /* API pública: el puente en script.js delega aquí */
    window.Viewer = { open, close, navigate, zoom, resetZoom };
})();
