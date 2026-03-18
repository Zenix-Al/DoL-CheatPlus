# State Architecture (P6 Target)

This document defines ownership boundaries for CheatPlus state modules.

## Goals

- Keep one canonical in-memory runtime store for cheat execution flow.
- Keep persisted game/save data behind SugarCube-specific adapters only.
- Keep compatibility wrappers narrow so migrations can be done incrementally.

## Module Responsibilities

### `src/core/state/index.js`

Canonical app/runtime in-memory state store.

- Owns the internal store object and initial state shape.
- Exposes generic APIs:
  - `get(path)`
  - `set(path, value)`
  - `subscribe(path, cb)`
  - `snapshot()`
  - `resetState()`
- Holds framework/runtime slices that are not persisted to save data:
  - `modal.*`
  - `runtime.*`

Rules:

- New transient runtime flags should be added here first.
- Feature modules should prefer this store (directly or through typed wrappers) for non-persistent runtime values.

### `src/core/runtime-state.js`

Compatibility adapter over `core/state` for legacy getter/setter API.

- No private state object.
- Reads/writes only through `get('runtime.*')` and `set('runtime.*')`.
- Keeps old callsites stable while migration continues.

Rules:

- Do not add new independent state fields here.
- If a new helper is needed, map it to `runtime.*` in `core/state/index.js`.
- Remove adapter functions only when all callsites are migrated or confirmed unused.

### `src/core/sugarcube/cheat-config.js`

Persistent save-backed CheatPlus config facade.

- Sole owner of `State.variables.cheatPlus` access.
- Manages persisted toggles/config/counters that belong to save data.
- Includes initialization and named accessors/mutators for save schema.

Rules:

- Never use this module for transient UI/runtime execution flags.
- No direct `vars.cheatPlus` reads/writes outside this module.

## Boundary Summary

- Transient runtime state:
  - store in `core/state/index.js` (`runtime.*`, `modal.*`).
- Legacy compatibility API:
  - expose via `core/runtime-state.js`, backed by canonical store.
- Save-persisted cheat data:
  - store in `core/sugarcube/cheat-config.js` only.

## Practical Decision Guide

- Question: "Should this survive save/load?"
  - Yes -> `core/sugarcube/cheat-config.js`
  - No -> `core/state/index.js`
- Question: "Is this only to keep old callers working?"
  - Yes -> `core/runtime-state.js` adapter function
  - No -> prefer direct canonical-store usage (or typed wrapper in core)
