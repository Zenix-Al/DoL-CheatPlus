# DoL-CheatPlus Framework Migration Plan

Goal: turn the current cheat mod into a reusable framework for multiple HTML game engines, with SugarCube-specific logic isolated under engine adapters.

## Phase 0 - MVP Stabilization (Completed)

- [x] Shadow DOM host and modal render baseline
- [x] Basic listener routing for modal controls
- [x] Centralized debug logger + startup traces
- [x] Build pipeline still produces userscript bundles

Definition of done:

- Modal opens and renders in Shadow DOM
- Core buttons work in current build
- Build succeeds end-to-end

## Phase 1 - Foundation and Module Hygiene (Completed)

### 1.1 Package boundaries and ownership

- [x] Define package boundaries and dependency direction in docs:
  - `core/`: runtime lifecycle, state, registries, shared abstractions
  - `ui/`: rendering, components, styles, metadata renderer
  - `features/`: game-agnostic feature orchestration
  - `games/`: engine adapters (`sugarcube/`, future `renpy-web/`, etc.)
  - `services/`: integration services and legacy compatibility wrappers
  - `constants/`: IDs, keys, static labels, config constants
- [x] Add explicit rule: `ui/` and `features/` cannot import game engine globals directly.
- [x] Add explicit rule: engine-specific APIs must live under `core/sugarcube` or `games/sugarcube`.

### 1.2 Side-effect-free module barrels

- [x] Create barrel entry files (`index.js`) for `core`, `features`, `services`, `constants`.
- [x] Ensure barrel files are export-only (no global writes, no initialization side effects).
- [x] Move auto-run behavior to one startup path (`main.js` -> injection bootstrap only).

### 1.3 Constants extraction by domain

- [x] Extract runtime keys to `constants/runtime.js`.
- [x] Extract UI IDs/classes to `constants/ui.js`.
- [x] Extract engine keys to `constants/sugarcube.js`.
- [x] Replace string literals in core/ui bootstrap with imported constants.

### 1.4 Import/export standardization

- [x] Use named exports for utilities and registries.
- [x] Restrict default export usage to module factories where justified.
- [x] Avoid cyclic imports by introducing interfaces/registries where needed.

### 1.5 Validation for phase completion

- [x] Build succeeds with no regression.
- [x] Startup has one clear entrypoint.
- [x] No accidental mount/init triggered by import side effects.

## Phase 2 - Core State and Schema Contracts (Completed)

### 2.1 Central app state

- [x] Introduce state manager in `core/state/`:
  - `get(path)`
  - `set(path, value)`
  - `subscribe(path, cb)`
  - serializable snapshots for debug
- [x] Move mutable globals (`modalOpen`, counters, flags) into state store.
  - `modal.open`, `modal.isDelete`, `modal.isCheatPressed` migrated from `window.*`
  - `fetcher.isFetching` write-path fixed: dom-refs proxy kept as source of truth; state store ready for future full migration

### 2.2 Metadata schema contract

- [x] Define metadata contract in `ui/metadata/schema.js`:
  - control types: `button`, `toggle`, `select`, `range`, `text`, `tooltip`, `group`
  - properties: `id`, `label`, `tooltip`, `action`, `bindings`, `visibility`, `engineScope`
- [x] Add dev-time schema validation and diagnostics (`validateControl`, `validateRegistry`).

### 2.3 Registries

- [x] Create metadata registries per area:
  - `ui/metadata/quick/` — stub (`quickMetadata = []`)
  - `ui/metadata/stat/` — stub (`statMetadata = []`)
  - `ui/metadata/misc/` — stub (`miscMetadata = []`)
- [x] Ensure each registry is pure data, no direct DOM or runtime side effects.

Definition of done:

- Controls can be described by metadata only
- Invalid metadata fails fast with clear logs

## Phase 3 - Renderer and Styling Framework (Completed)

### 3.1 Metadata render pipeline

- [x] Implement metadata renderer in `ui/renderers/metadata-renderer.js`.
- [x] Build reusable primitive renderers:
  - `renderButton`
  - `renderToggle`
  - `renderSelect`
  - `renderRange`
  - `renderText`
  - `renderTooltip`
  - `renderGroup`
  - `renderControl` (dispatcher)
  - `renderRow` (standalone control wrapper)
  - `renderRegistry` (iterates a registry array with visibility gating)

### 3.2 Style registry and shadow-safe design

- [x] Add style registry (`core/styleRegistry.js`) supporting `shadow`, `document`, and `both` targets.
- [x] Introduce shadow-safe theme tokens (`ui/theme/tokens.css`) — `--cp-*` custom properties on `:host`.
- [x] Replace all hardcoded color values in `main.css` with `var(--cp-*)` token references.
- [x] Remove dependency on host page classes/colors — replaced `var(--500)` (DoL host var) with `var(--cp-text-muted, #c8c3bc)`.
- [x] Wire `ui/index.js` through the style registry (`registerSheet` at module load, `applyToShadow` at mount).
- [x] Export `styleRegistry` namespace from `core/index.js` barrel.

Definition of done:

- UI rendering and tooltip behavior are fully self-contained in shadow styles.

## Phase 4 - Action Runtime and Command Dispatch (Completed)

### 4.1 Command dispatcher

- [x] Build action command bus (`core/actions/dispatcher.js`).
  - `register(key, handler)` — overwrites on re-register; warns on bad input
  - `dispatch(key, context?)` — calls handler, catches all exceptions, fires error hook
  - `isRegistered(key)`, `getKeys()`, `unregister(key)` — inspection / teardown
  - `setErrorHook(fn)` / `clearErrorHook()` — injected from bootstrap, never imported by dispatcher itself
- [x] Map metadata `action` keys to registered command handlers.
  - Dispatcher registry key = metadata `action` field = DOM element ID (same namespace)
  - `data-action` on metadata-rendered controls routes through dispatcher as fast path
- [x] Add uniform error handling and toast/report hooks.
  - `setErrorHook((key, err) => showToast(...))` wired in `listeners/index.js`
  - Dispatcher never re-throws; all exceptions are caught and logged

### 4.2 Feature action modules

- [x] Split action handlers by domain (`player`, `pregnancy`, `world`, `debug`, `toggle-runtime`) — already in `features/cheat/` from prior work.
- [x] Register handlers without direct DOM traversal in each command.
  - `features/cheat/register.js` — `registerAllActions({buttonActions, mainActions, changeActions, inputActions})` bulk-registers all maps into the dispatcher
  - Dispatcher is registered at module load time (before listeners attach); safe for re-injection
  - Legacy ID-map fallback preserved in listeners for backward compatibility during Phase 7 migration

Definition of done:

- Button metadata triggers command dispatcher, not ad-hoc listener maps.

## Phase 5 - Engine Adapter Abstraction (Completed)

### 5.1 Adapter interface

- [x] Define adapter contract in `core/adapters/types.js`:
  - state access
  - setup access
  - time/passage access
  - event hooks

### 5.2 SugarCube adapter extraction

- [x] Create `core/sugarcube/` modules:
  - `adapter.js` — implements EngineAdapter; re-exports all sub-module functions
  - `state.js` — `getSugarCube()`, `getVars()`, `getSetup()`, `getPassage()`, `isReady()`
  - `selectors.js` — named typed accessors: `getVariable`, `setVariable`, `getSetupKey`, `getNPCNameList`, `getPlayer`, `getMoney`, `getCrime`, `getSexStats`, `getCheatPlus`, `ensureCheatPlus`, `getFarm`, `getChildren`, `getContainer`
  - `quirks.js` — passage guards: `isAtPassage`, `isAtStart`, `isAtSettings`
- [x] Move all SugarCube-only behavior from generic features/services to adapter modules:
  - `features/listeners/index.js` — 4 bare `SugarCube.State.variables.passage` refs replaced with `isAtStart()` / `isAtSettings()` from quirks
  - `services/storage.js` — all `SugarCube.State.variables` refs replaced with `getVars()` from state
- [x] Export `sugarcube` namespace from `core/index.js` barrel.
- [x] Build passes at v4.10.53.

Definition of done:

- No direct `SugarCube` usage outside adapter and thin bridge boundaries (service/listener layer clean; features/cheat + features/fetchers deferred to Phase 7 as game-specific DoL logic).

## Phase 6 - Event System and Robustness

## Phase 6 - Event System and Robustness (Completed)

### 6.1 Delegated listener framework

- [x] Consolidate click/change/input/keyup routing in one event registry.
  - `core/events/registry.js` — `on()`, `off()`, `reset()`, `getCount()` with globalThis store; teardown-safe
  - `features/listeners/index.js` — all 5 `addEventListener` calls replaced with `on()`; `reset()` called at top of `initListeners()` for idempotent re-injection
- [x] Normalize event target resolution (`closest('[data-action]')` or mapped IDs).
  - Fast-path `data-action` check preserved; legacy ID-map fallback preserved for Phase 7 migration
- [x] Ensure listeners survive re-render and are teardown-safe.
  - `reset()` removes all tracked listeners before re-attaching; registry store lives on globalThis across re-inject

### 6.2 Debug and diagnostics

- [x] Add debug toggle setting and persist to storage.
  - `core/logger.js` — `isDebugEnabled()` reads `localStorage('CheatPlus:debug')` as fallback; `setDebugEnabled()` writes/removes the key
- [x] Add action/event tracing with feature tags and correlation IDs.
  - `core/events/tracing.js` — `traceEvent(type, key)` logs `[type] → "key" (#n)` under `'events'` feature tag via debugLog; sequence counter on globalThis survives re-inject
  - All fast-path dispatcher calls and legacy map calls in `listeners/index.js` now call `traceEvent` before dispatch
- [x] Export `events` namespace from `core/index.js` barrel.
- [x] Build passes at v4.10.55.

Definition of done:

- Interaction routing is deterministic and debuggable.

## Phase 7 - Incremental Metadata Migration

### 7.1 Quick tab migration

- [ ] Re-encode quick controls in metadata registry.
- [ ] Verify behavior parity with legacy implementation.

### 7.2 Stat tab migration

- [ ] Re-encode stat controls in metadata.
- [ ] Verify parity for value updates and set actions.

### 7.3 Misc tab migration

- [ ] Re-encode misc controls in metadata.
- [ ] Verify parity for toggles and utility tools.

### 7.4 Legacy path retirement

- [ ] Remove legacy `generatetext`-driven assembly path.
- [ ] Remove obsolete listener maps no longer needed.

Definition of done:

- All tabs rendered from metadata pipeline.

## Phase 8 - Quality, Tooling, and Lifecycle

### 8.1 Testing and CI

- [ ] Add unit tests for metadata parsing and dispatcher.
- [ ] Add integration tests for modal actions and tab switching.
- [ ] Add CI build + test workflow.

### 8.2 Lifecycle and cleanup

- [ ] Add resource manager + teardown hooks for listeners/styles/observers.
- [ ] Ensure reinjection and route changes do not leak handlers.

### 8.3 Documentation

- [ ] Write architecture guide:
  - module boundaries
  - adapter contract
  - metadata authoring rules
  - adding a new game adapter

### 8.4 Release prep

- [ ] Update changelog and migration notes.
- [ ] Version bump and release tag.

Definition of done:

- Repeatable build/test/release with documented extension model.
