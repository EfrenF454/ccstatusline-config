<h1 align="center">🦉 Statusline Config</h1>

<p align="center">
  <strong>Mi barra de estado para Claude Code — cópiala y tenla igual en tu terminal</strong>
</p>

<p align="center">
  <a href="#-vista-previa">Vista previa</a> •
  <a href="#-requisitos">Requisitos</a> •
  <a href="#-instalación-rápida">Instalación</a> •
  <a href="#-personalizar">Personalizar</a> •
  <a href="#-desinstalar">Desinstalar</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code"/>
  <img src="https://img.shields.io/badge/ccstatusline-2.2+-000000?style=for-the-badge&logo=node.js&logoColor=white" alt="ccstatusline"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>
</p>

---

## 🎨 ¿Qué es esto?

Una configuración lista para copiar de la **barra de estado (statusline)** de
[**Claude Code**](https://claude.com/claude-code), construida sobre
[**ccstatusline**](https://github.com/sirmalloc/ccstatusline).

Clona el repo, corre un comando y tendrás **exactamente la misma barra que yo**:
mismos íconos, mismos colores, tema oscuro estilo GitHub. Sin configurar nada a mano.

---

## 👀 Vista previa

```
📁 ~/mi-proyecto  🦉 Opus 4.8  🧠 42%  💪 high  🌿 main  ⏳ 1h23m
```

| Ícono | Muestra | Color |
|:-----:|---------|-------|
| 📁 | Directorio de trabajo actual (con `~` para tu home) | 🔵 `#79c0ff` |
| 🦉 | Modelo activo | 🟢 `#79d9a0` |
| 🧠 | Porcentaje de contexto usado | 🟩 `#7ee787` |
| 💪 | Nivel de esfuerzo de razonamiento (*thinking effort*) | 🟡 `#e3b341` |
| 🌿 | Rama de git actual (solo dentro de un repo) | 🟣 `#d2a8ff` |
| ⏳ | Temporizador del bloque de trabajo | ⚪ `#8b949e` |

---

## 📦 Requisitos

- **Node.js 18+** (incluye `npm` y `npx`) → https://nodejs.org
- **[Claude Code](https://claude.com/claude-code)** instalado

---

## ⚡ Instalación rápida

```bash
git clone https://github.com/Avzolem/ccstatusline-config.git
cd ccstatusline-config
chmod +x install.sh
./install.sh
```

El instalador:

1. 📋 Copia `ccstatusline-settings.json` a `~/.config/ccstatusline/settings.json`
   *(respaldando cualquier config previa que ya tengas).*
2. 🔗 Engancha la statusline en tu `~/.claude/settings.json`.

Después **reinicia Claude Code** y la barra aparecerá. La primera vez, `npx`
descargará `ccstatusline` automáticamente. ✨

---

## 🛠️ Instalación manual

<details>
<summary>Si prefieres hacerlo paso a paso</summary>

**1. Instala ccstatusline** *(opcional — `npx` también funciona sin instalar):*

```bash
npm install -g ccstatusline@latest
```

**2. Copia la configuración:**

```bash
mkdir -p ~/.config/ccstatusline
cp ccstatusline-settings.json ~/.config/ccstatusline/settings.json
```

**3. Engancha la statusline** en `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y ccstatusline@latest"
  }
}
```

> 💡 Si instalaste ccstatusline global y quieres arranque instantáneo (sin el
> pequeño retraso de `npx`), usa la ruta del binario, p. ej.:
> `"command": "~/.npm-global/bin/ccstatusline"` (ajústala según `which ccstatusline`).

**4. Reinicia Claude Code.**

</details>

---

## 🎛️ Personalizar

`ccstatusline` trae un **editor interactivo** en la terminal para cambiar íconos,
colores, orden, separadores, modo powerline y más:

```bash
npx ccstatusline@latest
```

Todo se guarda en `~/.config/ccstatusline/settings.json` (el mismo archivo de este
repo). Si haces cambios que te gusten, cópialos de vuelta a
`ccstatusline-settings.json` y súbelos. 🚀

---

## 🗑️ Desinstalar

Quita el bloque `"statusLine"` de `~/.claude/settings.json` y, si quieres, borra
`~/.config/ccstatusline/settings.json`. Reinicia Claude Code.

---

## 🙏 Créditos

Barra construida sobre [**ccstatusline**](https://github.com/sirmalloc/ccstatusline)
de [@sirmalloc](https://github.com/sirmalloc).

<p align="center">
  <sub>Hecho con 🦉 por <a href="https://github.com/Avzolem">@Avzolem</a></sub>
</p>
