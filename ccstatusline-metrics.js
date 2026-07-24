#!/usr/bin/env node
//
// Selector de métricas para la statusline (ccstatusline).
// Permite marcar/desmarcar qué íconos aparecen en la barra, regenera
// ccstatusline-settings.json y lo instala en
// ~/.config/ccstatusline/settings.json (con respaldo de la config previa).
//
// Uso interactivo (requiere una terminal real / TTY):
//   ./ccstatusline-metrics.js
//   node ccstatusline-metrics.js
//
// Uso no interactivo (para scripts, CI, o el skill /ccstatusline-metrics):
//   node ccstatusline-metrics.js --list            Lista las métricas disponibles
//                                                   (key<TAB>icon<TAB>label<TAB>enabled)
//   node ccstatusline-metrics.js --set dir,model    Deja activas solo esas métricas
//   node ccstatusline-metrics.js --all              Activa todas
//   node ccstatusline-metrics.js --none             Desactiva todas
//
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const REPO_DIR = __dirname;
const SETTINGS_PATH = path.join(REPO_DIR, 'ccstatusline-settings.json');
const CCS_DIR = path.join(os.homedir(), '.config', 'ccstatusline');
const CCS_DEST = path.join(CCS_DIR, 'settings.json');

const DEFAULT_BASE_SETTINGS = {
  version: 3,
  flexMode: 'full-minus-40',
  compactThreshold: 60,
  colorLevel: 3,
  defaultSeparator: '|',
  defaultPadding: '',
  inheritSeparatorColors: false,
  globalBold: false,
  gitCacheTtlSeconds: 5,
  minimalistMode: false,
  powerline: {
    enabled: false,
    separators: [''],
    separatorInvertBackground: [false],
    startCaps: ['', '', ''],
    endCaps: [],
    autoAlign: false,
    continueThemeAcrossLines: false,
    theme: 'custom'
  }
};

// Catálogo canónico de métricas disponibles, en el orden en que aparecen
// en la barra. Es la única fuente de verdad: si el usuario desactiva una
// métrica y luego la vuelve a activar, se reconstruye desde aquí.
const GIT_SED = 's/.*"cwd":"\\([^"]*\\)".*/\\1/p';
const GIT_COMMAND =
  `d=$(sed -n '${GIT_SED}'); [ -n "$d" ] && cd "$d" 2>/dev/null; ` +
  'b=$(git symbolic-ref --short HEAD 2>/dev/null); [ -n "$b" ] && printf "🌿 %s" "$b" || true';

const METRICS = [
  {
    key: 'dir', label: 'Directorio de trabajo', icon: '📁', color: '79c0ff',
    items: [
      { id: 'dir-icon', type: 'custom-text', customText: '📁 ', merge: 'no-padding', color: 'hex:79c0ff' },
      { id: 'dir', type: 'current-working-dir', rawValue: true, color: 'hex:79c0ff', metadata: { abbreviateHome: 'true' } }
    ]
  },
  {
    key: 'model', label: 'Modelo activo', icon: '🦉', color: '79d9a0',
    items: [
      { id: 'm-icon', type: 'custom-text', customText: '🦉 ', merge: 'no-padding', color: 'hex:79d9a0' },
      { id: 'model', type: 'model', rawValue: true, color: 'hex:79d9a0' }
    ]
  },
  {
    key: 'ctx', label: 'Contexto usado (%)', icon: '🧠', color: '7ee787',
    items: [
      { id: 'ctx-icon', type: 'custom-text', customText: '🧠 ', merge: 'no-padding', color: 'hex:7ee787' },
      { id: 'ctx', type: 'context-percentage', rawValue: true, color: 'hex:7ee787' }
    ]
  },
  {
    key: 'eff', label: 'Esfuerzo de razonamiento', icon: '💪', color: 'e3b341',
    items: [
      { id: 'eff-icon', type: 'custom-text', customText: '💪 ', merge: 'no-padding', color: 'hex:e3b341' },
      { id: 'eff', type: 'thinking-effort', rawValue: true, color: 'hex:e3b341' }
    ]
  },
  {
    key: 'usage', label: 'Uso de la sesión actual (%) — como /usage', icon: '📊', color: 'f78166',
    items: [
      { id: 'usage-icon', type: 'custom-text', customText: '📊 ', merge: 'no-padding', color: 'hex:f78166' },
      { id: 'usage', type: 'session-usage', rawValue: true, color: 'hex:f78166' }
    ]
  },
  {
    key: 'session-reset', label: 'Reestablecimiento de sesión (fecha/hora local)', icon: '⏰', color: 'ffa657',
    items: [
      { id: 'session-reset-icon', type: 'custom-text', customText: '⏰ ', merge: 'no-padding', color: 'hex:ffa657' },
      {
        id: 'session-reset', type: 'reset-timer', rawValue: true, color: 'hex:ffa657',
        metadata: { absolute: 'true', compact: 'true', timezone: 'local', hour12: 'true' }
      }
    ]
  },
  {
    key: 'week', label: 'Uso semanal (%) — como /usage', icon: '📅', color: '56d4dd',
    items: [
      { id: 'week-icon', type: 'custom-text', customText: '📅 ', merge: 'no-padding', color: 'hex:56d4dd' },
      { id: 'week', type: 'weekly-usage', rawValue: true, color: 'hex:56d4dd' }
    ]
  },
  {
    key: 'reset', label: 'Reestablecimiento semanal (fecha/hora local)', icon: '🔔', color: 'db61a2',
    items: [
      { id: 'reset-icon', type: 'custom-text', customText: '🔔 ', merge: 'no-padding', color: 'hex:db61a2' },
      {
        id: 'reset', type: 'weekly-reset-timer', rawValue: true, color: 'hex:db61a2',
        metadata: { absolute: 'true', compact: 'true', timezone: 'local', hour12: 'true' }
      }
    ]
  },
  {
    key: 'git', label: 'Rama de git actual', icon: '🌿', color: 'd2a8ff',
    items: [
      { id: 'git', type: 'custom-command', commandPath: GIT_COMMAND, timeout: 1000, color: 'hex:d2a8ff' }
    ]
  },
  {
    key: 'timer', label: 'Temporizador del bloque de sesión (cuenta regresiva)', icon: '⏳', color: '8b949e',
    items: [
      { id: 'timer-icon', type: 'custom-text', customText: '⏳ ', merge: 'no-padding', color: 'hex:8b949e' },
      { id: 'timer', type: 'block-timer', rawValue: true, color: 'hex:8b949e' }
    ]
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadCurrentSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function collectEnabledIds(settings) {
  const ids = new Set();
  const line0 = settings?.lines?.[0];
  if (Array.isArray(line0)) {
    for (const item of line0) {
      if (item && typeof item.id === 'string') ids.add(item.id);
    }
  }
  return ids;
}

function hexToAnsi(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

function render(state) {
  console.clear();
  console.log(BOLD + '🦉 ccstatusline — selector de métricas' + RESET);
  console.log(
    DIM +
      '↑/↓ mover · espacio alternar · a = todas · n = ninguna · enter = guardar · q = cancelar' +
      RESET
  );
  console.log('');
  METRICS.forEach((m, i) => {
    const selected = state.selected.has(m.key);
    const box = selected ? '[x]' : '[ ]';
    const pointer = i === state.cursor ? '➤ ' : '  ';
    const color = hexToAnsi(m.color);
    const label = `${color}${m.icon}  ${m.label}${RESET}`;
    const line = `${pointer}${box} ${label}`;
    console.log(i === state.cursor ? BOLD + line + RESET : line);
  });
  console.log('');
  console.log(DIM + `${state.selected.size}/${METRICS.length} métricas seleccionadas` + RESET);
}

function buildSettings(baseSettings, selected) {
  const base = baseSettings ? clone(baseSettings) : clone(DEFAULT_BASE_SETTINGS);
  const line0 = [];
  for (const metric of METRICS) {
    if (selected.has(metric.key)) {
      line0.push(...metric.items.map(clone));
    }
  }
  base.lines = [line0, [], []];
  return base;
}

function installToClaudeConfig() {
  fs.mkdirSync(CCS_DIR, { recursive: true });
  if (fs.existsSync(CCS_DEST)) {
    fs.copyFileSync(CCS_DEST, `${CCS_DEST}.bak.${Date.now()}`);
  }
  fs.copyFileSync(SETTINGS_PATH, CCS_DEST);
}

function cleanupTerminal() {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
}

// Construye, guarda e instala la config para un conjunto de keys ya
// validado. Usado tanto por el modo interactivo como por --set/--all/--none.
function applyAndInstall(current, selectedKeys) {
  const settings = buildSettings(current, selectedKeys);
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n');
  installToClaudeConfig();
}

function printSummary(selectedKeys) {
  console.log('Métricas activas:');
  for (const m of METRICS) {
    if (selectedKeys.has(m.key)) {
      console.log(`  ${m.icon}  ${m.label}`);
    }
  }
  console.log('');
  console.log(`Guardado en ${SETTINGS_PATH}`);
  console.log(`Instalado en ${CCS_DEST}`);
  console.log('');
  console.log('Reinicia (o abre una nueva terminal en) Claude Code para verlo.');
}

// --- Modo no interactivo (flags) ---------------------------------------

function printList(enabledIds) {
  for (const m of METRICS) {
    const enabled = m.items.every((it) => enabledIds.has(it.id));
    console.log(`${m.key}\t${m.icon}\t${m.label}\t${enabled}`);
  }
}

function runNonInteractive(args) {
  const current = loadCurrentSettings();
  const enabledIds = collectEnabledIds(current);

  if (args.includes('--list')) {
    printList(enabledIds);
    return;
  }

  let selectedKeys = null;

  if (args.includes('--all')) {
    selectedKeys = new Set(METRICS.map((m) => m.key));
  } else if (args.includes('--none')) {
    selectedKeys = new Set();
  } else {
    const setIndex = args.indexOf('--set');
    if (setIndex !== -1) {
      const value = args[setIndex + 1] ?? '';
      const requested = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const validKeys = new Set(METRICS.map((m) => m.key));
      const unknown = requested.filter((k) => !validKeys.has(k));
      if (unknown.length > 0) {
        console.error(`Métrica(s) desconocida(s): ${unknown.join(', ')}`);
        console.error(`Válidas: ${METRICS.map((m) => m.key).join(', ')}`);
        process.exitCode = 1;
        return;
      }
      selectedKeys = new Set(requested);
    }
  }

  if (!selectedKeys) {
    console.error('Uso: ccstatusline-metrics.js --list | --all | --none | --set <k1,k2,...>');
    console.error(`Válidas: ${METRICS.map((m) => m.key).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  applyAndInstall(current, selectedKeys);
  printSummary(selectedKeys);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return runNonInteractive(args);
  }

  if (!process.stdin.isTTY) {
    console.error('Este comando necesita una terminal interactiva (TTY).');
    console.error('Para uso no interactivo: ccstatusline-metrics.js --list | --all | --none | --set <k1,k2,...>');
    process.exit(1);
  }

  const current = loadCurrentSettings();
  const enabledIds = collectEnabledIds(current);
  const hasAnyKnownId = METRICS.some((m) => m.items.some((it) => enabledIds.has(it.id)));

  const state = {
    cursor: 0,
    selected: new Set(
      METRICS.filter((m) =>
        hasAnyKnownId ? m.items.every((it) => enabledIds.has(it.id)) : true
      ).map((m) => m.key)
    )
  };

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  render(state);

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') return finish(null);

    switch (key.name) {
      case 'up':
      case 'k':
        state.cursor = (state.cursor - 1 + METRICS.length) % METRICS.length;
        break;
      case 'down':
      case 'j':
        state.cursor = (state.cursor + 1) % METRICS.length;
        break;
      case 'space': {
        const k = METRICS[state.cursor].key;
        if (state.selected.has(k)) state.selected.delete(k);
        else state.selected.add(k);
        break;
      }
      case 'a':
        METRICS.forEach((m) => state.selected.add(m.key));
        break;
      case 'n':
        state.selected.clear();
        break;
      case 'return':
        return finish(state);
      case 'q':
      case 'escape':
        return finish(null);
      default:
        break;
    }
    render(state);
  });

  function finish(finalState) {
    cleanupTerminal();
    console.clear();
    if (!finalState) {
      console.log('Cancelado. No se hicieron cambios.');
      process.exit(0);
    }

    applyAndInstall(current, finalState.selected);

    console.log(BOLD + '✅ Statusline actualizada' + RESET);
    console.log('');
    printSummary(finalState.selected);
    process.exit(0);
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    METRICS,
    buildSettings,
    collectEnabledIds,
    loadCurrentSettings,
    applyAndInstall
  };
}
