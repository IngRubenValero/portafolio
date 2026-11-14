#!/usr/bin/env python3
"""Optimiza las imagenes referenciadas del portafolio a WebP.

- Convierte solo las imagenes que realmente usa la pagina.
- PNG / planos  -> WebP calidad 90 (conserva lineas finas y texto).
- JPG / renders -> WebP calidad 82.
- Limita el lado mayor a 2400 px (suficiente para el zoom del visor).
- Corrige orientacion EXIF y conserva transparencia (alpha).
- Reenlaza de forma atomica data/projects.json, index.html, CSS y JS.
- NUNCA borra un original: los mueve a img/_originales/ (gitignored).
- Mantiene img/Ruben_traje.jpg porque og:image debe seguir siendo JPG.

Uso:
    python tools/optimizar_imagenes.py --dry-run   # solo informa
    python tools/optimizar_imagenes.py             # aplica los cambios

Requiere Pillow. No necesita conexion a internet.
"""

import argparse
import json
import os
import re
import shutil
import sys

try:
    from PIL import Image, ImageDraw, ImageOps
except ImportError:
    print("ERROR: falta Pillow. Instalar con: python -m pip install Pillow")
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "img")
ORIGINALES = os.path.join(IMG, "_originales")
DATA = os.path.join(ROOT, "data", "projects.json")

MAX_SIDE = 2400
QUALITY = {".png": 90, ".jpg": 82, ".jpeg": 82}
KEEP_JPG = "Ruben_traje.jpg"          # og:image: los scrapers sociales no leen WebP
OG_LINE = "og:image"                   # nunca reenlazar esta linea de index.html
IMG_RE = re.compile(r"img/([A-Za-z0-9._%\-/]+\.(?:png|jpe?g|webp|svg|gif))", re.I)
CSS_COMMENT = re.compile(r"/\*.*?\*/", re.S)
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
LEGACY_EXT = (".png", ".jpg", ".jpeg")


def human(size):
    return "%.2f MB" % (size / 1048576)


def text_sources():
    """Archivos de texto donde pueden aparecer rutas img/..."""
    sources = ["index.html", os.path.join("js", "script.js")]
    css_dir = os.path.join(ROOT, "css")
    if os.path.isdir(css_dir):
        sources += [
            os.path.join("css", f) for f in sorted(os.listdir(css_dir))
            if f.endswith(".css") and "backup" not in f and "_v1" not in f
        ]
    return [s for s in sources if os.path.isfile(os.path.join(ROOT, s))]


def referenced_names():
    """Nombres de archivo referenciados por el JSON y por el codigo."""
    names = set()
    with open(DATA, encoding="utf-8") as fh:
        data = json.load(fh)

    def walk(node):
        if isinstance(node, str):
            names.update(os.path.basename(m) for m in IMG_RE.findall(node))
        elif isinstance(node, dict):
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(data)
    for source in text_sources():
        with open(os.path.join(ROOT, source), encoding="utf-8") as fh:
            content = fh.read()
        if source.endswith(".css"):
            content = CSS_COMMENT.sub("", content)
        if source.endswith(".html"):
            content = HTML_COMMENT.sub("", content)
        names.update(os.path.basename(m) for m in IMG_RE.findall(content))
    return names


def convert_one(name, dry_run=False):
    """Devuelve (origen, destino, antes, despues) o None si no conviene."""
    source = os.path.join(IMG, name)
    base, ext = os.path.splitext(name)
    target_name = base + ".webp"
    target = os.path.join(IMG, target_name)
    before = os.path.getsize(source)

    if os.path.exists(target):
        return None  # ya convertida en una ejecucion anterior

    image = ImageOps.exif_transpose(Image.open(source))
    width, height = image.size
    has_alpha = (
        image.mode in ("RGBA", "LA")
        or (image.mode == "P" and "transparency" in image.info)
    )
    image = image.convert("RGBA" if has_alpha else "RGB")

    scale = MAX_SIDE / max(width, height)
    if scale < 1:
        image = image.resize(
            (max(1, int(width * scale)), max(1, int(height * scale))),
            Image.LANCZOS,
        )

    tmp = target + ".tmp"
    image.save(tmp, "WEBP", quality=QUALITY[ext.lower()], method=5)
    # Verificar que el resultado se puede decodificar antes de aceptarlo.
    with Image.open(tmp) as check:
        check.load()
    after = os.path.getsize(tmp)

    if after >= before:
        os.remove(tmp)
        return None  # WebP no mejora: se conserva el original y su ruta

    if dry_run:
        os.remove(tmp)
    else:
        os.replace(tmp, target)
    return (name, target_name, before, after)


def replace_in_json(mapping):
    with open(DATA, encoding="utf-8") as fh:
        data = json.load(fh)

    def walk(node):
        if isinstance(node, str):
            for old, new in mapping.items():
                node = node.replace("img/" + old, "img/" + new)
            return node
        if isinstance(node, dict):
            return {k: walk(v) for k, v in node.items()}
        if isinstance(node, list):
            return [walk(v) for v in node]
        return node

    data = walk(data)
    with open(DATA, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=4)
        fh.write("\n")


def replace_in_text(sources, mapping):
    for source in sources:
        path = os.path.join(ROOT, source)
        with open(path, encoding="utf-8") as fh:
            lines = fh.readlines()
        changed = False
        out = []
        for line in lines:
            if OG_LINE in line:
                out.append(line)  # og:image se queda en JPG
                continue
            new_line = line
            for old, new in mapping.items():
                new_line = new_line.replace("img/" + old, "img/" + new)
            if new_line != line:
                changed = True
            out.append(new_line)
        if changed:
            with open(path, "w", encoding="utf-8") as fh:
                fh.writelines(out)


def make_placeholder(dry_run=False):
    target = os.path.join(IMG, "placeholder.webp")
    if os.path.exists(target):
        return False
    if dry_run:
        return True
    image = Image.new("RGB", (800, 600), "#EDEAE4")
    draw = ImageDraw.Draw(image)
    draw.rectangle([60, 60, 740, 540], outline="#D6D2C8", width=2)
    try:
        draw.text((400, 300), "Imagen no disponible", fill="#8B877E", anchor="mm")
    except Exception:
        pass
    image.save(target, "WEBP", quality=80, method=5)
    print("Creado img/placeholder.webp (fallback que antes no existia).")
    return True


def retire_originals(keep, dry_run=False):
    """Mueve los originales JPG/PNG fuera del arbol publicado, sin borrarlos.

    `keep` son los archivos que siguen referenciados (no convertidos) y que
    por tanto NO se deben mover, o se romperian sus rutas.
    """
    if dry_run:
        print("Se moverian a img/_originales/ los originales no referenciados.")
        return
    os.makedirs(ORIGINALES, exist_ok=True)
    moved = 0
    for name in sorted(os.listdir(IMG)):
        path = os.path.join(IMG, name)
        if not os.path.isfile(path):
            continue
        if not name.lower().endswith(LEGACY_EXT):
            continue
        if name in keep:
            continue  # sigue en uso (og:image o WebP no convenia)
        shutil.move(path, os.path.join(ORIGINALES, name))
        moved += 1
    print("Originales conservados en img/_originales/: %d (no se publican)." % moved)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="solo informar, no escribir")
    args = parser.parse_args()

    if not os.path.isfile(DATA):
        print("ERROR: no existe data/projects.json")
        return 1

    names = referenced_names()
    candidates = sorted(
        n for n in names
        if n.lower().endswith(LEGACY_EXT)
        and os.path.isfile(os.path.join(IMG, n))
    )
    if not candidates:
        print("Nada que convertir: todas las imagenes referenciadas ya son WebP.")
        return 0

    print("Imagenes referenciadas: %d | candidatas a WebP: %d" % (len(names), len(candidates)))
    results = []
    for name in candidates:
        result = convert_one(name, args.dry_run)
        if result:
            results.append(result)
    skipped = len(candidates) - len(results)

    before_total = sum(r[2] for r in results)
    after_total = sum(r[3] for r in results)
    print("Convertidas: %d | conservadas sin cambio: %d" % (len(results), skipped))
    print("Peso: %s -> %s (ahorro %s, %.1f%%)" % (
        human(before_total), human(after_total),
        human(before_total - after_total),
        100 * (before_total - after_total) / before_total if before_total else 0,
    ))

    if not results:
        print("No hay conversiones utiles. No se modifica ningun archivo.")
        return 0

    mapping = {old: new for old, new, _, _ in results}
    still_legacy = set(candidates) - set(mapping)
    sources = text_sources()

    if args.dry_run:
        print("\nDRY-RUN: no se ha escrito ningun archivo.")
        print("Ejemplo de reenlazado: %s -> %s" % (results[0][0], results[0][1]))
        print("Se conservan con su formato original: %s" % (", ".join(sorted(still_legacy)) or "ninguno"))
        return 0

    replace_in_json(mapping)
    replace_in_text(sources, mapping)
    print("Rutas actualizadas: data/projects.json + %d archivos de texto." % len(sources))

    # El fallback onerror de js/script.js apuntaba a un archivo inexistente.
    js_path = os.path.join(ROOT, "js", "script.js")
    if os.path.isfile(js_path):
        with open(js_path, encoding="utf-8") as fh:
            js = fh.read()
        js2 = js.replace("img/placeholder.jpg", "img/placeholder.webp")
        if js2 != js:
            with open(js_path, "w", encoding="utf-8") as fh:
                fh.write(js2)
            print("js/script.js: onerror -> img/placeholder.webp")
    make_placeholder()

    retire_originals(still_legacy | {KEEP_JPG})
    print("\nListo. Siguiente paso: python tools/validar.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
