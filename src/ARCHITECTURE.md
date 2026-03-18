# DoL-CheatPlus Architecture Guide

## Module Boundaries

```
src/
  main.js          ← single entrypoint; calls startCheatInjection()
  constants/       ← pure static values only (no imports from other src/ dirs)
  core/            ← runtime lifecycle, logger, state, registries, shared abstractions
    sugarcube/     ← SugarCube engine adapter (only place allowed to use SugarCube globals)
  ui/              ← rendering, components, styles, metadata renderer
  features/        ← game-agnostic feature orchestration (tabs, actions, listeners)
  services/        ← integration services and legacy compatibility wrappers
  games/           ← (future) per-engine adapter packages: sugarcube/, renpy-web/, etc.
```

## Dependency Direction Rules

```
constants  ← imported by any layer (no imports from other src/ dirs allowed)
core       ← may import constants only
ui         ← may import constants, core
features   ← may import constants, core, ui
services   ← may import constants, core, ui, features
main.js    ← imports core (injection entry)
```

**Strictly forbidden:**

- `ui/` and `features/` must NOT import game engine globals directly (`SugarCube`, `window.V`, etc.).
- Engine-specific APIs must live under `core/sugarcube/` or `games/sugarcube/`.
- Barrel files (`index.js`) must be export-only — no global writes, no initialization side effects.
- Legacy `window.*` registrations must happen via explicit `registerGlobals()` calls in `core/injection.js`, never at module load time.

## Startup Path

```
main.js
  └─> core/injection.js :: startCheatInjection()
        ├─> ui/index.js :: mountInterface()          (mounts Shadow DOM host)
        ├─> features/actions.js, fetchers, cheat-init, services/storage, features/listeners
        │     └─> .registerGlobals()                 (registers window.* compat globals)
        └─> features/bootstrap.js :: bootstrapCheat() (listeners, storage, game hooks)
```

## Engine Adapter Boundary

All direct `SugarCube.*` access is restricted to:

- `core/sugarcube/` — adapter modules (`debug.js`, and future `adapter.js`, `state.js`, etc.)
- `core/global-bridge.js` — thin bridge that resolves the runtime window (unsafeWindow / window fallback)

## Adding a New Game Engine Adapter

1. Create `src/games/<engine>/adapter.js` implementing the adapter contract (see `core/adapters/types.js` when added in Phase 5).
2. Keep all engine globals and quirks inside that directory.
3. Register the adapter from `main.js` or an engine-specific entrypoint, not from feature modules.

## Constants Usage

| File                     | Contains                                     |
| ------------------------ | -------------------------------------------- |
| `constants/ui.js`        | Shadow host ID, game element IDs, UI IDs     |
| `constants/runtime.js`   | Injection state key, bootstrap flag key      |
| `constants/sugarcube.js` | SugarCube global name, state/setup path keys |

## Metadata-First UI Pattern

The modal section UI is now definition-first and renderer-owned:

- Define section controls as plain arrays in `ui/metadata/<section>/index.js`.
- Use helpers from `ui/metadata/factory.js`:
  - `createRowsFromLegacyDefs()` for compact migration rows
  - `createRowsFromSettingDefs()` for clean setting-style entries
- Render once via `renderRegistry()` in `features/cheat-init.js`.
- Control listeners are attached by the renderer during render (no per-control delegated listeners in feature modules).

### Preferred row definition style

```js
const PLAYER_DEF = [
  {
    key: 'player_hp',
    text: 'Player HP',
    inputs: [
      {
        type: 'input',
        id: 'playerHpInput',
        action: 'playerHpInput',
        binding: { path: 'hp', required: true, onMissing: 'mark-section-broken' },
        defaultValue: 100,
        coerce: 'number',
      },
      { type: 'button', id: 'playerHpSet', text: 'Set', action: 'playerHpSet' },
    ],
    tooltip: 'Current player HP in SugarCube state',
  },
];

const rows = createRowsFromSettingDefs(PLAYER_DEF);
```

### Binding rules

- Never use executable strings like `SugarCube.state.variables.hp` in metadata.
- Use adapter-safe paths only (for example `hp`, `player.hp`).
- `factory.normalizeBindingPath()` accepts and sanitizes legacy prefixes (`SugarCube.State.variables.`) if present.
- Missing required bindings should use `onMissing: 'mark-section-broken'` to keep failures visible.

---

## Runtime Data Flow

```
Game page loads
  └─> main.js :: startCheatInjection()
        ├─> mountInterface()         — creates Shadow DOM host, injects CSS + HTML template
        ├─> initActions()            — registers all action handlers in the dispatcher
        ├─> registerGlobals()        — exposes cheatActions / firstload on window (legacy compat)
        ├─> bootstrapCheat()
        │     ├─> initGameObservers()   — attaches document click + keyup listeners
        │     └─> reactivateToggles()   — restores toggle state from SugarCube save slot
        └─> (on every click)
              └─> cheatActions.runitall()
                    ├─> ToggleScheduler.runFrame()   — runs scheduled toggle mutations
                    ├─> fetchers (hydration)         — reads game vars → writes to UI inputs
                    └─> checkDateDaily()             — triggers daily toggle effects
```

## Toggle System

Toggles are cheats that re-apply on every game tick (click). They live in `features/cheat/toggle-*.js`.

```
toggle-state-repository.js   plain object holding toggle maps:
  toggleActive      { [buttonId]: true }   — per-tick toggles
  toggleActiveDaily { [buttonId]: true }   — once-per-game-day toggles
  toggleDeactivated { [buttonId]: true }   — suspended (watchdog tripped)

toggle-engine.js             created at runtime via createToggleEngine()
  runitall()                 — called every click; delegates to ToggleScheduler
  checkDateDaily()           — compares game timestamp to stored day; fires daily actions

toggle-domain-actions.js     pure mutation functions for individual toggles
  createToggleDomainActions(toggleState) → map of { buttonId: fn }

toggle-runtime.js            composes the above into a single runtime object
  createToggleRuntime()      → { runitall, runitallRestore, runitallDaily, ... }
```

The `ToggleScheduler` (`services/toggle-scheduler.js`) batches toggle frame execution to avoid running during SugarCube transitions.

## Action Dispatcher

Actions are plain string keys resolved to functions at runtime.

```
core/actions/dispatcher.js
  registerActions({ key: fn, ... })   — registers handler map
  dispatch('key')                     — calls handler, runs error hook on failure
  setErrorHook(fn)                    — global error callback (shows toast by default)
```

All feature actions are registered once in `features/listeners/index.js → initActions()`. The UI dispatches via element attribute `data-action="key"`, handled by `metadata-renderer.js`.

## State Layers

| Layer             | File                                        | When to use                                                                        |
| ----------------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| **UI state**      | `core/state/index.js`                       | `modal.open`, transient UI flags — subscribe with `subscribe()`                    |
| **Runtime state** | `core/runtime-state.js`                     | Loader flags, fetch counters, click counter — getters/setters                      |
| **Cheat config**  | `core/sugarcube/cheat-config.js`            | Persisted toggle state proxied through SugarCube save — `getAngel()`, `setAngel()` |
| **Toggle state**  | `features/cheat/toggle-state-repository.js` | In-memory active/daily/deactivated toggle maps                                     |

Never mix layers. Do not read SugarCube variables directly from outside `core/sugarcube/`.

## Key Utilities

| Helper                           | File                          | Purpose                                                          |
| -------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `byUiId(id)`                     | `ui/helpers/dom-query.js`     | Query element inside shadow DOM (falls back to document)         |
| `replaceSelectOptions(el, opts)` | `ui/helpers/dom-query.js`     | Swap `<select>` options while preserving current selection       |
| `getRuntimeWindow()`             | `core/global-bridge.js`       | Returns `unsafeWindow` in userscript context, `window` otherwise |
| `dispatch(key)`                  | `core/actions/dispatcher.js`  | Call a registered action by string key                           |
| `safeCall(fn)`                   | `core/safe-exec.js`           | Run a function and swallow + log all errors                      |
| `showToast(msg)`                 | `ui/components/toast.js`      | Display in-UI notification                                       |
| `getVars()`                      | `core/sugarcube/state.js`     | `SugarCube.State.variables` — returns null if not ready          |
| `getVariable(path)`              | `core/sugarcube/selectors.js` | Read a nested variable by dot-path                               |
| `setVariable(path, v)`           | `core/sugarcube/selectors.js` | Write a nested variable by dot-path                              |

---

# Developing a New Cheat

This section is the step-by-step guide for adding a new cheat feature.

## Cheat Type Reference

| Type                | Trigger                            | Examples                           |
| ------------------- | ---------------------------------- | ---------------------------------- |
| **One-shot**        | Button click                       | Set HP, give money, teleport       |
| **Toggle**          | Re-applied every game tick         | Infinite stamina, NPC arousal lock |
| **Toggle (daily)**  | Re-applied once per game day       | Pregnancy management by day        |
| **Input + Set**     | User types value then clicks Set   | Stat editor, name changer          |
| **Select + Action** | User picks from dropdown then acts | NPC picker + pregnancy set         |

---

## Step 1 — Add the Action Handler

Action handlers live in `features/cheat/`. Choose the correct file by theme:

| File                       | Theme                                                 |
| -------------------------- | ----------------------------------------------------- |
| `player-actions.js`        | Player stats, body, arousal, fame                     |
| `pregnancy-actions.js`     | Pregnancy management (MC, named NPC, stored NPC)      |
| `world-actions.js`         | World state, farm, time, skills                       |
| `debug-actions.js`         | Debug dumps, variable inspection                      |
| `toggle-domain-actions.js` | Toggle-based cheats (use `createToggleDomainActions`) |

### One-shot action example

```js
// features/cheat/player-actions.js — add inside the exported object
export function myNewCheat() {
  const vars = getVars();
  if (!vars) return;
  vars.gold += 500;
  showToast('Added 500 gold');
}
```

### Toggle action example

Toggles are defined inside `createToggleDomainActions()` in `toggle-domain-actions.js`:

```js
// Inside the domainActions object in toggle-domain-actions.js
my_toggle_id() {
  const vars = getVars();
  if (!vars) return;
  vars.stamina = 1000; // re-applied every tick while toggle is ON
},
```

The **button ID** (used as the toggle key) must match the `id` attribute of the toggle's HTML button in your metadata definition. See Step 3.

---

## Step 2 — Register the Action

All actions must be registered in `features/listeners/index.js` inside `initActions()`:

```js
// In the registerActions({ ... }) call:
myNewCheat,          // from player-actions.js (already imported)
my_toggle_id,        // toggle actions come from cheatActions via toggle-runtime.js
```

If your action is on an existing import, just add the key. If it's in a new file, add the import at the top:

```js
import { myNewCheat } from '../cheat/player-actions.js';
```

---

## Step 3 — Add UI Metadata

UI controls are defined in `ui/metadata/<section>/index.js`. Pick the correct section:

| File                         | Tab   | Use for                          |
| ---------------------------- | ----- | -------------------------------- |
| `ui/metadata/quick/index.js` | Quick | Fast-access one-shot actions     |
| `ui/metadata/stat/index.js`  | Stats | Stat editors, input+set patterns |
| `ui/metadata/misc/index.js`  | Misc  | Everything else                  |

### One-shot button

```js
// In the section's createXxxMetadata() return array:
createRowsFromSettingDefs([
  {
    key: 'my_new_cheat',
    text: 'Gold +500',
    inputs: [{ type: 'button', id: 'my-cheat-btn', text: 'Add', action: 'myNewCheat' }],
    tooltip: 'Adds 500 gold to your inventory',
  },
]);
```

### Input + Set

```js
createRowsFromSettingDefs([
  {
    key: 'hp_set',
    text: 'Player HP',
    inputs: [
      {
        type: 'input',
        id: 'player-hp-input',
        action: 'playerHpInputChange',
        binding: { path: 'hp' },
        defaultValue: 100,
        coerce: 'number',
      },
      { type: 'button', id: 'player-hp-set', text: 'Set', action: 'playerHpSet' },
    ],
  },
]);
```

### Toggle (checkbox)

```js
createRowsFromSettingDefs([
  {
    key: 'my_toggle',
    text: 'Infinite Stamina',
    inputs: [{ type: 'toggle', id: 'my_toggle_id', action: 'my_toggle_id' }],
    tooltip: 'Keeps stamina at max every tick',
  },
]);
```

The `id` on the toggle input **must match** the key you defined in `toggle-domain-actions.js`.

### Legacy compact row (avoid for new cheats)

```js
// createRowsFromLegacyDefs() accepts shorthand if migrating old HTML
createRowsFromLegacyDefs([['My Label', 'action_key', 'Button Text']]);
```

---

## Step 4 — Add a Fetcher (optional)

If your cheat has an input that should **reflect the current game value** on every tick, add a hydration function to `features/fetchers/`.

```js
// features/fetchers/core-updates.js (or a new file)
export function update_my_stat() {
  const el = byId('player-hp-input');
  if (!el) return;
  el.value = getVars()?.hp ?? '';
}
```

Then register it in `features/fetchers/index.js` so it runs during `firstload` / `alt_fetch`:

```js
export function firstload() {
  // ...existing calls...
  update_my_stat();
}
```

---

## Step 5 — Verify

```bash
npm run lint       # must be 0 problems
node build/build.cjs   # must say "Build complete"
```

Open the game and click your button. If the action fails silently, check:

1. Is the `action` string in metadata exactly matching the registered key?
2. Is the function exported from its module and imported in `initActions()`?
3. Does `getVars()` return non-null when you click? (Only valid in-passage, after `SugarCube` is ready)

The build script also prints `[action-id-lint]` warnings for metadata `action` values with no registered handler — these are useful as a second check.

---

## Anti-Patterns to Avoid

| ❌ Don't                                               | ✅ Do instead                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `SugarCube.State.variables.X = ...` in feature modules | `setVariable('X', ...)` via adapter                                  |
| `window.V.X = ...` directly                            | `getVars().X = ...` via `getVars()`                                  |
| `document.getElementById(...)` in UI code              | `byUiId(id)` for shadow DOM safety                                   |
| Calling `SugarCube` at module load time                | Always wrap in a function called after `SugarCube.State` is non-null |
| Adding logic to `main.js`                              | Add to the correct feature/service module and register it            |
| Hard-coding `86400`                                    | Import `SECONDS_PER_DAY` from `constants/runtime.js`                 |
