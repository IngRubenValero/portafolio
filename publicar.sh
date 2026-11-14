#!/usr/bin/env bash
# =============================================================
# Publica el portafolio en GitHub Pages.
# Ejecutar desde Git Bash:  bash publicar.sh
#
# Repositorio: https://github.com/ingrubenvalero/portafolio.git
# URL publica: https://ingrubenvalero.github.io/portafolio/
#
# El repo remoto YA TIENE HISTORIAL (el sitio anterior). Este script
# lo conserva: guarda el estado anterior en una rama local de respaldo
# y hace un push normal, SIN force. No guarda credenciales; las pide
# Git Credential Manager en el primer push.
# =============================================================
set -euo pipefail

REPO_URL="https://github.com/ingrubenvalero/portafolio.git"
BACKUP_REF="refs/heads/respaldo/sitio-anterior"
GIT_NAME="Ruben Valero"
GIT_EMAIL="portafolio@local"

cd "$(dirname "$0")"

if [[ -z "$REPO_URL" || "$REPO_URL" == "PENDIENTE" || "$REPO_URL" == *"TU_USUARIO"* ]]; then
    echo "============================================================"
    echo " FALTA UN DATO: la URL del repositorio de GitHub (REPO_URL)"
    echo "============================================================"
    echo " (No se ha tocado ningun archivo ni se ha hecho ningun push.)"
    exit 1
fi

echo "==> 1/7 Validando rutas de imagenes y datos..."
if command -v python >/dev/null 2>&1; then
    PY=python
elif command -v python3 >/dev/null 2>&1; then
    PY=python3
else
    echo "ERROR: no se encontro Python para ejecutar tools/validar.py"
    exit 1
fi
if ! "$PY" tools/validar.py; then
    echo
    echo "ERROR: hay rutas rotas. Corrigelas antes de publicar."
    echo "No se ha hecho ningun commit ni ningun push."
    exit 1
fi

echo "==> 2/7 Preparando repositorio git..."
if [[ ! -d .git ]]; then
    git init -q -b main
fi
if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi

echo "==> 3/7 Detectando la rama por defecto del repositorio remoto..."
DEFAULT_REF="$(git ls-remote --symref "$REPO_URL" HEAD 2>/dev/null | sed -n 's/^ref: \([^[:space:]]*\)[[:space:]]*HEAD$/\1/p' | head -n 1 || true)"
if [[ "$DEFAULT_REF" == refs/heads/* ]]; then
    BRANCH="${DEFAULT_REF#refs/heads/}"
else
    BRANCH="main"
fi
echo "    Rama: $BRANCH"
git symbolic-ref HEAD "refs/heads/$BRANCH"

echo "==> 4/7 Consultando el historial remoto..."
REMOTE_OK=false
if git fetch --quiet origin "$BRANCH" 2>/dev/null; then
    if git rev-parse --verify "refs/remotes/origin/$BRANCH" >/dev/null 2>&1; then
        REMOTE_OK=true
    fi
elif [[ -n "$(git ls-remote --heads "$REPO_URL" 2>/dev/null)" ]]; then
    echo "ERROR: no se pudo leer el historial remoto (URL, rama o credenciales)."
    echo "No se ha hecho ningun commit ni ningun push."
    exit 1
fi

if [[ "$REMOTE_OK" == true ]]; then
    REMOTE_COMMIT="$(git rev-parse "refs/remotes/origin/$BRANCH")"
    if ! git rev-parse --verify "$BACKUP_REF" >/dev/null 2>&1; then
        git update-ref "$BACKUP_REF" "$REMOTE_COMMIT"
        echo "    Respaldo del sitio anterior creado en 'respaldo/sitio-anterior'."
    else
        echo "    Respaldo anterior ya existe ($(git rev-parse --short "$BACKUP_REF"))."
    fi
    # Apunta la rama local al ultimo commit remoto SIN tocar el arbol de trabajo.
    # Asi el nuevo commit sera hijo del anterior y el push no necesita force.
    git update-ref "refs/heads/$BRANCH" "$REMOTE_COMMIT"
    git read-tree HEAD
    echo "    Historial remoto conservado: $REMOTE_COMMIT"
else
    echo "    Repositorio remoto vacio: se creara el primer commit."
fi

echo "==> 5/7 Preparando archivos..."
git add -A
if git diff --cached --quiet; then
    echo "    Sin cambios locales que confirmar."
else
    echo "==> 6/7 Creando confirmacion..."
    git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
        commit -q -m "Actualizar portafolio: $(date '+%Y-%m-%d %H:%M')"
fi

echo "==> 7/7 Subiendo a GitHub..."
if ! git push -u origin "$BRANCH"; then
    echo
    echo "No se pudo subir. GitHub pidiendo credenciales es lo normal en el primer push."
    echo "Opciones: GitHub Desktop, Git Credential Manager o un token personal."
    echo "Los cambios ya estan confirmados localmente; vuelve a ejecutar este script."
    exit 1
fi

echo
echo "Listo. GitHub Pages reconstruira el sitio en 1-2 minutos."
echo "URL: https://ingrubenvalero.github.io/portafolio/"
echo "Si Pages apunta a otra rama: Settings > Pages > Branch > $BRANCH / root"
