<h1 align="center">🦉 Statusline Config</h1>

<p align="center">
  <strong>Mi barra de estado para Claude Code — cópiala y tenla igual en tu terminal</strong>
</p>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-tecnologías">Tecnologías</a> •
  <a href="#-contribuir">Contribuir</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code"/>
  <img src="https://img.shields.io/badge/ccstatusline-2.2+-000000?style=for-the-badge&logo=node.js&logoColor=white" alt="ccstatusline"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>
</p>

---

## 🦉 ¿Qué es esto?

**Statusline Config** es una configuración lista para copiar de la **barra de estado**
(*statusline*) de [**Claude Code**](https://claude.com/claude-code), construida sobre
[**ccstatusline**](https://github.com/sirmalloc/ccstatusline).

¿Quieres la misma barra bonita que se ve en mi terminal, sin pelearte con archivos de
configuración? Clona el repo, corre **un comando** y listo:

- 📋 **Copia** = Un solo `install.sh` deja todo configurado
- 🎨 **Idéntica** = Mismos íconos, colores y tema oscuro estilo GitHub
- 🔄 **Reversible** = Respalda tu config previa antes de tocar nada

¡Así de fácil!

---

## ✨ Características

### 📊 Todo lo que importa, de un vistazo
La barra muestra en una sola línea:

```
📁 ~/mi-proyecto  🦉 Opus 4.8  🧠 42%  💪 high  📊 18.0%  ⏰ 07-23 7:20 PM  📅 26.0%  🔔 07-27 11:00 PM  🌿 main  ⏳ 1h23m
```

> Las fechas de reestablecimiento se muestran en tu **hora local** (zona horaria del sistema), no en UTC.

| Ícono | Muestra | Color |
|:-----:|---------|-------|
| 📁 | Directorio de trabajo actual (con `~` para tu home) | 🔵 `#79c0ff` |
| 🦉 | Modelo activo | 🟢 `#79d9a0` |
| 🧠 | Porcentaje de contexto usado | 🟩 `#7ee787` |
| 💪 | Nivel de esfuerzo de razonamiento (*thinking effort*) | 🟡 `#e3b341` |
| 📊 | % de uso de la sesión actual (igual que `/usage`) | 🟠 `#f78166` |
| ⏰ | Fecha/hora de reestablecimiento del límite de sesión | 🟧 `#ffa657` |
| 📅 | % de uso semanal (igual que `/usage`) | 🩵 `#56d4dd` |
| 🔔 | Fecha/hora de reestablecimiento del límite semanal | 🌸 `#db61a2` |
| 🌿 | Rama de git actual (solo dentro de un repo) | 🟣 `#d2a8ff` |
| ⏳ | Temporizador del bloque de trabajo | ⚪ `#8b949e` |

### 🎨 Tema oscuro cuidado
- Paleta de colores estilo GitHub Dark
- Íconos con emojis para lectura rápida
- Separadores limpios entre cada elemento

### ⚡ Instalador de un comando
- Copia la configuración al lugar correcto automáticamente
- Engancha la statusline en Claude Code por ti
- Respalda tu configuración anterior por si acaso

### 🔧 Cero dependencias raras
- Solo necesitas Node.js (que ya tienes si usas Claude Code)
- Sin compilar, sin instalar mil paquetes
- `npx` descarga ccstatusline la primera vez

---

## 📦 Requisitos

- **Node.js 18+** (incluye `npm` y `npx`) → https://nodejs.org
- **[Claude Code](https://claude.com/claude-code)** instalado

---

## 🚀 Instalación

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

Después **reinicia Claude Code** y la barra aparecerá. ✨

<details>
<summary>🛠️ ¿Prefieres instalar a mano?</summary>

<br>

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

## 🎛️ Uso

Una vez instalada, la barra aparece sola debajo de tu terminal de Claude Code.

### ✅ Elegir qué métricas mostrar

Este repo trae un selector interactivo propio para activar/desactivar en vivo cada
ícono de la barra (directorio, modelo, contexto, esfuerzo, uso de sesión/semanal,
reestablecimientos, git, temporizador):

```bash
./ccstatusline-metrics.js
```

Controles:

| Tecla | Acción |
|:-----:|--------|
| `↑` / `↓` | Mover el cursor |
| `espacio` | Marcar/desmarcar la métrica |
| `a` | Seleccionar todas |
| `n` | Deseleccionar todas |
| `enter` | Guardar e instalar |
| `q` / `esc` | Cancelar sin cambios |

Al guardar, regenera `ccstatusline-settings.json` con solo las métricas marcadas y lo
instala directamente en `~/.config/ccstatusline/settings.json` (respaldando tu config
previa, igual que `install.sh`). Solo reinicia Claude Code para verlo.

> Este selector requiere una terminal real (TTY). Si lo corres desde dentro del chat
> de Claude Code (por ejemplo con `!./ccstatusline-metrics.js`), fallará porque ese
> entorno no provee una terminal interactiva — ábrelo en tu terminal del sistema.

#### 🤖 Desde el propio chat de Claude Code

El skill **`/ccstatusline-metrics`** está instalado a nivel de usuario
(`~/.claude/skills/`), así que funciona desde cualquier proyecto, no solo desde
este repo. Te pregunta qué métricas quieres activas con una selección múltiple
nativa del chat (sin necesitar TTY) y aplica el cambio por ti, llamando
internamente a:

```bash
node /home/efren/projects/ccstatusline-config/ccstatusline-metrics.js --list                 # ver métricas y su estado
node /home/efren/projects/ccstatusline-config/ccstatusline-metrics.js --set dir,model,git    # dejar activas solo esas
node /home/efren/projects/ccstatusline-config/ccstatusline-metrics.js --all                  # activar todas
node /home/efren/projects/ccstatusline-config/ccstatusline-metrics.js --none                 # desactivar todas
```

### 🎨 Personalización avanzada

Para cambiar colores, orden, separadores o modo powerline, ccstatusline trae su propio
editor interactivo:

```bash
npx ccstatusline@latest
```

Todo se guarda en `~/.config/ccstatusline/settings.json` (el mismo archivo de este
repo). Si haces cambios que te gusten, cópialos de vuelta a `ccstatusline-settings.json`
y súbelos. 🚀

### 🗑️ Desinstalar
Quita el bloque `"statusLine"` de `~/.claude/settings.json` y, si quieres, borra
`~/.config/ccstatusline/settings.json`. Reinicia Claude Code.

---

## 🧰 Tecnologías

<p align="center">
  <img src="https://img.shields.io/badge/ccstatusline-000000?style=for-the-badge&logo=node.js&logoColor=white" alt="ccstatusline"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white" alt="Bash"/>
  <img src="https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code"/>
</p>

- **[ccstatusline](https://github.com/sirmalloc/ccstatusline)** — motor de la barra de estado
- **Node.js / npx** — ejecución del binario
- **Bash** — script de instalación

---

## 🤝 Contribuir

¿Se te ocurre una mejora o una variante de la barra? ¡Bienvenida!

1. Haz un fork del repo
2. Crea tu rama (`git checkout -b mi-mejora`)
3. Haz commit de tus cambios
4. Abre un Pull Request

---

## 🙏 Créditos

Barra construida sobre [**ccstatusline**](https://github.com/sirmalloc/ccstatusline)
de [@sirmalloc](https://github.com/sirmalloc).

<p align="center">
  <sub>Hecho con 🦉 por <a href="https://github.com/Avzolem">@Avzolem</a></sub>
</p>
