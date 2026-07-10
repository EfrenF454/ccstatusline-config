#!/usr/bin/env bash
#
# Instalador de la configuración de statusline (ccstatusline) para Claude Code.
# Copia el settings.json de ccstatusline y engancha la statusline en Claude Code.
#
# Uso:
#   ./install.sh
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_SRC="$REPO_DIR/ccstatusline-settings.json"

CCS_DIR="$HOME/.config/ccstatusline"
CCS_DEST="$CCS_DIR/settings.json"
CLAUDE_DIR="$HOME/.claude"
CLAUDE_SETTINGS="$CLAUDE_DIR/settings.json"

echo "==> Instalando configuración de statusline para Claude Code"

# 1. Verificar dependencias
if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js no está instalado. Instálalo desde https://nodejs.org (v18+)." >&2
    exit 1
fi
if ! command -v npx >/dev/null 2>&1; then
    echo "ERROR: npx no está disponible (viene con Node.js/npm)." >&2
    exit 1
fi

# 2. Copiar la configuración de ccstatusline (respaldando la existente)
mkdir -p "$CCS_DIR"
if [ -f "$CCS_DEST" ]; then
    cp "$CCS_DEST" "$CCS_DEST.bak.$(date +%s)"
    echo "==> Respaldé tu config previa en $CCS_DEST.bak.*"
fi
cp "$CONFIG_SRC" "$CCS_DEST"
echo "==> Copié la configuración a $CCS_DEST"

# 3. Enganchar la statusline en Claude Code (settings.json)
mkdir -p "$CLAUDE_DIR"
if [ ! -f "$CLAUDE_SETTINGS" ]; then
    echo '{}' > "$CLAUDE_SETTINGS"
fi

node -e '
const fs = require("fs");
const path = process.argv[1];
let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(path, "utf8")); } catch (e) {}
cfg.statusLine = { type: "command", command: "npx -y ccstatusline@latest" };
fs.writeFileSync(path, JSON.stringify(cfg, null, 2) + "\n");
console.log("==> Enganché la statusline en " + path);
' "$CLAUDE_SETTINGS"

echo ""
echo "✅ Listo. Abre (o reinicia) Claude Code y verás la statusline."
echo "   La primera vez npx descargará ccstatusline automáticamente."
echo ""
echo "   Si prefieres instalarlo global para arranque instantáneo:"
echo "     npm install -g ccstatusline@latest"
echo "   y cambia el command en $CLAUDE_SETTINGS a la ruta del binario."
