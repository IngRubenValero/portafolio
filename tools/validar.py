#!/usr/bin/env python3
"""Valida los activos del portafolio antes de publicar.

Comprueba que todas las rutas de data/projects.json y las referencias directas
de index.html / css existan en img/. Informa de imagenes huerfanas y de datos
basicos inconsistentes. No modifica ningun archivo.

Uso:  python tools/validar.py
Salida: 0 si todo esta correcto, 1 si hay rutas rotas o datos invalidos.
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "projects.json")
SITE = os.path.join(ROOT, "data", "site.json")
IMG = os.path.join(ROOT, "img")
SITE_KEYS = ("hero", "heroFloat", "portrait", "cta")
IMG_RE = re.compile(r"img/([A-Za-z0-9._%\-/]+\.(?:png|jpe?g|webp|svg|gif))", re.I)
CSS_COMMENT = re.compile(r"/\*.*?\*/", re.S)
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)


def rel(name):
    return "img/" + os.path.basename(name)


def strip_comments(text, source):
    text = CSS_COMMENT.sub("", text)
    if source.endswith(".html"):
        text = HTML_COMMENT.sub("", text)
    return text


def main():
    problems = []
    referenced = set()

    if not os.path.isfile(DATA):
        print("ERROR: no existe data/projects.json")
        return 1

    try:
        with open(DATA, encoding="utf-8") as fh:
            projects = json.load(fh).get("projects", [])
    except (OSError, ValueError) as exc:
        print(f"ERROR: data/projects.json no es valido: {exc}")
        return 1

    if not isinstance(projects, list) or not projects:
        print("ERROR: data/projects.json no contiene proyectos")
        return 1

    ids = set()
    for project in projects:
        pid = project.get("id", "(sin id)")
        if pid in ids:
            problems.append(f"id duplicado: {pid}")
        ids.add(pid)
        for field in ("title", "image", "category"):
            if not project.get(field):
                problems.append(f"proyecto {pid}: falta '{field}'")

        paths = [project.get("image")] + list(project.get("gallery") or [])
        for path in paths:
            if not path:
                continue
            referenced.add(rel(path))
            if not os.path.isfile(os.path.join(ROOT, path)):
                problems.append(f"proyecto {pid}: no existe {path}")

    # Imágenes configurables de la portada (data/site.json).
    if os.path.isfile(SITE):
        try:
            with open(SITE, encoding="utf-8") as fh:
                site_images = json.load(fh).get("images", {})
            for key in SITE_KEYS:
                path = site_images.get(key)
                if not isinstance(path, str) or not path.startswith("img/"):
                    problems.append(f"site.json: falta o es inválida la imagen '{key}'")
                    continue
                referenced.add(rel(path))
                if not os.path.isfile(os.path.join(ROOT, path)):
                    problems.append(f"site.json: no existe {path}")
        except (OSError, ValueError) as exc:
            problems.append(f"data/site.json no es válido: {exc}")

    # Referencias directas desde el HTML y el CSS (hero, retrato, CTA...)
    for source in ["index.html", os.path.join("js", "script.js")] + [
        os.path.join("css", f) for f in sorted(os.listdir(os.path.join(ROOT, "css")))
        if f.endswith(".css") and "backup" not in f and "_v1" not in f
    ]:
        full = os.path.join(ROOT, source)
        if not os.path.isfile(full):
            continue
        with open(full, encoding="utf-8") as fh:
            for name in IMG_RE.findall(strip_comments(fh.read(), source)):
                referenced.add(rel(name))

    for name in sorted(referenced):
        if not os.path.isfile(os.path.join(IMG, os.path.basename(name))):
            problems.append(f"referencia directa rota: {name}")

    existing = {
        "img/" + f for f in os.listdir(IMG)
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"))
    }
    orphans = sorted(existing - referenced)

    print(f"Proyectos:        {len(projects)}")
    print(f"Imagenes en img/: {len(existing)}")
    print(f"Referenciadas:    {len(referenced)}")
    print(f"Huerfanas:        {len(orphans)}")
    if orphans:
        print("  (no se usan; no se borran automaticamente)")
        for name in orphans:
            print(f"    - {name}")

    if problems:
        print(f"\nPROBLEMAS ({len(problems)}):")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    print("\nOK: todas las rutas existen. Listo para publicar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
