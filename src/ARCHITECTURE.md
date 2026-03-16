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
