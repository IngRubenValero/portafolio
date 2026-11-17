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
CONTENT = os.path.join(ROOT, "data", "content.json")
IMG = os.path.join(ROOT, "img")
SITE_KEYS = ("hero", "heroFloat", "portrait", "cta")
# Mismo contrato que validateProjectsPayload() en admin.html. Si un dato lo
# escribe el panel y el validador lo acepta con reglas distintas, la web puede
# romperse en silencio (categoría sin filtro, id de texto, ruta con '..').
CATEGORIES = {"arquitectura", "ingenieria", "programacion", "producto"}
SAFE_PATH = re.compile(r"^img/[A-Za-z0-9._%\-/]+\.(?:png|jpe?g|webp|svg|gif)$", re.I)
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

    def bad_path(path):
        return (not isinstance(path, str) or ".." in path or not SAFE_PATH.match(path.strip()))

    ids = set()
    for project in projects:
        pid = project.get("id", "(sin id)")
        if type(pid) is not int or pid < 1:
            problems.append(f"proyecto {pid}: el id debe ser un entero positivo")
        if pid in ids:
            problems.append(f"id duplicado: {pid}")
        ids.add(pid)
        for field in ("title", "description", "details", "image", "category"):
            value = project.get(field)
            if not isinstance(value, str) or not value.strip():
                problems.append(f"proyecto {pid}: falta o no es texto '{field}'")
        category = project.get("category")
        if isinstance(category, str) and category not in CATEGORIES:
            problems.append(f"proyecto {pid}: categoría '{category}' no tiene filtro en la web")

        gallery = project.get("gallery") or []
        if not isinstance(gallery, list) or not gallery:
            problems.append(f"proyecto {pid}: galería vacía")
            gallery = []

        slots = project.get("slots")
        if slots:
            if not isinstance(slots, dict):
                problems.append(f"proyecto {pid}: slots debe ser un objeto")
            else:
                indexed = []
                hero = slots.get("hero")
                if hero is not None:
                    indexed.append(("hero", hero))
                for key in ("cards", "pair", "catalog", "details"):
                    values = slots.get(key)
                    if values is None:
                        continue
                    if not isinstance(values, list):
                        problems.append(f"proyecto {pid}: slots.{key} debe ser una lista")
                        continue
                    indexed.extend((key, value) for value in values)
                for key, value in indexed:
                    if (type(value) is not int or value < 0 or value >= len(gallery)):
                        problems.append(f"proyecto {pid}: slots.{key} apunta fuera de la galería ({value})")

        paths = [project.get("image")] + list(gallery)
        for path in paths:
            if not path:
                continue
            if bad_path(path):
                problems.append(f"proyecto {pid}: ruta no permitida '{path}'")
                continue
            referenced.add(rel(path))
            if not os.path.isfile(os.path.join(ROOT, path)):
                problems.append(f"proyecto {pid}: no existe {path}")
        image = project.get("image")
        if isinstance(image, str) and image and image not in gallery:
            problems.append(f"proyecto {pid}: 'image' no está en 'gallery' (la tarjeta y la cabecera mostrarían fotos distintas)")
        if project.get("youtubeUrl"):
            url = project.get("youtubeUrl")
            if not isinstance(url, str) or not url.startswith(("http://", "https://")):
                problems.append(f"proyecto {pid}: youtubeUrl debe ser http(s)")

    # Imágenes configurables de la portada (data/site.json).
    if not os.path.isfile(SITE):
        problems.append("falta data/site.json (js/site.js no podría aplicar las imágenes de la portada)")
    else:
        try:
            with open(SITE, encoding="utf-8") as fh:
                site_images = json.load(fh).get("images", {})
            for key in SITE_KEYS:
                path = site_images.get(key)
                if bad_path(path):
                    problems.append(f"site.json: falta o es inválida la imagen '{key}'")
                    continue
                referenced.add(rel(path))
                if not os.path.isfile(os.path.join(ROOT, path)):
                    problems.append(f"site.json: no existe {path}")
        except (OSError, ValueError) as exc:
            problems.append(f"data/site.json no es válido: {exc}")

    # Textos configurables: las claves de content.json deben coincidir con los
    # atributos data-content de index.html. Así el validador detecta un texto
    # nuevo añadido al HTML que el admin todavía no puede editar.
    if not os.path.isfile(CONTENT):
        problems.append("falta data/content.json (js/content.js no podria aplicar los textos)")
    else:
        try:
            with open(CONTENT, encoding="utf-8") as fh:
                content = json.load(fh)
            texts = content.get("texts", {})
            links = content.get("links", {})
            with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as fh:
                html_keys = set(re.findall(r'data-content="([A-Za-z][A-Za-z0-9]*)"', fh.read()))
            for key in sorted(html_keys):
                if not isinstance(texts.get(key), str) or not texts[key].strip():
                    problems.append(f"content.json: falta o esta vacio el texto '{key}'")
            for key in ("pageTitle", "metaDescription"):
                if not isinstance(texts.get(key), str) or not texts[key].strip():
                    problems.append(f"content.json: falta '{key}' (SEO)")
            for key in ("email", "phone", "phoneLabel", "linkedin", "cv"):
                if not isinstance(links.get(key), str) or not links[key].strip():
                    problems.append(f"content.json: falta el enlace '{key}'")
            if isinstance(links.get("email"), str) and "@" not in links["email"]:
                problems.append("content.json: el correo no es valido")
            for key in ("linkedin", "cv"):
                if isinstance(links.get(key), str) and not links[key].startswith(("http://", "https://")):
                    problems.append(f"content.json: '{key}' debe ser una URL http(s)")
        except (OSError, ValueError) as exc:
            problems.append(f"data/content.json no es válido: {exc}")

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
