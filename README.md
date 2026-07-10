# Claude Code · Statusline Config

Mi configuración de la barra de estado (statusline) de **Claude Code**, basada en
[**ccstatusline**](https://github.com/sirmalloc/ccstatusline). Copia este repo y tendrás
la misma barra que yo, con los mismos íconos y colores.

## Vista previa

La barra muestra, en una sola línea, con tema oscuro estilo GitHub:

```
📁 ~/mi-proyecto | 🦉 Opus 4.8 | 🧠 42% | 💪 high | 🌿 main | ⏳ 1h23m
```

| Ícono | Qué muestra | Color |
|-------|-------------|-------|
| 📁 | Directorio de trabajo actual (con `~` para home) | Azul `#79c0ff` |
| 🦉 | Modelo activo | Verde `#79d9a0` |
| 🧠 | Porcentaje de contexto usado | Verde claro `#7ee787` |
| 💪 | Nivel de esfuerzo de razonamiento (thinking effort) | Amarillo `#e3b341` |
| 🌿 | Rama de git actual (solo dentro de un repo) | Morado `#d2a8ff` |
| ⏳ | Temporizador del bloque de trabajo | Gris `#8b949e` |

---

## Requisitos

- **Node.js 18+** (incluye `npm` y `npx`) → https://nodejs.org
- **Claude Code** instalado

## Instalación rápida (recomendada)

```bash
git clone https://github.com/Avzolem/ccstatusline-config.git
cd ccstatusline-config
chmod +x install.sh
./install.sh
```

El script:

1. Copia `ccstatusline-settings.json` a `~/.config/ccstatusline/settings.json`
   (respaldando cualquier config previa que tengas).
2. Engancha la statusline en tu `~/.claude/settings.json`.

Después **reinicia Claude Code** y la barra aparecerá. La primera vez, `npx`
descargará `ccstatusline` automáticamente.

---

## Instalación manual

Si prefieres hacerlo a mano:

**1. Instala ccstatusline** (opcional, `npx` también funciona sin instalar):

```bash
npm install -g ccstatusline@latest
```

**2. Copia la configuración:**

```bash
mkdir -p ~/.config/ccstatusline
cp ccstatusline-settings.json ~/.config/ccstatusline/settings.json
```

**3. Engancha la statusline en Claude Code.** Edita `~/.claude/settings.json` y
añade el bloque `statusLine`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y ccstatusline@latest"
  }
}
```

> Si instalaste ccstatusline global y quieres arranque instantáneo (sin el pequeño
> retraso de `npx`), usa en su lugar la ruta del binario, por ejemplo:
> `"command": "~/.npm-global/bin/ccstatusline"` (ajústala a la salida de
> `which ccstatusline`).

**4. Reinicia Claude Code.**

---

## Personalizar

`ccstatusline` incluye un editor interactivo en la terminal para cambiar íconos,
colores, orden de los elementos, separadores, modo powerline, etc.:

```bash
npx ccstatusline@latest
```

Los cambios se guardan en `~/.config/ccstatusline/settings.json` (el mismo archivo
de este repo). Si haces cambios que te gustan, cópialos de vuelta a
`ccstatusline-settings.json` y súbelos.

---

## Desinstalar

Quita el bloque `"statusLine"` de `~/.claude/settings.json` y, si quieres, borra
`~/.config/ccstatusline/settings.json`. Reinicia Claude Code.

## Créditos

Barra construida sobre [ccstatusline](https://github.com/sirmalloc/ccstatusline).
