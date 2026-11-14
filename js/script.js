// ===============================================
// DATOS DE PROYECTOS - Se cargan desde data/projects.json
// ===============================================
let projects = [];

// ===============================================
// NAVEGACIÓN DE CAPAS CON HISTORIAL (botón atrás del móvil)
// Cada capa abierta (ficha / visor) crea una entrada en el historial.
// Al pulsar atrás, popstate cierra SOLO la capa superior en lugar de
// abandonar la página. Si el usuario cierra con el botón X, se consume
// la entrada del historial para que la pila no quede desincronizada.
// ===============================================
const OverlayNav = (function () {
    let sheetId = null;
    let viewerOpen = false;
    let depth = 0;

    const stateFor = (d) => ({ wb: { sheet: sheetId, viewer: viewerOpen, depth: d } });

    function hideViewerDom() {
        viewerOpen = false;
        if (window.Viewer && typeof window.Viewer._rawClose === 'function') {
            window.Viewer._rawClose();
        }
    }

    function hideSheetDom() {
        if (viewerOpen) hideViewerDom();
        const m = document.getElementById('projectModal');
        if (m) m.style.display = 'none';
        document.body.style.overflow = '';
        document.body.classList.remove('sheet-open');
        sheetId = null;
    }

    function apply(state) {
        const wb = state && state.wb;
        depth = wb ? (wb.depth || 0) : 0;
        const wantViewer = !!(wb && wb.viewer);
        const wantSheet = wb ? wb.sheet : null;

        if (!wantViewer && viewerOpen) hideViewerDom();
        if (!wantSheet && sheetId !== null) hideSheetDom();
        // Botón "adelante": reabrir la ficha sin crear otra entrada.
        if (wantSheet !== null && wantSheet !== sheetId && typeof window.openModal === 'function') {
            window.openModal(wantSheet, true);
        }
    }

    window.addEventListener('popstate', (event) => apply(event.state));

    return {
        sheetOpened(id) {
            sheetId = id;
            depth += 1;
            document.body.classList.add('sheet-open');
            try { history.pushState(stateFor(depth), ''); } catch (e) { /* entorno sin historial */ }
        },
        viewerOpened() {
            viewerOpen = true;
            depth += 1;
            try { history.pushState(stateFor(depth), ''); } catch (e) { /* entorno sin historial */ }
        },
        notifyViewerClosed() { viewerOpen = false; },
        requestCloseSheet() {
            if (sheetId === null) return false;
            if (depth > 0) { history.go(-depth); return true; }
            return false;
        },
        requestCloseViewer() {
            if (!viewerOpen) return false;
            if (depth > 0) { history.back(); return true; }
            return false;
        },
        forceCloseSheet() { hideSheetDom(); },
        isSheetOpen() { return sheetId !== null; }
    };
})();
window.OverlayNav = OverlayNav;

// Configuración de WhatsApp para productos
const WHATSAPP_CONFIG = {
    phoneNumber: '59176982955',
    defaultMessage: (productName, productType) => 
        `¡Hola! Me interesa adquirir el producto: *${productName}* (${productType}). ¿Podrías darme más información?`
};

function generateWhatsAppLink(product) {
    const message = WHATSAPP_CONFIG.defaultMessage(product.title, product.productType || 'Producto');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}

// ===============================================
// CARGAR PROYECTOS
// ===============================================
async function loadProjects() {
    try {
        // Query única + no-store: tras un push, el navegador/CDN no sirve un JSON viejo
        const response = await fetch(`data/projects.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error al cargar los proyectos');
        const data = await response.json();
        projects = data.projects;
        return projects;
    } catch (error) {
        console.error('Error cargando proyectos:', error);
        const projectGallery = document.getElementById('projectGallery');
        if (projectGallery) {
            projectGallery.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar los proyectos. Por favor, recarga la página.</p>
                </div>
            `;
        }
        return [];
    }
}

// ===============================================
// CREAR TARJETAS DE PROYECTO
// ===============================================
function createProjectCard(project, index) {
    const isProduct = project.isProduct || project.category === 'producto';
    const aosDelay = (index % 6) * 80;
    
    const productBadge = isProduct ? `
        <div class="product-badge">
            <i class="fas fa-tag"></i> ${project.price || 'Consultar'}
        </div>
    ` : '';
    
    const typeBadge = isProduct && project.productType ? `
        <div class="product-type-badge">
            <i class="${getProductTypeIcon(project.productType)}"></i> ${project.productType}
        </div>
    ` : '';
    
    const whatsappButton = isProduct ? `
        <a href="${generateWhatsAppLink(project)}" 
           class="btn-whatsapp-product" 
           target="_blank" 
           rel="noopener noreferrer"
           onclick="event.stopPropagation();"
           title="Solicitar por WhatsApp">
            <i class="fab fa-whatsapp"></i> Solicitar
        </a>
    ` : '';

    const youtubeButton = isProduct && project.youtubeUrl ? `
        <a href="${project.youtubeUrl}" 
           class="btn-youtube-product" 
           target="_blank" 
           rel="noopener noreferrer"
           onclick="event.stopPropagation();"
           title="Ver demostración en YouTube">
            <i class="fab fa-youtube"></i> Demo
        </a>
    ` : '';

    const productButtons = isProduct ? `
        <div class="product-buttons">
            ${youtubeButton}
            ${whatsappButton}
        </div>
    ` : '';

    return `
        <div class="project-card ${isProduct ? 'product-card' : ''}" 
             onclick="openModal(${project.id})"
             data-category="${project.category}"
             data-is-product="${isProduct}"
             data-aos="fade-up"
             data-aos-delay="${aosDelay}">
            ${productBadge}
            ${typeBadge}
            <img class="project-image" 
                 src="${project.image}" 
                 alt="${project.title}" 
                 width="300" 
                 height="200"
                 loading="lazy"
                 onerror="this.src='img/placeholder.webp'">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${productButtons}
            </div>
        </div>
    `;
}

function getProductTypeIcon(type) {
    const icons = {
        'Excel': 'fas fa-file-excel',
        'Plugin': 'fas fa-puzzle-piece',
        'Rutina LISP': 'fas fa-code',
        'Software': 'fas fa-desktop',
        'AutoCAD': 'fas fa-drafting-compass',
        'Revit': 'fas fa-building',
        'default': 'fas fa-box'
    };
    return icons[type] || icons['default'];
}

// ===============================================
// INICIALIZACIÓN PRINCIPAL
// ===============================================
document.addEventListener('DOMContentLoaded', async function() {
    const projectGallery = document.getElementById('projectGallery');
    const loadingProjects = document.getElementById('loadingProjects');
    
    if (projectGallery) {
        if (loadingProjects) loadingProjects.style.display = 'block';
        
        await loadProjects();
        
        if (projects.length > 0) {
            projects.forEach((project, index) => {
                projectGallery.innerHTML += createProjectCard(project, index);
            });
            if (window.AOS) {
                AOS.refreshHard();
            }
        }
        
        if (loadingProjects) loadingProjects.style.display = 'none';
    }
    
    initializeBackToTop();
    initializeThemeToggle();
    initializeKeyboardNavigation();
    initializeLightbox();
});

// ===============================================
// MODAL DE DETALLES DEL PROYECTO
// ===============================================
const modal = document.getElementById("projectModal");
const span = document.querySelector(".close");

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function renderMarkdown(source) {
    if (typeof marked !== 'undefined') return marked.parse(source || '');
    return (source || '').replace(/\n/g, '<br>');
}

/* Divide la memoria en bloques con título, para repartirlos por la composición */
function splitProjectDetails(md) {
    const src = (md || '').trim();
    if (!src) return [];
    const parts = src.split(/^#{2,3}\s+/m).filter((p) => p.trim());
    return parts.map((part) => {
        const nl = part.indexOf('\n');
        return {
            heading: nl === -1 ? '' : part.slice(0, nl).trim(),
            body: (nl === -1 ? part : part.slice(nl + 1)).trim()
        };
    });
}

/* Reparto de imágenes por HUECOS de maquetación.
   Por defecto se usa el orden de la galería:
   #1 portada · #2-#3 tarjetas · #4-#5 par grande · #6-#9 catálogo · #10+ detalles.
   Un proyecto puede sobreescribirlo con "slots": { hero, cards, pair, catalog, details }
   usando índices de la galería. */
function resolveProjectSlots(project) {
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    const at = (i) => (Number.isInteger(i) && gallery[i] ? { src: gallery[i], index: i } : null);
    const pick = (arr) => (Array.isArray(arr) ? arr : []).map(at).filter(Boolean);
    const cfg = project.slots;

    if (cfg && typeof cfg === 'object') {
        return {
            hero: typeof cfg.hero === 'number' ? at(cfg.hero) : at(0),
            cards: pick(cfg.cards),
            pair: pick(cfg.pair),
            catalog: pick(cfg.catalog),
            details: pick(cfg.details)
        };
    }
    /* Reparto adaptativo: los bloques crecen o se reducen según las imágenes disponibles */
    const n = gallery.length;
    const take = (a, b) => gallery.slice(a, b).map((src, k) => ({ src, index: a + k }));
    if (n >= 9) return { hero: at(0), cards: take(1, 3), pair: take(3, 5), catalog: take(5, 9), details: take(9, n) };
    if (n === 8) return { hero: at(0), cards: take(1, 3), pair: take(3, 5), catalog: take(5, 8), details: [] };
    if (n === 7) return { hero: at(0), cards: take(1, 3), pair: take(3, 5), catalog: take(5, 7), details: [] };
    if (n === 6) return { hero: at(0), cards: take(1, 2), pair: take(2, 4), catalog: take(4, 6), details: [] };
    if (n === 5) return { hero: at(0), cards: take(1, 2), pair: take(2, 4), catalog: take(4, 5), details: [] };
    if (n === 4) return { hero: at(0), cards: take(1, 2), pair: take(2, 3), catalog: take(3, 4), details: [] };
    if (n === 3) return { hero: at(0), cards: take(1, 2), pair: take(2, 3), catalog: [], details: [] };
    if (n === 2) return { hero: at(0), cards: take(1, 2), pair: [], catalog: [], details: [] };
    return { hero: at(0), cards: [], pair: [], catalog: [], details: [] };
}

/* Ajusta el cuerpo del titular para que ninguna palabra se parta por la mitad */
function fitDisplayTitle(el) {
    if (!el) return;
    const main = el.querySelector('.sheet-display-main');
    if (!main) return;
    main.style.fontSize = '';
    const words = (main.textContent || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
    const avail = main.clientWidth;
    if (!avail) return;
    let size = parseFloat(getComputedStyle(main).fontSize) || 80;

    for (let i = 0; i < 4; i++) {
        main.style.fontSize = size + 'px';
        const probe = document.createElement('span');
        probe.style.cssText = 'display:inline-block;white-space:nowrap';
        probe.textContent = longest.toUpperCase();
        main.appendChild(probe);
        const measured = probe.getBoundingClientRect().width;
        probe.remove();
        if (!measured || measured <= avail * 0.94) break;
        size = Math.max(28, Math.floor(size * (avail * 0.94) / measured));
    }
}

function openModal(projectId, fromHistory = false) {
    const project = projects.find((p) => p.id === projectId);
    if (!project || !modal) return;

    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    const slots = resolveProjectSlots(project);
    const chunks = splitProjectDetails(project.details);
    const pad = (n) => String(n).padStart(2, '0');

    const CATEGORY_LABELS = {
        arquitectura: 'Arquitectura',
        ingenieria: 'Ingeniería estructural',
        programacion: 'Programación',
        producto: 'Producto digital'
    };
    const categoryLabel = CATEGORY_LABELS[project.category] || project.category || 'Proyecto';
    const setSheet = (key, value) => {
        document.querySelectorAll(`[data-sheet="${key}"]`).forEach((el) => { el.textContent = value; });
    };
    setSheet('index', pad(project.id));
    setSheet('category', categoryLabel);
    setSheet('count', pad(gallery.length));

    /* --- Título con juego de escala --- */
    const words = (project.title || '').trim().split(/\s+/).filter(Boolean);
    /* Como en la referencia: una o dos palabras enormes, el resto en cuerpo pequeño.
       Solo se toman dos palabras si ambas caben a gran tamaño. */
    const firstTwo = words.slice(0, 2);
    const longestFirst = Math.max(0, ...firstTwo.map((w) => w.length));
    const cut = (firstTwo.length === 2 && longestFirst <= 9) ? 2 : 1;
    const displayWords = words.slice(0, cut).join(' ');
    const restWords = words.slice(cut).join(' ');
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) {
        titleEl.innerHTML =
            `<span class="sheet-display-main">${escapeHtml(displayWords)}</span>` +
            (restWords ? `<span class="sheet-display-rest">${escapeHtml(restWords)}</span>` : '');
    }
    const desc = document.getElementById('sheetDescription');
    if (desc) desc.textContent = project.description || '';

    const contact = document.getElementById('sheetContact');
    if (contact) {
        contact.href = `mailto:Ing.RubenValero@outlook.com?subject=${encodeURIComponent('Consulta sobre: ' + project.title)}`;
    }

    /* --- Portada: imagen limpia, sin botón ni leyenda --- */
    const heroFigure = document.getElementById('sheetHeroFigure');
    const heroImg = document.getElementById('sheetHeroImage');
    if (heroFigure && heroImg) {
        if (slots.hero) {
            heroFigure.hidden = false;
            heroImg.src = slots.hero.src;
            heroImg.alt = project.title;
            // Se mantiene la ampliación, pero pulsando la propia imagen.
            heroFigure.onclick = () => openLightbox(project, slots.hero.index);
        } else {
            heroFigure.hidden = true;
            heroFigure.onclick = null;
        }
    }

    /* --- Tarjetas: texto + imagen --- */
    const cardsEl = document.getElementById('sheetCards');
    if (cardsEl) {
        cardsEl.innerHTML = '';
        const fallbacks = ['Alcance y criterio', 'Desarrollo técnico'];
        for (let c = 0; c < 2; c++) {
            const chunk = chunks[c];
            const img = slots.cards[c];
            if (!chunk && !img) continue;
            const card = document.createElement('article');
            card.className = 'sheet-card' + (img ? '' : ' sheet-card-textonly');
            card.innerHTML = `
                <div class="sheet-card-copy">
                    <p class="kicker">${escapeHtml((chunk && chunk.heading) || fallbacks[c])}</p>
                    <div class="sheet-card-body">${renderMarkdown(chunk ? chunk.body : '')}</div>
                </div>
                ${img ? `<button type="button" class="sheet-card-media" aria-label="Ver imagen ${img.index + 1}">
                    <img src="${img.src}" alt="${escapeHtml(project.title)} — imagen ${img.index + 1}" loading="lazy" decoding="async">
                </button>` : ''}
            `;
            if (img) {
                card.querySelector('.sheet-card-media').addEventListener('click', (e) => {
                    e.stopPropagation();
                    openLightbox(project, img.index);
                });
            }
            cardsEl.appendChild(card);
        }
    }

    /* --- Bloque de desarrollo: texto a la izquierda, dos imágenes grandes a la derecha --- */
    const storyText = document.getElementById('sheetStoryText');
    if (storyText) {
        const rest = chunks.slice(2);
        storyText.innerHTML = `
            <p class="kicker">Desarrollo</p>
            <h3>${escapeHtml((rest[0] && rest[0].heading) || 'Memoria del proyecto')}</h3>
            ${rest.map((c, i) => `
                <div class="sheet-story-body">
                    ${i > 0 ? `<h4>${escapeHtml(c.heading)}</h4>` : ''}
                    ${renderMarkdown(c.body)}
                </div>
            `).join('')}
            <button type="button" class="sheet-textlink" id="sheetStoryMore">
                Ver documentación <i class="fas fa-arrow-right"></i>
            </button>
        `;
        const more = document.getElementById('sheetStoryMore');
        if (more) {
            more.addEventListener('click', () => {
                const target = document.getElementById('sheet-gallery');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    const pairEl = document.getElementById('sheetPair');
    if (pairEl) {
        pairEl.innerHTML = '';
        pairEl.dataset.count = String(slots.pair.length);
        pairEl.style.display = slots.pair.length ? '' : 'none';
        slots.pair.forEach((img) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'sheet-pair-item';
            btn.setAttribute('aria-label', `Ver imagen ${img.index + 1}`);
            btn.innerHTML = `
                <img src="${img.src}" alt="${escapeHtml(project.title)} — imagen ${img.index + 1}" loading="lazy" decoding="async">
            `;
            btn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(project, img.index); });
            pairEl.appendChild(btn);
        });
    }

    /* --- Catálogo oscuro --- */
    const catalogGrid = document.getElementById('galleryTopContainer');
    const catalogExtra = document.getElementById('galleryBottomGrid');
    const catalogBlock = document.getElementById('sheet-gallery');
    const makeCatalogCard = (img, compact) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sheet-cat-card' + (compact ? ' sheet-cat-card-compact' : '');
        btn.setAttribute('aria-label', `Ver imagen ${img.index + 1} de ${gallery.length}`);
        btn.innerHTML = `
            <span class="sheet-cat-media">
                <img src="${img.src}" alt="${escapeHtml(project.title)} — imagen ${img.index + 1}" loading="lazy" decoding="async">
            </span>
        `;
        btn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(project, img.index); });
        return btn;
    };

    if (catalogGrid) {
        catalogGrid.innerHTML = '';
        catalogGrid.dataset.count = String(slots.catalog.length);
        slots.catalog.forEach((img) => catalogGrid.appendChild(makeCatalogCard(img, false)));
    }
    if (catalogExtra) {
        catalogExtra.innerHTML = '';
        slots.details.forEach((img) => catalogExtra.appendChild(makeCatalogCard(img, true)));
    }
    if (catalogBlock) {
        const hasCatalog = slots.catalog.length || slots.details.length;
        catalogBlock.style.display = hasCatalog ? '' : 'none';
        const story = document.querySelector('.sheet-story');
        if (story) story.classList.toggle('sheet-story-noimages', slots.pair.length === 0);
        const storyMore = document.getElementById('sheetStoryMore');
        if (storyMore) storyMore.style.display = hasCatalog ? '' : 'none';
    }

    /* --- Producto --- */
    const productActions = document.getElementById('modalProductActions');
    if (productActions) {
        productActions.innerHTML = '';
        const isProduct = project.isProduct || project.category === 'producto';
        if (isProduct) {
            const youtubeButton = project.youtubeUrl ? `
                <a href="${project.youtubeUrl}" class="btn-youtube-modal" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-youtube"></i> Ver Demostración
                </a>` : '';
            productActions.innerHTML = `
                <div class="sheet-product">
                    ${project.price ? `<p class="sheet-price"><i class="fas fa-tag"></i> Precio: <strong>${escapeHtml(project.price)}</strong></p>` : ''}
                    ${project.productType ? `<p class="sheet-price"><i class="${getProductTypeIcon(project.productType)}"></i> Tipo: <strong>${escapeHtml(project.productType)}</strong></p>` : ''}
                    <div class="product-modal-actions-container">
                        ${youtubeButton}
                        <a href="${generateWhatsAppLink(project)}" class="btn-whatsapp-modal" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-whatsapp"></i> Solicitar por WhatsApp
                        </a>
                    </div>
                </div>
            `;
        }
    }

    /* --- Metadatos al final, discretos --- */
    const meta = document.getElementById('sheetMeta');
    if (meta) {
        meta.innerHTML = `
            <div><dt>Expediente</dt><dd>${pad(project.id)}</dd></div>
            <div><dt>Disciplina</dt><dd>${escapeHtml(categoryLabel)}</dd></div>
            <div><dt>Documentos</dt><dd>${pad(gallery.length)} imágenes</dd></div>
        `;
    }

    /* Texto completo accesible para lectores de pantalla */
    const fullDetails = document.getElementById('modalDetails');
    if (fullDetails) fullDetails.innerHTML = renderMarkdown(project.details || '');

    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    fitDisplayTitle(titleEl);

    // Registrar la ficha en el historial para que el botón atrás la cierre.
    if (!fromHistory && window.OverlayNav) window.OverlayNav.sheetOpened(project.id);
}

function formatDetails(details) {
    return details.replace(/\n/g, '<br>');
}

if (span) {
    span.onclick = function() {
        closeModal();
    }
}
const mobileSheetClose = document.getElementById('sheetMobileClose');
if (mobileSheetClose) mobileSheetClose.addEventListener('click', closeModal);

function closeModal() {
    if (!modal || modal.style.display === 'none') return;
    // Si hay entradas en el historial, dejar que popstate cierre la ficha:
    // así el botón atrás posterior no "rebota" contra una entrada huérfana.
    if (window.OverlayNav && window.OverlayNav.requestCloseSheet()) return;
    if (window.OverlayNav) window.OverlayNav.forceCloseSheet();
    else {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// ===============================================
// VISOR DE IMÁGENES
// Implementación completa en js/viewer.js (móvil primero).
// Estos nombres se conservan como puente para openModal()
// y para la navegación con teclado definida más abajo.
// ===============================================
const lightboxState = { isOpen: false };

function openLightbox(project, index = 0) { window.Viewer.open(project, index); }
function closeLightbox() { window.Viewer.close(); }
function lightboxNavigate(direction) { window.Viewer.navigate(direction); }
function lightboxZoom(direction) { window.Viewer.zoom(direction); }
function lightboxResetZoom() { window.Viewer.resetZoom(); }
function initializeLightbox() { /* viewer.js se inicializa automáticamente */ }

// ===============================================
// FILTRADO DE PROYECTOS
// ===============================================
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;
    
    projectCards.forEach((card, index) => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.setAttribute('data-aos-delay', `${(index % 6) * 80}`);
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (window.AOS) {
        AOS.refreshHard();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterProjects(this.dataset.filter);
        });
    });
});

// ===============================================
// BOTÓN VOLVER ARRIBA
// ===============================================
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===============================================
// MODO OSCURO / CLARO
// ===============================================
function initializeThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    if (!toggles.length) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    document.body.offsetHeight; // Force repaint
}

function updateThemeIcon(theme) {
    const iconClass = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelectorAll('[data-theme-toggle] i').forEach((icon) => {
        icon.className = iconClass;
    });
}

// ===============================================
// NAVEGACIÓN CON TECLADO
// ===============================================
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Lightbox keyboard navigation (higher priority)
        if (lightboxState.isOpen) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    lightboxNavigate(-1);
                    break;
                case 'ArrowRight':
                    lightboxNavigate(1);
                    break;
                case '+':
                case '=':
                    lightboxZoom('in');
                    break;
                case '-':
                case '_':
                    lightboxZoom('out');
                    break;
                case '0':
                    lightboxResetZoom();
                    break;
            }
            return;
        }

        // Modal keyboard navigation
        if (modal?.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);