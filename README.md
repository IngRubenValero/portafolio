# 🏗️ Portafolio de Ruben Valero - Ingeniero Civil

Portafolio profesional optimizado para GitHub Pages mostrando proyectos de ingeniería civil, cálculo estructural y metodología BIM.

## ✨ Mejoras Implementadas (Noviembre 2025)

### 🎯 SEO y Accesibilidad
- ✅ **Meta tags completos**: Description, keywords, author
- ✅ **Open Graph tags**: Para compartir en redes sociales (Facebook, Twitter)
- ✅ **Favicon dinámico**: Emoji 🏗️ en formato SVG inline
- ✅ **Preconnect**: Para fuentes y CDN externos
- ✅ **Atributos de seguridad**: `rel="noopener noreferrer"` en enlaces externos
- ✅ **ARIA labels**: Mejora accesibilidad para lectores de pantalla

### 🚀 Rendimiento
- ✅ **Lazy loading**: Carga diferida de imágenes
- ✅ **Optimización de recursos**: Preconnect a dominios externos
- ✅ **Animaciones CSS**: Hardware-accelerated para mejor performance
- ✅ **Scroll suave**: `scroll-behavior: smooth`
- ✅ **Loading states**: Spinners y feedback visual

### 🎨 Diseño y UX
- ✅ **Modo oscuro/claro**: Toggle con persistencia en localStorage
- ✅ **Animaciones**: Entrada fade-in para cards y modal
- ✅ **Responsive mejorado**: Optimizado para tablets (768px-1024px)
- ✅ **Botón volver arriba**: Floating button con animación
- ✅ **Sección "Sobre Mí"**: Con highlights y estadísticas
- ✅ **Empty states**: Mensajes cuando no hay proyectos en filtros
- ✅ **Mejores iconos**: Iconos en botones de filtro

### 🖼️ Galería de Proyectos
- ✅ **Filtros visuales mejorados**: Con iconos y efectos hover
- ✅ **Loading placeholders**: Spinner mientras cargan proyectos
- ✅ **Manejo de errores**: Placeholder image si falla la carga
- ✅ **Animación escalonada**: Cards aparecen con delay progresivo
- ✅ **Categorías**: Arquitectura, Ingeniería, Programación

### 🖼️ Modal de Imágenes
- ✅ **Zoom mejorado**: In/Out con botones y rueda del mouse
- ✅ **Pantalla completa**: Botón para fullscreen
- ✅ **Panning**: Arrastrar imagen cuando está en zoom
- ✅ **Navegación con teclado**: Flechas y ESC
- ✅ **Prevención de scroll**: Body no hace scroll cuando modal está abierto
- ✅ **Lazy loading**: En miniaturas también

### ⌨️ Interacción
- ✅ **Navegación con teclado**:
  - `ESC`: Cerrar modal
  - `←/→`: Navegar entre imágenes
- ✅ **Smooth scroll**: Al hacer clic en "volver arriba"
- ✅ **Persistencia de tema**: Se guarda preferencia en localStorage

### 📱 Responsive Design
- ✅ **Breakpoints optimizados**:
  - Desktop: > 1024px
  - Tablets: 768px - 1024px
  - Móviles grandes: 480px - 768px
  - Móviles pequeños: < 480px
- ✅ **Touch-friendly**: Botones con tamaño mínimo 44x44px
- ✅ **Filtros verticales**: En móviles se apilan verticalmente

### 🎭 Modo Oscuro
- ✅ **Variables CSS**: Sistema de colores con custom properties
- ✅ **Transiciones suaves**: Entre cambios de tema
- ✅ **Persistencia**: Guardado en localStorage
- ✅ **Iconos dinámicos**: Sol/Luna según el tema activo

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Semántico y accesible
- **CSS3**: Variables, Grid, Flexbox, Animations
- **JavaScript ES6+**: Vanilla JS, sin dependencias
- **Font Awesome 6.4.0**: Iconos
- **Google Fonts**: Manrope + IBM Plex Mono

## 📁 Estructura del Proyecto

```
WebPortafolioEstructural/
├── index.html              # Página principal
├── admin.html              # Panel de edición de proyectos
├── css/
│   ├── styles.css         # Estilos base heredados (filtros, modal)
│   ├── design.css         # Capa visual editorial clara
│   ├── viewer.css         # Visor de imágenes, móvil primero
│   └── styles_backup.css  # Respaldo
├── js/
│   ├── script.js          # Lógica principal + puente hacia el visor
│   ├── viewer.js          # Visor: swipe, pinch, doble toque, zoom, teclado
│   ├── design.js          # Navegación, contadores y menú móvil
│   └── script_backup.js   # Respaldo
├── data/projects.json      # Contenido de los proyectos (única fuente de verdad)
├── img/                    # Imágenes publicadas, en WebP
│   └── _originales/        # JPG/PNG previos: solo locales, excluidos por .gitignore
├── tools/
│   ├── validar.py          # Comprueba rutas antes de publicar
│   └── optimizar_imagenes.py  # Conversión JPG/PNG -> WebP (Pillow)
├── publicar.sh             # Valida, confirma y sube a GitHub Pages
└── README.md              # Este archivo
```

### Diseño editorial claro

El aspecto actual (fondo `F4F4F1`, tarjetas redondeadas, titulares ligeros Manrope,
bloque oscuro de contacto) se aplica como **capa independiente** cargada después de
`styles.css`. Los colores, tipografías y el modo oscuro se controlan desde las
variables al inicio de `css/design.css`. Se usan **solo renders propios** de `img/`,
sin fotografías de stock ni dependencias de framework.

El **modo oscuro** se guarda en `localStorage` y tiene dos controles sincronizados
(`[data-theme-toggle]`): uno en la navegación y otro dentro de la ficha de proyecto,
para poder cambiarlo también con la ventana abierta. La cabecera de la ficha y el
hero de la portada se mantienen oscuros en ambos temas porque llevan texto claro
superpuesto.

### Contenido

La sección de **herramientas/software se eliminó**: esa información ya vive en el CV
y repetirla en la web solo añadía ruido. La navegación quedó en Proyectos, Enfoque,
Sobre mí y Contacto.

### Ficha de proyecto — composición y huecos de imagen

La ficha es una **composición editorial**, no una lista: título de gran volumen con
imagen de portada, fila de rasgos, dos tarjetas de texto con imagen lateral, bloque de
desarrollo con texto estrecho y dos imágenes grandes, catálogo oscuro de vistas y un
pie discreto. Los metadatos (expediente, disciplina, documentos) van **al final** para
no romper la composición. El texto de `details` se divide por sus `##` y se reparte
entre los bloques en lugar de volcarse en una sola columna.

**Requisito de maquetación para proyectos nuevos:** el orden de `gallery` define qué
imagen ocupa cada hueco. El panel `admin.html` muestra la etiqueta del hueco en cada
fila y permite reordenar con arrastrar y soltar:

| Hueco | Contenido |
|---|---|
| `#1` | Siempre la portada / hero |
| `Tarjeta` | Bloques de texto con imagen lateral |
| `Par` | Dos imágenes grandes junto al bloque de desarrollo |
| `Catálogo` | Tarjetas del bloque oscuro |
| `Detalle` | Vistas adicionales (proyectos con 10+ imágenes) |

El reparto es **adaptativo**: con 9 imágenes se usan 2 tarjetas, 2 pares, 4 del
catálogo y el resto como detalles; con 6 imágenes, 1 tarjeta, 2 pares y 2 del
catálogo. `admin.html` calcula y muestra la etiqueta exacta de cada fila, así que
basta con ordenar las imágenes hasta que cada hueco tenga la adecuada. Se recomienda
un mínimo de **6 imágenes** por proyecto para que la composición se vea completa.

Si un proyecto necesita otro reparto, puede añadir `slots` en `data/projects.json`
con índices de la galería; el admin conserva ese campo al guardar:

```json
"slots": { "hero": 0, "cards": [1, 2], "pair": [3, 4], "catalog": [5, 6, 7, 8], "details": [9] }
```

Los bloques se adaptan cuando hay menos imágenes y cada vista abre el visor en su
índice real de galería.

**Criterio para la imagen de portada (#1):** la cabecera usa la misma integración que
el hero de la portada —imagen a sangre con un desvanecimiento oscuro de izquierda a
derecha y el titular superpuesto—. Al preparar próximos renders conviene dejar el
motivo principal a la derecha y la zona izquierda oscura o despejada; así el texto
se lee limpio. El `object-position` por defecto es `60% 50%`. El admin recuerda
este requisito en la etiqueta de la portada.

### Visor de imágenes (`viewer.css` / `viewer.js`)

Sustituye al lightbox anterior. Usa **Pointer Events** con `touch-action: none`, así
que en el teléfono funcionan el swipe para cambiar de imagen, el pinch y el doble
toque para ampliar, y el arrastre para desplazarse con zoom. Botones de 44–48 px,
sin `backdrop-filter` (evita tirones en móvil) y con soporte de teclado en escritorio.
`script.js` conserva los nombres `openLightbox`, `closeLightbox`,
`lightboxNavigate`, `lightboxZoom` y `lightboxResetZoom` como puente, para no tocar
`openModal()` ni la navegación con teclado.

### Imágenes ligeras: WebP

Las imágenes publicadas están en **WebP**. Es el formato que mejor equilibra peso y
calidad en móvil: mismos píxeles percibidos con un 25–35 % menos de bytes que JPEG,
admite transparencia y lo soportan Chrome/Edge/Firefox y Safari desde iOS 14 (~97 %
de los navegadores). GitHub Pages sirve `.webp` con el MIME correcto sin configurar
nada.

**Resultado medido en este portafolio:** 63 imágenes referenciadas,
`24,54 MB → 9,48 MB` (**−61 %**); el hero de portada pasó de 917 KB a 90 KB y el
primer pintado en móvil de ~1,95 MB a ~0,4 MB.

Reglas aplicadas en `tools/optimizar_imagenes.py`:

| Origen | Destino | Motivo |
|---|---|---|
| PNG (planos, renders de líneas finas) | WebP calidad **90** | La pérdida a q82 deja halos en texto y líneas |
| JPG (renders fotográficos) | WebP calidad **82** | Ahorro sin pérdida visible |
| Cualquiera | Lado mayor **≤ 2400 px** | 19 imágenes venían a 4967 px; 2400 mantiene 2× de zoom en el visor |

- Se corrige la orientación EXIF y se conserva el canal alfa.
- Si el WebP saliera **más grande** que el original, se conserva el original
  (quedaron 2 PNG en ese caso).
- **`img/Ruben_traje.jpg` se mantiene en JPG a propósito**: es el `og:image` y los
  rastreadores de WhatsApp/LinkedIn/X no manejan WebP de forma fiable. El retrato
  de la página sí usa `Ruben_traje.webp`.
- Los 75 JPG/PNG originales se movieron a `img/_originales/`: siguen en tu disco,
  pero `.gitignore` los excluye para que no se publiquen ni inflen el repo.
- `img/placeholder.webp` sustituye al `placeholder.jpg` que `js/script.js` referenciaba
  y que **no existía**.

**Para no repetir el problema:** `admin.html` convierte automáticamente a WebP en el
navegador (`createImageBitmap` + `canvas.toBlob`) al importar imágenes, antes de
escribir en `img/`. PNG → q90, JPG → q82, máximo 2400 px; SVG, GIF y WebP se respetan
tal cual. Mientras convierte no se puede guardar el proyecto, para que el JSON nunca
apunte a rutas que aún no existen. Si el navegador no soporta la conversión, se
conserva el archivo original con su extensión.

Para reoptimizar un lote nuevo de imágenes (idempotente, nunca borra nada):

```bash
python tools/optimizar_imagenes.py --dry-run   # solo informa
python tools/optimizar_imagenes.py             # convierte y reenlaza
python tools/validar.py
```

Requiere Pillow (`python -m pip install Pillow`). No hace falta para los proyectos
nuevos creados desde el panel.

### Respaldos

Los respaldos completos se guardan **fuera del proyecto** para que no se publiquen
en GitHub Pages:

- `../WebPortafolioEstructuralV2026_backup_20261110_102031/` (antes del primer rediseño)
- `../WebPortafolioEstructuralV2026_backup_20261111_081952/` (antes del visor y del diseño actual)
- `../WebPortafolioEstructuralV2026_backup_20261111_093832/` (antes de quitar Tecnología y rehacer la ficha)
- `../WebPortafolioEstructuralV2026_backup_20261111_105013/` (antes de la cabecera integrada y el doble toggle de tema)
- `../WebPortafolioEstructuralV2026_backup_20261112_162153/` (antes de preparar el flujo de publicación)
- `../WebPortafolioEstructuralV2026_backup_20261114_160346/` (antes de la conversión a WebP; 79 archivos verificados por MD5)

Además, `admin.html` crea **`data/projects.respaldo.json`** con el estado anterior
antes de cada escritura. Está en `.gitignore`, así que nunca se publica; se recupera
con el botón **Restaurar respaldo** de la vista *Exportar*.

## 🔁 Checklist: cada vez que cambies algo

**La regla que evita confusiones:** `admin.html` escribe en **tu disco**, no en GitHub.
Añadir un proyecto desde el panel **NO actualiza la web pública** hasta que ejecutas
`publicar.sh`. Guardar ≠ publicar.

### A) Añadir o editar un proyecto (vía `admin.html`)

1. Levantar el servidor local y abrir el panel **en local**:
   ```bash
   python -m http.server 8766
   ```
   → `http://localhost:8766/admin.html` (si el puerto está ocupado, `8767`).
   **Nunca** con `file://` ni desde la URL pública: sin servidor no se pueden validar
   las rutas de imagen. Usar Chrome o Edge (Firefox/Safari no soportan la conexión
   a carpetas).
2. Pulsar **Conectar carpeta del proyecto** y elegir la **raíz** (donde están
   `data/` e `img/`). Conectar **solo lee** `data/projects.json`; no lo modifica.
   El estado debe quedar en verde: `Conectado · listo para publicar`.
3. Crear/editar el proyecto. Importar las imágenes desde el propio panel: las
   **convierte a WebP automáticamente**, las renombra y las escribe en `img/`.
   Espera a que desaparezca el aviso «Convirtiendo imágenes a WebP…».
   Respetar el orden de la galería: define los huecos de la ficha.
   **No renombrar imágenes a mano.**
4. Pulsar **Guardar Proyecto**. El panel valida campos y rutas **antes** de escribir,
   guarda el respaldo y actualiza `data/projects.json`. Si ves un aviso rojo o el
   estado dice `SIN CONEXIÓN`, **el JSON no se tocó**: no continúes.
5. Comprobar: `python tools/validar.py` → debe terminar con `Listo para publicar`.
6. Publicar: `bash publicar.sh` (Git pedirá credenciales la primera vez).
7. Esperar 1–2 min y revisar `https://ingrubenvalero.github.io/portafolio/`.
   La portada usa `cache: 'no-store'`, así que no hace falta limpiar caché.

### B) Cambiar diseño, textos fijos o código

Editar `index.html` / `css/` / `js/` directamente → paso 5 → paso 6 → paso 7.
**No hace falta abrir el admin** si no cambia `data/projects.json`.

### C) Solo añadir o renombrar imágenes

Hacerlo desde el panel (recomendado) o a mano actualizando también las rutas del
JSON → paso 5 (el validador detecta rutas rotas y huérfanas) → paso 6 → paso 7.

### Herramientas de rescate (no son el flujo normal)

- **Restaurar respaldo** (vista *Exportar*): vuelve al `data/projects.json`
  anterior a la última escritura.
- **Importar JSON**: rechaza archivos vacíos, malformados o con proyectos
  incompletos, y pide confirmación si reduces drásticamente el número de proyectos.
- **Descargar projects.json**: útil solo si trabajas sin conexión a carpetas;
  entonces tendrás que reemplazar el archivo a mano antes de publicar.

## 🔄 Flujo de actualización (de dónde sale cada cosa)

**Una sola fuente de verdad:** `data/projects.json` + `img/`. La portada lee el JSON
con `fetch(..., { cache: 'no-store' })` y un query único, así que un `push` se refleja
sin limpiar caché a mano. `admin.html` es una **herramienta de autoría local**: escribe
en tu disco, nunca en la web publicada.

1. Levantar el servidor local desde la raíz del proyecto y abrir el panel
   (`http://localhost:8766/admin.html`; no `file://` ni la URL pública):
   ```bash
   python -m http.server 8766
   ```
   Si el puerto está ocupado, usar `8767` y abrir `http://localhost:8767/admin.html`.
2. Pulsar **Conectar carpeta del proyecto** una vez y elegir la raíz. El panel muestra
   `Conectado · listo para publicar`. Sin eso, ahora **avisa en rojo y no finge que guardó**.
3. Crear/editar el proyecto e importar imágenes. El panel las convierte a WebP y
   el renombrado automático genera `<slug-del-título>-<nn>.webp`, reescribiendo
   archivo y JSON a la vez. **No renombrar imágenes a mano**: las rutas del JSON
   dejarían de existir.
   La portada (#1) debe dejar el motivo a la derecha por el desvanecimiento.
4. Guardar. El panel valida por HTTP que cada ruta existe y escribe `data/projects.json`.
5. Ejecutar `bash publicar.sh` (abajo). Valida activos, hace `commit` y `push`.
6. GitHub Pages reconstruye el sitio en 1–2 minutos.

Comprobación rápida en cualquier momento:

```bash
python tools/validar.py
```

Informa de rutas rotas e imágenes huérfanas y **no borra nada**. Tras la conversión
WebP quedan **65 imágenes referenciadas y 0 huérfanas**: las 15 sobrantes de la
versión simple se movieron a `img/_originales/` junto con los originales JPG/PNG.
`img/Ruben_traje.jpg` se conserva solo para `og:image`; el retrato, el hero y los
bloques decorativos del HTML usan ya `.webp`. El validador ahora revisa también
`js/script.js`, para detectar si falta el `placeholder.webp`.

### Estado actual: ✅ repositorio definido, listo para publicar

Se recuperó el acceso a GitHub y se decidió **reutilizar el repo `portafolio`**,
para que la URL pública no cambie:

- Repo: `https://github.com/IngRubenValero/portafolio.git` (GitHub redirige la variante en minúsculas; usar esta en `publicar.sh`)
- URL: `https://ingrubenvalero.github.io/portafolio/`
- Correo de contacto: `Ing.RubenValero@outlook.com` (confirmado activo; se deja tal cual)
- `og:url` y `og:image` de `index.html` ya apuntan a la URL real.

`publicar.sh` ya tiene `REPO_URL` rellena y **el sitio está publicado**: el primer
`push` se ejecutó correctamente tras recuperar el acceso. Cada actualización se sube
con el mismo `bash publicar.sh`; Git puede pedir credenciales mediante Git Credential
Manager / GitHub Desktop / token personal. No hay tokens ni contraseñas guardados en
el proyecto. `GIT_NAME` y `GIT_EMAIL` son solo la firma local del commit.

El repo remoto **ya tiene historial** del sitio anterior. Por eso el script:

1. Detecta solo la rama por defecto (`main` o `master`) con `git ls-remote --symref`.
2. Guarda el commit anterior en la rama local `respaldo/sitio-anterior` la primera
   vez; en ejecuciones posteriores no la sobreescribe.
3. Hace que el nuevo commit sea **hijo** del anterior y sube con un `push` normal,
   **sin `--force`**. El historial viejo sigue disponible en GitHub.
4. Valida los activos antes de tocar nada; si hay rutas rotas se detiene sin commit.

## 🚀 Despliegue en GitHub Pages

1. Desde Git Bash, en la raíz del proyecto: `bash publicar.sh`.
2. Cuando Git pida credenciales, iniciar sesión. No escribir el token en ningún
   archivo del repositorio.
3. Verificar Settings → Pages → **Deploy from a branch** → la rama que indicó el
   script / `root`. Si Pages apuntaba a otra rama, cambiarla.
4. Visitar `https://ingrubenvalero.github.io/portafolio/` (1–2 minutos).

En cada actualización posterior basta con repetir los pasos 1–5 del flujo anterior;
el script detecta el historial existente y solo sube los cambios nuevos.

## 📝 Mejoras Futuras Sugeridas

- [x] Optimizar imágenes a formato WebP (hecho: −61 % de peso, conversión automática en el admin)
- [ ] Agregar Progressive Web App (PWA)
- [ ] Implementar Service Worker para offline
- [ ] Agregar sección de testimonios
- [ ] Formulario de contacto funcional
- [ ] Blog de proyectos
- [ ] Certificados y logros
- [ ] Integración con Google Analytics

## 🎨 Personalización

### Cambiar Colores
Editar variables en `css/styles.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --text-color: #333;
    --bg-color: #f8f9fa;
}
```

### Agregar Proyectos

Usar `admin.html` (recomendado) o editar `data/projects.json`. **Ya no se edita
`js/script.js`**: los proyectos se cargan por `fetch` desde el JSON.

```json
{
    "id": 12,
    "title": "Nuevo Proyecto",
    "description": "Descripción breve",
    "image": "img/nuevo-proyecto-01.webp",
    "category": "ingenieria",
    "details": "## Descripción del Proyecto\n\nTexto en markdown...",
    "gallery": ["img/nuevo-proyecto-01.webp", "img/nuevo-proyecto-02.webp"]
}
```

Los tres bloques `##` de `details` se reparten por la composición de la ficha.
El orden de `gallery` define los huecos (ver la sección de la ficha de proyecto).

## 📄 Licencia

© 2025 Ruben Valero. Todos los derechos reservados.

## 📧 Contacto

- **Email**: Ing.RubenValero@outlook.com
- **Teléfono**: (591) 76982955
- **LinkedIn**: [Ruben Valero](https://www.linkedin.com/in/ruben-valero-33868b335/)

---

**Desarrollado con ❤️ para GitHub Pages**
