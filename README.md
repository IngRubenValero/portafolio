# 🏗️ Portafolio de Ruben Valero - Ingeniero Civil

Portafolio profesional optimizado para GitHub Pages mostrando proyectos de ingeniería civil, cálculo estructural y metodología BIM.

## ✨ Mejoras Implementadas (Noviembre 2026)

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
├── admin.bat               # Doble clic: servidor local + abrir el panel en Chrome/Edge
├── css/
│   ├── styles.css         # Estilos base heredados (filtros, modal)
│   ├── design.css         # Capa visual editorial clara
│   ├── viewer.css         # Visor de imágenes, móvil primero
│   └── styles_backup.css  # Respaldo
├── js/
│   ├── script.js          # Lógica principal + historial de capas + puente al visor
│   ├── viewer.js          # Visor: swipe, pinch, doble toque, zoom, teclado
│   ├── design.js          # Navegación, contadores y menú móvil
│   ├── site.js            # Aplica data/site.json a las imágenes fijas del HTML
│   ├── content.js         # Aplica data/content.json a los textos fijos del HTML
│   └── script_backup.js   # Respaldo
├── data/
│   ├── projects.json      # Contenido de los proyectos (fuente de verdad)
│   ├── site.json          # Imágenes fijas de la portada (fuente de verdad)
│   └── content.json       # Textos y enlaces fijos del sitio (fuente de verdad)
├── img/                    # Imágenes publicadas, en WebP
│   └── _originales/        # JPG/PNG previos: solo locales, excluidos por .gitignore
├── tools/
│   ├── validar.py          # Comprueba rutas antes de publicar
│   └── optimizar_imagenes.py  # Conversión JPG/PNG -> WebP (Pillow)
├── publicar.sh             # Valida, confirma y sube a GitHub Pages
├── publicar.bat            # Lanzador para Windows: doble clic → publicar.sh
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

### Imágenes fijas del sitio (`data/site.json` / `js/site.js`)

La portada, la foto de perfil y el bloque de contacto **ya no se editan en el HTML**.
La vista **Imágenes del sitio** de `admin.html` permite cambiarlas desde el panel,
sin tocar código:

| Hueco | Dónde se ve |
|---|---|
| `hero` | Imagen a sangre detrás del titular principal |
| `heroFloat` | Tarjeta flotante «Modelado BIM» del hero |
| `portrait` | Retrato de la sección «Sobre mí» |
| `cta` | Fondo del bloque oscuro «Solicitar presupuesto» |

Cómo funciona:

- `index.html` mantiene un `src` **válido** en cada `<img data-site-image="…">`.
  `js/site.js` lee `data/site.json` con `cache: 'no-store'` y sustituye solo las
  rutas configuradas, validando que empiecen por `img/` y tengan extensión de imagen.
  Si el JSON falta, falla la red o una ruta es inválida, **la página sigue viéndose
  igual** gracias al `src` de respaldo.
- El panel convierte la imagen subida a WebP (máximo 2400 px), la escribe como
  `img/sitio-<hueco>.webp` y actualiza `data/site.json`. También admite
  **Guardar ruta** para apuntar a una imagen que ya exista; comprueba por HTTP que
  el archivo existe antes de escribir.
- Al cambiar `portrait` se regenera además `img/Ruben_traje.jpg`, la vista previa
  `og:image`. Ese archivo **debe seguir en JPG**: los rastreadores de
  WhatsApp/LinkedIn/X no ejecutan JavaScript ni manejan WebP de forma fiable.
- Antes de cada escritura se crea `data/site.respaldo.json` (excluido por
  `.gitignore`). `data/projects.json` **nunca se toca** desde esta vista.
- `tools/validar.py` comprueba los cuatro huecos y sus rutas antes de publicar.

`admin.html` no reescribe `index.html`: por eso un cambio de portada no puede romper
el marcado ni los meta tags. La vista incluye **Restaurar respaldo de site.json**
para volver a las 4 rutas anteriores.

### Textos y enlaces del sitio (`data/content.json` / `js/content.js`)

Los textos fijos de la portada ya no se editan en el HTML. La vista
**Textos del sitio** del panel permite cambiar 41 textos y 5 enlaces:

- **Portada**: etiqueta, titular, subtítulo, botones, tarjeta flotante y pie.
- **Enfoque**: titular, bajada, las cuatro cifras y los dos párrafos
  (admiten `**negrita**`).
- **Sobre mí**: nombre, cargo, experiencia, ubicación y texto del botón de CV.
- **Proyectos y contacto**: titulares, botones, línea de correo/teléfono.
- **Pie y SEO**: texto del pie, título de la pestaña y descripción para
  buscadores y redes.
- **Enlaces**: correo, teléfono (solo dígitos), teléfono visible, LinkedIn y CV.

Cómo funciona:

- `index.html` marca cada texto con `data-content="clave"` y conserva el valor
  actual como **respaldo**. `js/content.js` lee `data/content.json` con
  `cache: 'no-store'` y sustituye solo lo configurado. Si el JSON falta o una
  clave no es válida, la portada sigue viéndose exactamente igual.
- Los campos «una línea por renglón» convierten cada salto en un `<br>`; los
  párrafos interpretan `**negrita**`. Todo se construye con nodos de texto, nunca
  con `innerHTML`, así que el contenido del panel no puede inyectar HTML.
- El **número de la tercera cifra es automático** (cuenta los proyectos): no se
  edita para no romper ese contador.
- Correo y teléfono se propagan a todos los `mailto:`, `tel:`, WhatsApp, la
  ficha de cada proyecto y los productos. Al guardar se validan formato de
  correo, dígitos del teléfono y URLs `http(s)` de LinkedIn y CV.
- Antes de cada escritura se crea `data/content.respaldo.json` (en `.gitignore`).
  La vista tiene **Restaurar respaldo**.

### Contrato de datos y verificación previa

Para que «lo que guarda el admin» sea siempre «lo que muestra la web», ambos lados
comparten las mismas reglas. `validateProjectsPayload()` en `admin.html` y
`tools/validar.py` aplican el **mismo contrato** antes de escribir o publicar:

| Regla | Por qué |
|---|---|
| `id` entero positivo y único | Va en `onclick="openModal(id)"` y se compara con `===`: un id de texto hace que la ficha no abra |
| `category` solo `ingenieria` / `arquitectura` / `programacion` / `producto` | Son exactamente los `data-filter` de `index.html`; otra categoría deja el proyecto sin filtro |
| `title`, `description`, `details` texto no vacío | La tarjeta y la composición de la ficha los necesitan |
| `image` y `gallery` bajo `img/`, extensión de imagen, sin `..` | Evita rutas rotas y rutas que salgan del árbol publicado |
| `image` debe estar dentro de `gallery` | Si no, la tarjeta y la cabecera de la ficha muestran fotos distintas |
| `youtubeUrl` solo `http(s)` | No se inyectan esquemas `javascript:` en los enlaces de producto |

Todo lo que el JSON interpola en el HTML se **escapa** (`js/script.js`,
`js/viewer.js` y el propio listado de `admin.html`), así que un título con
comillas, `<` o `>` escrito en el panel no rompe la portada. `js/site.js` acepta
las mismas rutas que el admin (incluidas subcarpetas), de modo que una ruta
guardada nunca se ignora en silencio.

La vista **Verificación previa** del panel genera un informe de solo lectura
antes de publicar: contraste de esquema, existencia real por HTTP de todas las
imágenes (incluidas `placeholder.webp` y `og:image`), `data-site-image` y
`data-filter` contra `index.html`, índices de `slots`, y avisos de composición
(menos de 6 imágenes o menos de 3 bloques `##`). Los **errores** bloquean;
los **avisos** no.

**Detalles del proyecto:** el campo ya no indica `usa \n`, sino que pide bloques
`##`. La ficha reparte el primer bloque en la tarjeta 1, el segundo en la
tarjeta 2 y el resto en «Desarrollo». Con 3 o más bloques la composición se ve
completa.

**Integridad de `img/`:** reordenar y renombrar la galería ahora sí persisten en
el JSON; los autoguardados no crean un proyecto nuevo sin pulsar *Guardar
Proyecto*; las imágenes importadas se escriben **después** de validar el
formulario (antes un título vacío dejaba archivos huérfanos). Quitar o
auto-renombrar una imagen **nunca borra ni renombra un archivo que use otro
proyecto o `data/site.json`**: se conserva o se crea una copia, para no romper
la portada pública.

### Navegación móvil y botón atrás

En móvil (≤ 640 px) la ficha de proyecto sustituye la barra superior por una
**barra fija** (`#sheetMobileBar`) con la X de cierre siempre a mano, aunque se haya
hecho scroll: antes la X quedaba arriba y era inalcanzable. La barra respeta
`env(safe-area-inset-top)` y el modal usa `overscroll-behavior: contain` para que
el gesto de scroll no se propague a la página.

El botón **atrás del teléfono** ya no saca de la web. `OverlayNav` en `js/script.js`
registra cada capa abierta (ficha / visor) con `history.pushState` y, en `popstate`,
cierra **solo la capa superior**: atrás 1 cierra el visor, atrás 2 cierra la ficha,
y la página sigue abierta. Si se cierra con la X, `history.go(-depth)` consume la
entrada para no dejar historial huérfano; el botón «adelante» reabre la ficha
llamando a `openModal(id, true)` sin crear otra entrada. `js/viewer.js` separa
`rawClose()` del cierre iniciado por el usuario para que el historial sea la única
fuente de verdad.

### Limpieza visual de fichas y tarjetas

A petición de la revisión en móvil se eliminaron los elementos que recargaban la
composición:

- Etiquetas `IMAGEN 01`, pies `Vista 01 / Documentación gráfica` y flechas del catálogo.
- Botones e iconos de «ampliar» sobre las imágenes, incluido el de la portada.
  **La ampliación sigue disponible pulsando directamente la imagen** (cursor
  `zoom-in`); el visor se abre en el índice real de la galería.
- La leyenda de categoría (`ingenieria`, `arquitectura`…) sobre la portada de cada
  tarjeta. Era un `::before` de CSS; ahora está desactivado, pero el atributo
  **`data-category` se conserva** para que los filtros sigan funcionando.

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

Además, `admin.html` crea **`data/projects.respaldo.json`**,
**`data/site.respaldo.json`** y **`data/content.respaldo.json`** con el estado
anterior antes de cada escritura de proyectos, imágenes o textos. Los tres están
en `.gitignore`, así que nunca se publican. Se recuperan con **Restaurar
respaldo** (*Exportar*), **Restaurar respaldo de site.json** (*Imágenes del
sitio*) y **Restaurar respaldo** (*Textos del sitio*).

## 🔁 Checklist: cada vez que cambies algo

**La regla que evita confusiones:** `admin.html` escribe en **tu disco**, no en GitHub.
Añadir un proyecto desde el panel **NO actualiza la web pública** hasta que ejecutas
`publicar.sh`. Guardar ≠ publicar.

**Arranque más simple (Windows):** doble clic en **`admin.bat`**, en la raíz del
proyecto. Detecta Python (`py -3`), elige un puerto libre entre 8766 y 8770,
abre `admin.html` en Chrome o Edge y deja el servidor corriendo en la ventana.
Para detenerlo, cierra esa ventana o pulsa `Ctrl+C`. No necesitas escribir ningún
comando. Las instrucciones manuales de abajo siguen siendo válidas.

**Conectar la carpeta (y mover el proyecto):** el botón **Conectar carpeta** está
siempre visible en la franja verde del panel; cuando ya estás conectado cambia a
**Cambiar carpeta** y muestra el nombre de la carpeta elegida. Solo hay **una**
conexión: la raíz del proyecto (la que contiene `data/` e `img/`). Ya no existe
la conexión separada a `img/`.

Puedes mover la carpeta del portafolio a cualquier ubicación fija sin tocar
ningún archivo: `admin.bat`, `publicar.bat`, `publicar.sh` y las herramientas de
`tools/` se resuelven a sí mismos, y todo en `data/*.json` e `index.html` usa
rutas relativas (`img/…`). Después del movimiento, abre el panel y pulsa
**Cambiar carpeta** para elegir la nueva ubicación; el navegador puede volver a
pedir permiso.

**Atajo antes de publicar:** abre **Verificación previa** en el panel y pulsa
*Ejecutar verificación*. Es de solo lectura y te dice si hay errores que
bloquean o solo avisos de composición. Después, `python tools/validar.py`
repite las mismas reglas desde la línea de comandos.

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
   `data/` e `img/`). Conectar **solo lee** `data/projects.json` y `data/site.json`;
   no los modifica. El estado debe quedar en verde: `Conectado · listo para publicar`.
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

### D) Cambiar la portada principal o la foto de perfil

1. Levantar el servidor local (`python -m http.server 8766`) y abrir
   `http://localhost:8766/admin.html` en Chrome/Edge.
2. **Conectar carpeta del proyecto** (la raíz). Sin conexión la vista
   *Imágenes del sitio* avisa en rojo **y no guarda nada**.
3. Entrar en **Imágenes del sitio** → *Subir imagen* en el hueco deseado
   (convierte a WebP y escribe `data/site.json`) o *Guardar ruta* para una imagen
   ya existente. Si cambias **Foto de perfil**, se regenera también
   `img/Ruben_traje.jpg` (`og:image`).
4. `python tools/validar.py` → `bash publicar.sh` → revisar la URL pública.
   La vista **sí** cambia el sitio publicado, pero solo después de publicar:
   guardar en el panel sigue siendo local.

**No editar `index.html` para cambiar estas imágenes**: el `src` del HTML es solo
el respaldo y `js/site.js` lo sobrescribe con `data/site.json` en cada carga.

### E) Cambiar textos, cifras o datos de contacto

1. Servidor local + **Conectar carpeta del proyecto**.
2. **Textos del sitio** → editar los campos → **Guardar textos**
   (escribe `data/content.json`; `index.html` no se toca).
3. `python tools/validar.py` → `bash publicar.sh`.

Igual que con las imágenes: el HTML es el respaldo, `js/content.js` aplica el
JSON en cada carga. Si algo sale mal, **Restaurar respaldo** vuelve al estado
anterior.

### F) Reordenar proyectos y limpiar imágenes

- **Orden en la web**: en la lista de proyectos, las flechas ↑/↓ de cada fila
  cambian el orden y lo escriben en `data/projects.json`. El orden del archivo
  es el orden de la portada; el primero no puede subir ni el último bajar.
- **Imágenes sin usar**: en **Verificación previa** → *Buscar imágenes sin usar*.
  Lista las que no referencia ningún proyecto, `data/site.json` ni `index.html`.
  El botón las **mueve a `img/_sin-usar/`** (no las borra) y esa carpeta está en
  `.gitignore`, así que no se publica. Puedes devolverlas a `img/` cuando quieras.

### Herramientas de rescate (no son el flujo normal)

- **Restaurar respaldo** (vista *Exportar*): vuelve al `data/projects.json`
  anterior a la última escritura.
- **Importar JSON**: rechaza archivos vacíos, malformados o con proyectos
  incompletos, y pide confirmación si reduces drásticamente el número de proyectos.
- **Descargar projects.json**: útil solo si trabajas sin conexión a carpetas;
  entonces tendrás que reemplazar el archivo a mano antes de publicar.

## 🔄 Flujo de actualización (de dónde sale cada cosa)

**Fuentes de verdad:** `data/projects.json` (proyectos), `data/site.json` (imágenes
fijas), `data/content.json` (textos y enlaces) e `img/` (archivos). La portada lee
los tres JSON con `fetch(..., { cache: 'no-store' })` y un query único, así que un
`push` se refleja sin limpiar caché a mano. `admin.html` es una **herramienta de
autoría local**: escribe en tu disco, nunca en la web publicada.

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
bloques decorativos del HTML usan ya `.webp`. El validador revisa también
`js/script.js` (para detectar si falta el `placeholder.webp`), los cuatro huecos de
`data/site.json` y el **contrato de datos** (ids, categorías, rutas, `image` dentro
de `gallery`), con las mismas reglas que el panel. Un dato que la web no pueda
mostrar detiene la publicación.

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

La vista **Publicar** del panel recuerda el flujo, permite copiar los comandos y
lleva a la verificación previa. Hay dos formas de ejecutarlo:

- **Windows (recomendada):** doble clic en **`publicar.bat`** en la raíz del
  proyecto. Busca Git Bash, ejecuta `publicar.sh` y deja el resultado en pantalla.
- **Git Bash:** `bash publicar.sh` desde la raíz.

El navegador no puede hacer `git push` por seguridad: el panel escribe en disco y
la publicación siempre es este último paso explícito.

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
- [x] Poder cambiar portada y foto de perfil desde `admin.html` (hecho: vista *Imágenes del sitio*)
- [x] Corregir el botón atrás del móvil y la X flotante (hecho: `OverlayNav` + barra fija)
- [x] Limpiar etiquetas, categorías y botones de ampliar de las fichas (hecho)
- [x] Contrato de datos + vista «Verificación previa» en el admin (hecho)
- [x] Editar desde el admin los textos fijos y los enlaces del sitio (hecho: `data/content.json` + `js/content.js`)
- [x] Reordenar proyectos desde el panel (hecho: flechas ↑/↓ que escriben en `data/projects.json`)
- [x] Publicación asistida (hecho: `publicar.bat` + vista *Publicar* con comandos; el `push` sigue siendo local)
- [x] Apartar imágenes huérfanas de `img/` desde el panel (hecho: se mueven a `img/_sin-usar/`, no se borran)
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
