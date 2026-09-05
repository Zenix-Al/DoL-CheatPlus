# Developer-Friendly `createCheat` Framework Rework TODO

## Objective

Rework cheat authoring so every logical cheat is declared once with
`createCheat({ ... })`. A cheat module must co-locate its stable identity, UI
metadata, actions, SugarCube/runtime reads and writes, refresh behavior, toggle
schedule, feedback, applicability, and teardown when those concerns apply.

The current framework makes a developer reconstruct one cheat from UI metadata,
global action maps, action-object facades, fetcher arrays, toggle definitions,
schedulers, persistence helpers, and the SugarCube adapter. The target framework
must preserve the useful engine boundary and runtime safety while making the path
from a rendered control to a game-state mutation visible from one feature file.

The reference model is the nearby `createFeature()` / `createStyledFeature()`
authoring style in:

`D:\programming\js\userscript\latest highlighter\src\core\createStyledFeature.js`

The transferable idea is larger than the factory syntax alone: a small factory
returns an understandable descriptor, a build-time manifest discovers all
feature exports deterministically, one loader builds/registers the complete
feature set, and centralized config defaults/schema own user-controlled values.
This project should adopt that authoring pipeline where it removes manual edits,
without copying unrelated lifecycle, page-scope, style, or health machinery.

## Confirmed current-state friction

- A representative Money cheat currently spans:
  - `src/ui/metadata/stat/player-section.js` for controls and SugarCube binding;
  - `src/features/listeners/action-map-methods.js` for the public action ID;
  - `src/features/listeners/action-maps.js` for dispatcher registration;
  - `src/features/cheat/player-body-actions.js` for the actual mutation;
  - `src/features/actions.js` for the aggregate `cheatActions` facade.
- Cheats with derived labels or dynamic choices also require a function in
  `src/features/fetchers/` and an entry in a section hydrator or bound-action map.
- Toggle cheats additionally span `action-map-toggle.js`, domain action objects,
  `toggle-runtime.js`, `core/toggle/engine.js`, `ToggleScheduler`, SugarCube-backed
  toggle storage, and control-ID-based reactivation.
- The UI-to-action path uses global string IDs. A typo can survive until runtime,
  and the static action lint currently re-parses source text rather than checking
  the definitions that execute.
- Action implementations often read controls through global DOM IDs, mutate
  `getVars()` directly, call fetchers manually, and emit their own toast. The
  renderer independently has bindings and feedback, so ownership is unclear.
- `src/core/feature-factory.js` coordinates only storage/listener bootstrap
  phases. It does not represent individual cheats despite its general name.
- `features/registry.js` is a side-effect registry for broad startup features,
  while individual cheats are registered through unrelated action maps.
- `features/cheat-init.js` builds three large section registries and knows which
  required SugarCube paths each section needs. Individual cheat applicability is
  therefore not owned by the cheat.
- SugarCube access itself is already reasonably isolated under
  `src/core/sugarcube/`, but the active runtime adapter is not passed visibly to
  action, hydration, and toggle callbacks. Authors must discover which low-level
  module to import.
- The repository currently has 15 metadata files, 16 cheat-action files, five
  fetcher files, 58 method action-map entries, 20 toggle definitions, and 42
  explicit metadata action references. These are baseline inventory figures,
  not permanent API requirements.
- At planning baseline, `npm run lint:actions:strict` already reports unregistered
  metadata actions `save_data` and `load_data`. That pre-existing failure must be
  recorded and handled separately from migration regressions.

## Accepted design direction

- One logical cheat has one primary module and one exported `createCheat()`
  result.
- `createCheat()` is a thin definition factory: normalize defaults, validate the
  public contract, assign stable scoped keys, and return a descriptor. It does
  not access SugarCube, query the DOM, register globals, start observers, or hide
  a lifecycle state machine.
- One build-time manifest generator discovers conventionally exported cheat
  descriptors, writes a deterministic explicit import list, and fails on missing,
  duplicate, or ambiguous exports. There is no runtime directory scan, dynamic
  import, or registration triggered merely by importing a leaf module.
- The generated manifest is the only descriptor import list. Authors do not edit
  a second hand-maintained catalog when adding a normal cheat, and generated files
  are never edited by hand.
- One runtime catalog validates and indexes the generated descriptor array. One
  composition/builder layer consumes that catalog and connects descriptors to the
  existing renderer, dispatcher during migration, runtime adapter, toggle
  scheduler, persistence, and diagnostics.
- Build/check commands run manifest generation or drift validation before the
  bundle is accepted, so every exported cheat is built without relying on import
  side effects or filesystem order at runtime.
- Central config ownership is explicit: framework defaults, validation schema,
  shared policies, and save-backed CheatPlus values have one declared owner.
  Live SugarCube game variables are not copied into config; callbacks reach them
  only through `context.game`.
- Every cheat callback receives the same explicit context object. The context's
  `game` member is the active engine adapter. For SugarCube, the documentation
  must state plainly that `game.variables()` resolves
  `SugarCube.State.variables` through `core/sugarcube/adapter.js`.
- UI controls use cheat-local keys. Global dispatcher IDs and global DOM IDs are
  implementation details or temporary legacy aliases, not the normal authoring
  API.
- Simple state bindings remain declarative. Custom `sync()` exists only for
  derived labels, dynamic options, compound values, or other cases that cannot
  be expressed as a path binding.
- Modal shell commands such as open, close, navigation, search, and settings are
  application UI actions, not cheats. They stay outside `createCheat()`.
- Toggle scheduling and persistence remain shared runtime capabilities, but a
  toggle's cadence and effect are declared beside its UI rather than in separate
  maps.
- Existing stable toggle persistence keys and externally used legacy action/DOM
  IDs remain compatible during migration. Compatibility must be explicit,
  enumerable, testable, and removable.
- The migration is vertical-slice-first and incremental. Old and new cheats must
  coexist while sections are migrated; there is no flag day rewrite.
- Generated distribution files, version bumps, and release publishing are out of
  scope unless separately requested.

## Latest Highlighter reference review decision

The reference trace is:

```text
src/features/*/index.js exports *Feature
  -> scripts/featureManifest.cjs generates explicit imports
  -> src/generated/features.generated.js exports generatedFeatures
  -> loader maps every descriptor through registerFeature()
  -> feature settings metadata contributes to centralized section registries
  -> bootstrap enables the validated catalog after config/storage readiness
```

Adopt these ideas:

- deterministic build-time discovery with a committed generated manifest;
- a read-only manifest drift check separate from generation;
- one loader/builder that compiles every descriptor before UI contributions and
  recurring work become active;
- feature/cheat-owned settings UI contributions with owner-scoped cleanup;
- centralized defaults and schema metadata for config-controlled values;
- runtime validation for identity, placement, config references, and duplicate
  contributions.

Do not copy these parts unless CheatPlus later proves it needs them:

- page-scope/bootstrap buckets, style injection, feature health, or timeout policy;
- broad settings effects/reload machinery for ordinary game-variable bindings;
- runtime plugin discovery or module-load registration;
- a second state manager that mirrors SugarCube game state;
- fragile discovery rules without deterministic fixtures and drift tests.

## Required invariants

1. A normal cheat can be understood and modified from its primary definition
   module without editing a global action map, global fetcher list, and unrelated
   action facade.
2. A descriptor's stable `id` is the source for catalog identity, diagnostics,
   persistence, and generated scoped keys. Display labels are never identifiers.
3. Importing a cheat definition has no runtime side effects.
4. The generated manifest and runtime catalog are explicit and deterministic;
   registration/render order is derived from descriptor placement metadata, not
   filesystem order or incidental imports.
5. `createCheat()` never reads SugarCube globals or the DOM.
6. Cheat callbacks never need to import `SugarCube`, `window.V`, or
   `core/global-bridge.js`; they receive the active adapter as `context.game`.
7. The SugarCube adapter remains the only implementation that resolves
   `SugarCube.State`, `SugarCube.setup`, passage state, and engine quirks.
8. A local action reference either resolves within the same descriptor or fails
   descriptor validation before the UI becomes interactive.
9. A control key is unique only within its cheat. The runtime owns any generated
   global key and collision checks.
10. One-shot, input/set, select/action, frame toggle, and daily toggle cheats are
    expressible without adding a new registry type.
11. Bound controls do not need a fetcher that merely copies one runtime path into
    one input.
12. Custom sync is opt-in and has explicit triggers; creating a cheat must not
    silently add polling, document listeners, or per-click work.
13. Action completion has one outcome contract so renderer feedback reflects the
    actual handler result rather than merely successful dispatch.
14. Toggle activation, deactivation, restoration, and persistence use the cheat
    descriptor's stable ID even when a legacy button ID is temporarily retained.
15. Disabling or disposing a cheat cancels its scheduled work and removes only
    resources owned by that cheat.
16. A broken or inapplicable cheat is isolated. It does not prevent unrelated
    cheats or a whole modal section from rendering unless the section shell itself
    is broken.
17. Legacy compatibility paths cannot become a second authoring API.
18. Tests consume real descriptors and catalogs; the final validator does not
    infer correctness by regex-parsing JavaScript source.
19. Adding a conventionally exported cheat is detected by a build-time manifest
    check; authors do not also edit a manual descriptor list.
20. Every state value has one declared owner: definition constant, transient
    runtime state, save-backed CheatPlus config, or live game state.

## Target author experience

The exact property names may change once the vertical slice proves them, but the
finished API should remain approximately this small and direct:

```js
import { createCheat } from '../../create-cheat.js';

export const moneyCheat = createCheat({
  id: 'player.money',
  location: { section: 'stats', group: 'player', order: 10 },
  meta: {
    label: 'Money',
    controls: [
      {
        key: 'value',
        type: 'input',
        binding: {
          path: 'money',
          coerce: 'number',
          required: true,
          onMissing: 'disable-cheat',
        },
      },
      { key: 'set', type: 'button', label: 'Set', action: 'set' },
    ],
  },
  actions: {
    set({ game, controls }) {
      const value = controls.number('value');
      if (!Number.isFinite(value)) {
        return { ok: false, message: 'Money must be a number.' };
      }
      game.set('money', value);
      return { ok: true, message: 'Money updated.' };
    },
  },
});
```

The module follows the documented cheat export convention. The manifest tool
finds it and generates the static import; the author does not open a catalog file.

The callback path must be documented without euphemism:

```text
Money Set button
  -> player.money local action "set"
  -> moneyCheat.actions.set(context)
  -> context.game.set("money", value)
  -> active SugarCube adapter
  -> SugarCube.State.variables.money = value
```

A computed UI value should remain in the same module:

```js
export const bodySizeCheat = createCheat({
  id: 'player.body-size',
  location: { section: 'stats', group: 'player', order: 20 },
  meta: {
    label: 'Body size',
    controls: [
      { key: 'current', type: 'text' },
      {
        key: 'size',
        type: 'select',
        options: ['Tiny', 'Small', 'Normal', 'Large'],
      },
      { key: 'set', type: 'button', label: 'Set', action: 'set' },
    ],
  },
  actions: {
    set({ game, controls }) {
      const sizes = { Tiny: 0, Small: 1, Normal: 2, Large: 3 };
      game.set('bodysize', sizes[controls.value('size')]);
      return { ok: true, refresh: true, message: 'Body size updated.' };
    },
  },
  refresh: ['mount', 'section-open', 'after-action'],
  sync({ game, controls }) {
    const names = ['Tiny', 'Small', 'Normal', 'Large'];
    controls.text('current', names[game.get('bodysize')] ?? 'Unknown');
  },
});
```

A toggle should declare its behavior rather than join separate action and toggle
maps:

```js
export const infiniteArousalCheat = createCheat({
  id: 'player.infinite-arousal',
  location: { section: 'quick', group: 'player', order: 30 },
  meta: {
    label: 'Infinite arousal',
    controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }],
  },
  toggle: {
    cadence: 'frame',
    cooldownMs: 100,
    maxFailures: 5,
    runOnActivate: true,
    legacyStorageKey: 'unliarousal',
  },
  effect({ game }) {
    game.set('arousal', 10000);
  },
});
```

These examples intentionally use plain objects and ordinary functions. Helper
builders may reduce repetition, but authors must always be able to read the
resulting contract without knowing a builder hierarchy.

## Proposed descriptor contract

### Required fields

| Field      | Purpose                                                        |
| ---------- | -------------------------------------------------------------- |
| `id`       | Stable namespaced identity such as `player.money`              |
| `location` | Deterministic `section`, optional `group`, and numeric `order` |
| `meta`     | One logical UI contribution with cheat-local control keys      |

At least one of `actions`, `effect`, or a read-only `sync` contribution must be
present. A pure heading/separator remains section layout metadata and is not
misrepresented as a cheat.

### Optional fields

| Field                    | Purpose                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| `actions`                | Local action-name to function map                                            |
| `sync`                   | Derived/dynamic UI refresh function                                          |
| `refresh`                | Explicit sync triggers such as `mount`, `section-open`, and `after-action`   |
| `toggle`                 | Cadence, cooldown, failure limit, activation behavior, and migration aliases |
| `effect`                 | Scheduled toggle mutation                                                    |
| `isApplicable`           | Runtime-aware availability check                                             |
| `requiredPaths`          | Narrow required runtime paths for validation and disable messaging           |
| `onEnable` / `onDisable` | Optional resource lifecycle for exceptional cheats                           |
| `dispose`                | Final cleanup for descriptor-owned resources                                 |
| `legacy`                 | Temporary DOM IDs, action IDs, and persisted toggle keys                     |
| `config`                 | References to centrally declared CheatPlus config paths/scopes when needed   |
| `diagnostics`            | Bounded display metadata; never game-state values                            |

Do not add a field until at least one existing cheat needs it and the behavior
cannot be expressed clearly with the fields above. The API is not a generic
workflow language.

## Public callback context

Every `actions`, `sync`, `effect`, applicability, and lifecycle callback receives
one documented context shape:

```js
{
  cheat,       // immutable descriptor identity and metadata
  game,        // active engine adapter: variables/get/set/setup/passage/readiness
  config,      // narrow CheatPlus-owned config facade; never a game-state mirror
  controls,    // UI access scoped to this mounted cheat, addressed by local key
  event,       // triggering DOM event when relevant, otherwise null
  signal,      // AbortSignal owned by this cheat operation/resource lifecycle
  reason,      // mount | section-open | action | frame | daily | restore | dispose
  feedback,    // optional shared outcome/toast helper for multi-step reporting
  services: {
    scheduler, // only where an exceptional cheat needs explicit scheduling
    logger,
  },
}
```

`game` must expose the smallest stable engine contract needed by cheats:

```js
game.id;
game.isReady();
game.variables();
game.get(path);
game.set(path, value);
game.has(path);
game.setup(path?);
game.passage();
```

`config` and `game` must remain visibly different. `config` resolves only
framework/save-owned settings declared by the central config contract; `game`
resolves live DoL/SugarCube state. The exact config read/write surface and scopes
must be decided in Wave 2 before descriptors depend on it.

The adapter can expose additional engine capabilities through named methods only
after a real use case is proven. Do not pass the raw runtime window, the whole
bootstrap object, the dispatcher, or every service into callbacks.

`controls` must be instance-scoped and deliberately small:

```js
controls.element(key);
controls.value(key);
controls.number(key);
controls.checked(key);
controls.setValue(key, value);
controls.text(key, value);
controls.options(key, options);
controls.setEnabled(key, enabled, reason?);
```

The context factory must be inspectable in one file. It must not resolve hidden
dependencies by global names or callback parameter naming conventions.

## Factory responsibilities and hard limits

`createCheat()` may:

- validate and normalize one plain descriptor;
- derive an internal slug from the stable ID;
- namespace local action and control keys for runtime use;
- freeze or defensively copy definition-owned structures;
- retain explicitly declared legacy aliases;
- return enough source context for useful validation errors in development.

`createCheat()` must not:

- register the descriptor globally;
- import or call the active runtime engine;
- mutate SugarCube state;
- query or render DOM nodes;
- start timers, observers, or scheduler tasks;
- persist toggle state;
- catch every callback error and silently convert it to success;
- infer behavior from function names, filenames, labels, or DOM IDs;
- create subclasses, decorators, dependency injection containers, or a second
  event bus;
- duplicate the application bootstrap or the broad-feature lifecycle currently
  handled by `core/feature-factory.js`.

## Proposed source layout

The exact final paths should be confirmed during the vertical slice, but the
target ownership should resemble:

```text
src/
  config/
    cheats/
      defaults.js           # framework/save-owned default values only
      schema.js             # config paths, types, scopes, and validation
      policies.js           # genuinely shared cadence/action/UI policies
  cheats/
    create-cheat.js          # pure descriptor normalization and validation
    catalog.js               # validates/indexes generated descriptor array
    runtime-context.js       # visible adapter/control context construction
    definitions/
      quick/
        player-arousal.cheat.js
      stats/
        player-money.cheat.js
        player-body-size.cheat.js
      misc/
        farm-assault-time.cheat.js
  generated/
    cheats.generated.js      # generated explicit imports; never hand-edited
  features/
    cheat-runtime.js         # builder: catalog -> renderer/actions/scheduler
  ui/
    renderers/
      cheat-renderer.js      # renders descriptor meta; no engine knowledge
scripts/
  cheat-manifest.cjs         # deterministic generate/check implementation
```

If dependency rules make a top-level `cheats/` layer undesirable, keep the same
ownership under `src/features/cheats/`. Do not scatter factory, catalog, context,
and definitions across existing `core/`, `ui/`, and `services/` directories just
to preserve the current tree. Record the chosen dependency direction in
`src/ARCHITECTURE.md` before broad migration.

## Runtime composition flow

```text
startCheatInjection(runtimeEngine)
  -> bootstrap application shell and storage
  -> load generatedCheats from cheats.generated.js
  -> createCheatCatalog(generatedCheats)
       -> validate IDs, exports, aliases, placement, and config references
       -> index immutable descriptors in deterministic placement order
  -> buildCheatRuntime(catalog, runtimeEngine.adapter, configFacade)
       -> validate catalog identities and legacy aliases
       -> register only temporary dispatcher aliases needed during migration
       -> group descriptor UI by section/group/order
       -> connect declared refresh triggers
       -> connect toggle descriptors to scheduler and persistence
  -> render visible section contributions
       -> create descriptor-scoped controls
       -> bind local actions directly to descriptor callbacks
       -> create callback context with active adapter
```

The manifest generator runs before bundling, while its check mode is read-only and
fails when the committed generated file is stale. Runtime code never scans the
filesystem. The builder runs once per application bootstrap after required
storage and the active engine adapter are ready; repeated UI mounts consume its
compiled records rather than registering every cheat again.

This composition layer is the only place that should know all of the renderer,
dispatcher compatibility, scheduler, persistence, config facade, and runtime
adapter at once. That fact must be obvious from its imports and tests.

## Configuration ownership model

The Latest Highlighter reference benefits from central `defaults` and `schema`
modules because settings UI, persistence, reload behavior, and feature enablement
all point at the same paths. CheatPlus should adopt that ownership rule without
treating the config directory as a dump for all mutable values.

| Value kind                                                                       | Authoritative owner                                                         | Descriptor access                                             |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Shared framework defaults, cadence limits, action policy, section policy         | `src/config/cheats/`                                                        | import stable constants or use normalized descriptor defaults |
| CheatPlus-owned persisted save values, including enabled toggle IDs and counters | central config schema plus `core/sugarcube/cheat-config.js` storage adapter | `context.config`; no direct `vars.cheatPlus` access           |
| Live game values such as money, arousal, date, NPCs, pregnancy, and setup data   | active engine adapter / SugarCube                                           | `context.game`; never copied into config                      |
| Transient modal/runtime flags and compiled descriptor instances                  | `core/state/` and cheat runtime                                             | not persisted and not placed in descriptor objects            |
| UI-local draft/input state                                                       | mounted descriptor control scope                                            | `context.controls`                                            |

Wave 2 must inventory current `cheat-config.js` keys, assign each a type, default,
persistence scope, migration rule, and owner, then decide whether the existing
named accessors remain behind `context.config` or are replaced by a small path
API. Defaults and schema metadata must not be duplicated inside individual cheat
modules. A descriptor may reference a config path, but it does not create an
independent store or persist arbitrary game state.

### Accepted storage direction

- Preserve the current SugarCube save-backed storage behavior during the factory
  rework. Active toggle IDs, reversible mutation baselines, and other existing
  `State.variables.cheatPlus` values must continue to follow the game save.
- Put that behavior behind a narrow save-storage/config adapter so descriptors and
  the builder do not import `core/sugarcube/cheat-config.js` directly.
- Do not migrate existing values to userscript storage as part of the framework
  rework. This avoids changing save semantics while broken cheats and legacy
  registrations are being migrated.
- Keep the provider boundary capable of supporting a userscript-backed store for
  future cross-save preferences, but do not add GM grants, dual-write, fallback,
  or synchronization machinery without a concrete setting that needs it.
- Leave existing UI-only `localStorage` preferences unchanged unless a separate
  storage migration is approved.
- Storage implementation is replaceable; storage semantics are not accidental.
  The central schema declares whether a value is save-owned, user-owned, or
  transient, and callers use the config service rather than selecting a provider.
- Runtime scheduler membership, cooldown clocks, mounted controls, and failure
  counters remain memory-only and are rebuilt from persisted intent.

Default for the initial factory implementation:

```text
createCheat toggle intent
  -> context.config / toggle persistence service
  -> SugarCube save-storage adapter
  -> State.variables.cheatPlus.toggles[stableCheatId]
```

## Migration classification

Each existing item must be classified before it moves:

| Classification        | Examples                            | Target                                                       |
| --------------------- | ----------------------------------- | ------------------------------------------------------------ |
| One-shot cheat        | give money, heal/kill, change trait | `actions` in one descriptor                                  |
| Bound editor          | money input, stat input             | declarative binding plus local action                        |
| Derived-value cheat   | body label, pregnancy list          | descriptor `sync` with explicit triggers                     |
| Dynamic-options cheat | NPC/fetus/select lists              | local `options` source and/or `sync`                         |
| Frame toggle          | infinite arousal, farm safe         | `toggle.cadence = "frame"` plus `effect`                     |
| Daily toggle          | Eden/church tasks                   | `toggle.cadence = "daily"` plus `effect`                     |
| Debug tool            | array checker, variable search      | descriptor only if it mutates/inspects game state as a cheat |
| Modal shell           | open/close/tab navigation/search UI | remain application UI actions                                |
| Bootstrap feature     | storage/listeners                   | remain broad lifecycle features, not cheats                  |
| Layout-only metadata  | headers, separators, version text   | section/layout definitions, not fake cheats                  |

## Test-suite delivery plan

Testing is an implementation workstream, not a final verification task. Each
framework package must introduce or update its tests before the corresponding
legacy path is removed. The suite should favor executable descriptors, fake
runtime adapters, and observable outcomes over source-text inspection.

### [x] CHEAT-FACTORY-TEST-FOUNDATION-01

- During Wave 1, establish a structured test inventory covering current unit,
  integration, regression, build-time validation, and browser-only behavior.
- Give every logical cheat one baseline status: `working`, `known-broken`,
  `partially-working`, or `unverified`.
- For every known-broken cheat selected for early migration, capture:
  - the shortest reproducible user interaction;
  - the current observed failure;
  - the intended result based on UI text, existing code, history, or game state;
  - the exact state paths and controls involved;
  - whether the failure is deterministic or runtime/version dependent.
- Add characterization tests for working behavior that must be preserved.
- Add intentionally failing, skipped, or `todo` regression cases for confirmed
  broken behavior, clearly labeled with the intended assertion. Do not weaken
  the assertion to make the current bug appear correct.
- Record browser-only gaps that cannot be reproduced under JSDOM or a fake
  runtime so they remain explicit manual gates.
- Keep fixtures minimal and synthetic; do not snapshot complete SugarCube saves
  or personal game data.

Gate: the first implementation slice cannot start until its current behavior,
intended behavior, runtime paths, and automated/manual verification route are
known.

Completion evidence (2026-08-29): `test/README.md` records the executable
baseline and browser-only gaps; `test/baseline/legacy-cheat-inventory.js` assigns
every current method/toggle cheat a status and separates shell/hydration actions;
inventory tests enforce ownership/evidence rules; characterization tests cover
Money and infinite arousal; server-save Export/Import are explicit regression
todos instead of silently accepted failures.

### [x] CHEAT-FACTORY-TEST-HARNESS-02

- Build reusable factories for a fake runtime engine, fake game adapter, mounted
  descriptor control scope, scheduler clock/frame driver, and persisted-toggle
  store.
- Let tests seed nested variables/setup/passage state and inspect exact reads and
  writes without exposing SugarCube globals to descriptor modules.
- Provide helpers that mount one descriptor or a small catalog input without
  booting the entire userscript. The production suite must also cover the
  generated-manifest-to-runtime-catalog path.
- Provide deterministic drivers for `mount`, `section-open`, `after-action`,
  `frame`, `daily`, `restore`, and `dispose` reasons.
- Capture action outcomes, feedback, refresh requests, cleanup registrations,
  scheduler membership, and persistence operations as assertions.
- Ensure the harness itself has focused tests so it cannot silently accept a
  missing mutation, unresolved local action, or leaked listener.

Gate: factory/runtime development must use the same public context and catalog
entry points that production uses; tests cannot depend on private shortcuts that
hide integration failures.

Completion evidence (2026-08-29): the test-only descriptor harness mounts one
descriptor or a small catalog with scoped DOM controls; fake runtime/game,
scheduler/frame, and persisted-toggle helpers expose exact operation histories;
focused tests cover local action/event resolution, nested mutations, outcomes,
feedback, refresh, cleanup/abort, duplicate local keys across cheats, frame
cooldown, daily cadence, restoration, persistence, and failure thresholds. The
POC limitation is explicit in `test/README.md`: when production `createCheat()`
and generated-manifest/catalog composition land, these fixtures/assertions must
route through those public entry points rather than remain a parallel runtime.

### [x] CHEAT-FACTORY-TEST-CONTRACT-03

- Add table-driven descriptor validation tests for every required/optional field,
  supported cheat classification, malformed definition, duplicate, and legacy
  alias case.
- Add catalog order, lookup, section grouping, deterministic output, and
  side-effect-free import tests.
- Add manifest generator tests for deterministic path/export ordering, ignored
  non-cheat modules, missing exports, duplicate exports/IDs, stale generated
  output, path normalization, and read-only check mode.
- Add a build integration test proving a newly exported fixture cheat enters the
  generated manifest and reaches the runtime catalog without a manual catalog
  edit.
- Add config contract tests proving every declared CheatPlus config path has one
  default, type/scope metadata, valid descriptor references, and no game-state
  path masquerading as config.
- Add callback-context contract tests for `game`, `config`, `controls`, `event`,
  `signal`, `reason`, feedback, and allowed services.
- Add renderer/action outcome tests before the first production descriptor is
  cut over.
- Treat a descriptor that renders but references a missing local action as a test
  and development failure, not a runtime warning-only case.

Gate: the public factory contract is locked by executable tests before broad
cheat migration. Contract changes require updating API docs and affected recipes
in the same package.

Completion evidence (2026-08-29): reusable contract cases cover one-shot, bound
editor, derived value, dynamic options, frame toggle, daily toggle, and the full
optional-field surface; table-driven malformed cases enforce identity, placement,
controls/actions, refresh, toggle, lifecycle, config, and legacy-alias rules. The
test catalog covers deterministic order/lookups/grouping and duplicate ID,
placement, alias, and config-reference rejection. An isolated temporary-project
manifest harness covers recursive deterministic discovery, normalized paths,
ignored modules, missing/duplicate exports, stale read-only checks, side-effect-
free generated imports, and generated-manifest-to-catalog integration. Config
tests cover default/schema/type/scope parity and forbid game paths; callback and
renderer tests cover the complete context, normalized outcomes, failed refresh
suppression, and pre-interaction missing-action failure. `npm run test:contract`
passes. These are test-only oracles: Wave 3 must route the same cases through
production `createCheat()`, manifest, config, and catalog entry points and remove
the parallel validators.

### [x] CHEAT-FACTORY-TEST-PARITY-04

- For each migration package, run the legacy and descriptor implementations
  against equivalent synthetic starting state where doing so is safe.
- Compare intended state mutations, action outcomes, visible control values,
  refresh behavior, applicability, and cleanup rather than comparing internal
  call structure.
- For a currently working cheat, require behavioral parity before legacy removal.
- For a known-broken cheat, require the documented intended result and a new
  passing regression test; do not require parity with the broken output.
- Maintain an inventory assertion showing every cheat is owned by exactly one
  active path, with an explicit temporary coexistence exception where needed.
- Require every bug discovered during migration to receive a focused regression
  test before its fix is accepted.

Gate: no metadata row, action-map entry, fetcher, toggle definition, or legacy
method is deleted until its descriptor path passes the applicable parity or
intent-correction tests.

Completion evidence (2026-08-29): `test/helpers/cheat-parity-harness.js` runs
legacy and descriptor implementations from deep-cloned equivalent state and
requires observations for state, normalized outcome, visible controls, refresh,
applicability, and cleanup. Real POC parity cases cover Money success and invalid
input plus repeated infinite-arousal effects. Working cases must exactly match
legacy observations; a synthetic known-broken case proves descriptors are checked
against documented intent and not broken output, while the real server-save todos
remain honestly unresolved. `test/baseline/cheat-migration-ownership.js` tracks
every logical cheat as exactly one active legacy owner today, requires descriptor
ID plus parity/intent evidence before ownership changes, permits dual ownership
only with a reason and removal gate, and requires a regression-test path for every
migration-discovered bug. `npm run test:parity` passes. POC descriptors are
recorded only as evidence and are not treated as production owners.

### [x] CHEAT-FACTORY-TEST-TOGGLE-05

- Test frame and daily toggles with deterministic time and animation-frame
  drivers rather than real delays.
- Cover enable, immediate effect, repeated execution, cooldown, daily boundary,
  disable, restore, persistence, legacy-key migration, failure thresholds,
  watchdog behavior, remount, reinjection, and dispose.
- Assert that a disabled toggle performs no further game mutations and owns no
  scheduler entry.
- Assert that restoration does not create duplicate persistence commits or
  duplicate scheduled callbacks.
- Test multiple active toggles together so one local-key or failure path cannot
  corrupt another descriptor.

Gate: no repeating toggle moves to `createCheat()` until these scheduler and
persistence cases pass for the vertical-slice frame and daily examples.

Completion evidence (2026-08-29): deterministic integration tests cover frame
enable, one immediate effect, repeated frames, cooldown boundaries, explicit
disable, and no post-disable mutation; daily toggles execute once per distinct
day and stop after disable. Stable-ID restoration is idempotent, produces no
persistence commits, and registers/runs one callback; explicit legacy storage
keys migrate once to the stable descriptor ID. Failure thresholds quarantine only
the broken toggle, remove its persisted intent, update its scoped control, and
leave healthy toggles active. A broader watchdog reset clears and rebuilds all
persisted scheduler entries exactly once without rewriting storage. Remount,
reinjection, repeated restoration, and disposal tests prove one scheduler entry,
preserved enabled intent across disposal, aborted old instances, and no leaked
future mutations. Multiple descriptors reuse the local `enabled` key without
cross-control or failure corruption. `npm run test:toggle` passes.

### [x] CHEAT-FACTORY-TEST-FULL-SUITE-06

- Add one supported command that runs manifest drift validation, descriptor/config
  validation, catalog inventory, unit, integration, regression, and legacy-parity
  tests together.
- Keep browser smoke cases in a versioned checklist or evidence document when
  they cannot be automated locally.
- Track test count, duration, skipped/todo cases, and known baseline failures so
  migration packages cannot quietly reduce coverage.
- Add leak/repeated-mount tests and a bounded performance baseline for a catalog
  containing all migrated cheats.
- Retire source-regex action lint only after executable catalog validation covers
  the same useful failures.
- Require the full suite, lint, build, and `git diff --check` at final cutover.

Gate: final verification has no unexplained skipped/todo test for a migrated
cheat and no known-broken cheat marked as successfully migrated.

Completion evidence (2026-08-29): `npm run verify:cheat-factory` is the supported
read-only gate and runs ESLint plus every executable baseline, characterization,
contract, integration, parity, regression, toggle, and unit test. The committed
metric baseline rejects coverage shrinkage, failures, cancellations, skips,
unknown todos, and duration beyond 60 seconds while allowing tests to be added
or known todos to be resolved. The gate passes with 119 tests, 117 passing, zero
skipped, two named server-save todos, and 17.3 seconds duration. A target-scale
catalog (one descriptor per legacy inventory entry) passes three complete
mount/action/dispose cycles under a five-second bound without retained DOM,
listeners, catalog entries, or scheduler work. Browser-only cases now have a
versioned checklist and evidence template. No production descriptor is currently
marked migrated, so neither server-save todo is hidden behind a migrated status.
Source-regex action lint remains active until the production executable catalog
can replace it. The mutating build and final `git diff --check` remain Wave 12
cutover gates rather than being run during this read-only test delivery package.

## Documentation delivery plan

Documentation must be updated alongside the public contract. Temporary migration
notes and final contributor guidance have different purposes and should not be
collapsed into one stale architecture page.

### [ ] CHEAT-FACTORY-DOCS-BASELINE-01

- During Wave 1, document the current event-to-SugarCube trace for each cheat
  classification and identify where action, hydration, toggle, and persistence
  ownership currently lives.
- Record the current ownership and defaulting behavior of every
  `State.variables.cheatPlus` key separately from ordinary DoL game paths.
- Add the cheat inventory format, status meanings, and known-broken reproduction
  template to a contributor-facing migration document.
- Clearly label current behavior versus intended behavior for broken cheats.
- Record the pre-existing strict-lint failures and other baseline limitations so
  later documentation does not attribute them to the new factory.

Gate: a contributor can reproduce and locate a selected broken cheat before its
implementation is changed.

### [ ] CHEAT-FACTORY-DOCS-API-02

- During Waves 2-4, document the authoritative `createCheat()` descriptor,
  generated manifest/builder flow, config ownership, and callback-context
  contract from the same source used by tests.
- Explain `meta`, bindings, local controls/actions, `sync`, refresh triggers,
  `toggle`, `effect`, `config`, applicability, lifecycle cleanup, outcomes, and
  legacy aliases.
- Include the literal runtime path:
  `control -> descriptor callback -> context.game -> active adapter -> SugarCube`.
- State what the factory deliberately does not do, including runtime discovery,
  implicit polling, direct SugarCube access, and automatic persistence for
  non-toggle state.
- Explain the normal command sequence: create/export one cheat module, run the
  manifest generator or build, check generated drift, and run focused tests.
- Link each API field to at least one focused executable test or recipe.

Gate: any public contract change must update its typedef/JSDoc, contract tests,
and API documentation together.

### [ ] CHEAT-FACTORY-DOCS-RECIPES-03

- As vertical slices land, add copyable recipes for:
  - a one-shot action;
  - a bound input/set editor;
  - a computed label with `sync`;
  - dynamic options;
  - a frame toggle;
  - a daily toggle;
  - shared complex domain logic imported by multiple descriptors.
- Keep each normal recipe centered on one descriptor module plus generated
  manifest validation and one focused test; there is no hand-edited catalog entry.
- Show validation failure and debugging examples, not only the successful path.
- Use real migrated cheats where they are concise; use synthetic examples when a
  production cheat would obscure the API.

Gate: a contributor unfamiliar with the old maps can add and test a small cheat
without reading runtime composition internals.

### [ ] CHEAT-FACTORY-DOCS-MIGRATION-04

- Maintain a mapping from each legacy metadata/action/fetcher/toggle concept to
  its descriptor equivalent.
- Document coexistence rules, compatibility aliases, removal criteria, and how
  catalog parity is checked.
- Record decisions made when fixing broken cheats, including the evidence for
  intended behavior and any deliberate behavior change.
- Keep a per-domain migration checklist synchronized with the Wave 1 inventory.
- Remove migration-only instructions when cutover is complete, preserving only
  useful architectural decisions and release evidence.

Gate: legacy code is not removed until its migration entry identifies the new
owner, tests, aliases, and verified behavior.

### [ ] CHEAT-FACTORY-DOCS-CUTOVER-05

- Replace the existing “Developing a New Cheat” guide with the descriptor-first
  workflow after the vertical slices prove the API.
- Update `src/ARCHITECTURE.md` diagrams, dependency rules, startup flow, runtime
  context, renderer flow, refresh behavior, scheduler/persistence behavior, and
  teardown ownership.
- Add a troubleshooting guide for descriptor validation, missing runtime paths,
  failed actions, stale sync, inactive toggles, restore failures, and legacy
  alias conflicts.
- Remove instructions that tell contributors to edit retired global maps or
  aggregate action/fetcher facades.
- Verify every documented command, path, API name, and example against the final
  repository before release evidence is recorded.

Gate: the final documentation describes only supported authoring paths and its
copyable examples pass their associated tests.

## Wave 1 — Baseline inventory and executable trace

### [x] CHEAT-FACTORY-BASELINE-01

- Produce a machine-readable inventory of every logical cheat and its current:
  metadata module, action ID, implementation method, fetcher/hydrator, toggle
  definition, persisted key, required runtime paths, UI IDs, and tests.
- Separate application shell actions from game cheats before calculating parity.
- Trace at least one example of every migration classification from DOM event to
  final SugarCube read/write and back to UI refresh.
- Record collisions where one logical cheat has multiple action IDs or one action
  implementation serves multiple controls.
- Record dynamic UI definitions whose options depend on setup data, NPC data,
  pregnancy state, or runtime globals.
- Classify every cheat as `working`, `known-broken`, `partially-working`, or
  `unverified`; do not use current output as the parity target for a confirmed
  broken cheat.
- Reproduce high-priority broken cheats before refactoring them and record their
  intended behavior, evidence, state paths, and automated/manual test route.
- Record all externally meaningful aliases exposed through `window.*`,
  `cheatActions`, `mycode`, `firstload`, and `alt_fetch`.
- Record baseline lint, unit/integration/regression tests, build result, bundle
  size, action counts, and the known `save_data`/`load_data` strict-lint failure.
- Do not change runtime behavior in this wave.

Checkpoint: every current cheat has one inventory row, migration classification,
and behavior status. Every high-priority broken cheat has a reproducible failure
and intended-behavior assertion. Stop if the team cannot distinguish persisted
cheat identity from incidental button/action IDs.

Completion evidence (2026-08-29): `test/baseline/wave1-baseline.js` provides the
machine-readable inventory and explicitly records metadata, action/method owner,
UI identity, fetcher/runtime-path evidence, persistence identity, tests, and
unknown fields for every registered method and toggle. It separates modal,
navigation, hydration, and server transport from cheat parity; records shared
hydrator collisions, dynamic game-shape dependencies, compatibility aliases, and
one full event-to-SugarCube route for all six current migration classifications.
Money and infinite arousal have executable behavior characterization; unproven
source traces remain `unverified`. Export/Import remain reproducible known-broken
application integrations with intended behavior and regression todos. The audit
also found that `cheatActions`/`mycode` and `firstload`/`alt_fetch` are module
exports, while the older documented `window.*` registration has no current
implementation. `docs/CHEAT_FACTORY_WAVE1_BASELINE.md` records these boundaries.
The unified gate passes with 123 tests, 121 passing, zero skipped, two named
todos, and lint passing; strict action lint reports only `save_data`/`load_data`.
Existing generated userscripts are 230,812 bytes and 119,346 bytes minified. The
build was not rerun because it mutates version/distribution outputs, and no
runtime source was changed in this wave.

## Wave 2 — Contract decision and architecture boundary

### [x] CHEAT-FACTORY-CONTRACT-01

- Write the final descriptor JSDoc/TypeScript-checkable typedef before building
  runtime composition.
- Decide and document the exact meanings of `id`, `location`, `meta`, `actions`,
  `sync`, `refresh`, `toggle`, `effect`, lifecycle hooks, and `legacy`.
- Define which properties are immutable and which runtime state is held outside
  descriptors.
- Decide the narrow `context.config` contract and descriptor config-reference
  shape. Preserve `context.game` as the only live game-state surface.
- Define action outcome values for success, validation failure, blocked state,
  thrown error, async completion, and refresh request.
- Define sync trigger semantics and prove no implicit interval or document-level
  listener is created.
- Define local key generation and collision handling without exposing generated
  keys as public authoring requirements.
- Define catalog order and section/group placement without relying on import or
  object enumeration accidents.
- Define the cheat file/export convention consumed by the manifest generator,
  the generated-file ownership banner, and generate-versus-check commands.
- Update the dependency diagram in `src/ARCHITECTURE.md` with the chosen
  `cheats/` boundary.
- Add a concise “add one cheat” example that fits on one screen.

Completion evidence (2026-08-29): `src/cheats/types.js` freezes the complete
JSDoc-checkable authoring and callback surface without runtime imports, while
`docs/CHEAT_FACTORY_CONTRACT.md` defines identity, placement, local keys, outcome
normalization, explicit sync, toggles, lifecycle ownership, config/game
separation, legacy aliases, and file/export convention. The one-screen Money
example uses only `createCheat`, `context.game`, and scoped controls. Existing
contract, catalog, callback, parity, and lifecycle tests cover ordering,
collisions, explicit refresh, async/error outcomes, and absence of ambient
polling/listeners. `src/ARCHITECTURE.md` now shows the definitions-to-builder
boundary. Wave 3 still owns the factory and manifest implementations.

### [x] CHEAT-FACTORY-CONFIG-02

- Classify every existing `cheat-config.js` value as save-backed config, transient
  runtime state, or game state; move misplaced values to their correct owner.
- Create value-only central defaults and a schema/index declaring each retained
  config path's type, persistence scope, validation, and migration aliases.
- Keep `core/sugarcube/cheat-config.js` as the SugarCube save adapter or replace
  its internals behind the same boundary; no descriptor may read
  `State.variables.cheatPlus` directly.
- Preserve current save-backed behavior during cutover; do not introduce
  userscript storage, dual-write, or automatic provider fallback in this package.
- Validate descriptor config references against the central schema and reject
  duplicate or unknown config paths before UI registration.
- Define initialization, missing-key backfill, old-save migration, reset, and
  serialization behavior without duplicating defaults in accessors and features.
- Add focused tests for fresh saves, partial old saves, invalid values, save
  switching, toggle ID restoration, schema/default parity, and the
  `context.config` facade.
- Document why live game paths are `context.game` bindings rather than config.

Checkpoint: a reviewer can explain the entire public authoring API without
opening the dispatcher, scheduler, metadata renderer, SugarCube internals, or a
second config implementation.

Completion evidence (2026-08-29): `src/core/config/cheat-config-schema.js`
classifies all eleven existing CheatPlus keys as save-backed mod configuration,
and records transient instance/scheduler state and live game values separately.
It is the value-only schema/default index with type, save scope, validation,
description, and migration aliases. The existing SugarCube adapter initializes
through schema normalization, preserving valid partial-save values, backfilling
missing keys, repairing invalid types, deriving the nullable NPC baseline, and
creating independent object defaults per save. Tests cover schema/default parity,
invalid declarations/references, facade operations, fresh/partial saves, invalid
values, and save switching; toggle restoration/migration remains covered by the
toggle suite. No userscript provider, fallback, or dual-write was added. The
unified gate passes with 127 tests, 125 passing, zero skipped, and two named
server-save todos.

## Wave 3 — Thin factory, generated manifest, and runtime catalog

### [x] CHEAT-FACTORY-CORE-01

- Add the pure `createCheat()` implementation with no runtime, DOM, UI renderer,
  storage, or scheduler imports.
- Validate a non-empty stable ID, supported location, control-key uniqueness,
  local action references, required callbacks, refresh values, toggle cadence,
  numeric scheduler options, and legacy alias shapes.
- Reject unknown top-level properties in development/tests so misspellings do not
  silently become inert configuration.
- Preserve function references; do not serialize or clone callbacks.
- Freeze definition-owned arrays/objects enough to prevent cross-test mutation
  without freezing runtime-owned game objects.

Completion evidence (2026-08-29): `src/cheats/create-cheat.js` is the pure
production factory and validator. It imports only the value-only config schema,
rejects unknown/malformed definitions and config references, validates every
frozen Wave 2 field, preserves callback identity, and recursively freezes only
definition-owned data. The 38-case descriptor contract now targets production;
focused production tests prove immutability, callback preservation, and no DOM,
runtime, scheduler, storage, or global-registration side effects. The obsolete
test-only descriptor validator was removed.

### [x] CHEAT-FACTORY-MANIFEST-02

- Add a deterministic build-time manifest generator that discovers the documented
  cheat export convention and emits explicit static imports plus a descriptor
  array under `src/generated/`.
- Add separate write and read-only check modes. Build may regenerate before
  bundling; tests/CI must fail on stale output without silently modifying it.
- Add package commands such as `generate:cheat-manifest` and
  `check:cheat-manifest`, and wire the manifest step into the existing build before
  esbuild reads `src/main.js`.
- Normalize generated paths/order across Windows and POSIX separators, include a
  never-edit ownership banner, and make the output byte-stable across repeated
  runs.
- Test no-cheat, one-cheat, multiple-cheat, invalid export, duplicate export,
  stale output, and nested definition-directory cases.

Completion evidence (2026-08-29): `scripts/cheat-manifest.js` discovers nested
`src/cheats/definitions/**/*.cheat.js` modules with exactly one named `*Cheat`
export, normalizes paths, sorts deterministically, rejects duplicate exports, and
renders static imports plus a frozen descriptor array with a never-edit banner.
`generate:cheat-manifest` writes and `check:cheat-manifest` performs a read-only
byte comparison; the latter passes for the current zero-cheat production
manifest. Tests use the production generator for empty, one/multiple, nested,
invalid, duplicate, stale, read-only, byte-stable, and generated-catalog cases.
The existing build invokes generation before validation/esbuild. The release
build itself was not run because it also bumps version and distribution outputs.

### [x] CHEAT-FACTORY-CATALOG-03

- Add a runtime catalog that consumes the generated descriptor array and rejects
  duplicate IDs, duplicate effective global aliases, invalid config references,
  and duplicate placement keys.
- Provide deterministic selectors such as `listCheats()`, `getCheat(id)`, and
  `listCheatsForSection(section)` strictly for composition and tests.
- Keep manifest imports and catalog construction free of registration side
  effects; the explicit builder owns registration after bootstrap prerequisites.
- Unit-test minimal, full, malformed, duplicate, legacy, generated-order, lookup,
  grouping, and side-effect-free import cases.

Checkpoint: adding a fixture cheat module makes manifest check fail until the
manifest is regenerated; afterward descriptors/catalog import under Node without
a DOM or SugarCube and without starting application behavior.

Completion evidence (2026-08-29): `src/cheats/catalog.js` validates generated or
explicit descriptor arrays against production definitions and central config,
rejecting duplicate stable IDs, effective aliases, full placement keys, and
unknown config paths. Its deterministic `listCheats`, `getCheat`, and
`listCheatsForSection` selectors preserve descriptor identity and return fresh
lists. `src/cheats/index.js` composes the generated manifest without registering
anything. Catalog/manifest imports pass in a Node process with no DOM or
SugarCube and add no globals. The unified gate passes with 130 tests, 128
passing, zero skipped, and the two existing server-save todos.

## Wave 4 — Explicit runtime and control context

### [x] CHEAT-FACTORY-CONTEXT-01

- Build one context factory from an explicit descriptor, active runtime adapter,
  narrow config facade, mounted control scope, operation signal, reason, event,
  and allowed services.
- Normalize the current `EngineAdapter` methods into the documented `game`
  surface without a hidden global lookup.
- Add `variables()`, `get()`, `set()`, `has()`, `setup()`, and `passage()` adapter
  contract tests for SugarCube.
- Make missing runtime readiness and missing paths return/throw stable, tested
  outcomes. Do not allow a null `getVars()` crash to masquerade as a UI success.
- Implement local control lookup rooted at the cheat's mounted node. Do not use
  document-wide `byUiId()` in new descriptor callbacks.
- Ensure two mounted controls with the same local key in different cheats cannot
  affect one another.
- Scope abort signals and cleanup ownership to one descriptor instance.
- Document the exact SugarCube call path beside the context API.
- Prove config reads/writes use the declared central path/scope and cannot be used
  as an alternate route to arbitrary SugarCube game variables.

Checkpoint: a test callback can mutate a fake engine through `context.game`, and
the same callback works against the SugarCube adapter without importing any
SugarCube module from the cheat definition.

Completion evidence (2026-08-29): `src/cheats/runtime/context.js` constructs one
frozen callback context exclusively from an explicit descriptor, adapter, config
provider, mounted controls, operation signal, reason/event, feedback, and the
allowed scheduler/logger services. `game-context.js` normalizes both current
SugarCube-style adapters and the test adapter to `variables/get/set/has/setup/
passage` without global discovery; unavailable runtimes and writes below missing
parents throw stable typed errors while missing reads return `undefined` and
`has` returns false. SugarCube contract tests exercise every method through the
same facade used by fake-runtime callbacks. `control-scope.js` resolves local
keys only beneath the descriptor root; the existing cross-cheat repeated-key
tests now run through it. The descriptor harness now uses the production context
and control scope, so callback, cleanup, disposal, and abort tests cover the
production boundary. The config facade rejects undeclared schema paths including
game variables and preserves provider scope. `docs/CHEAT_FACTORY_CONTEXT.md`
documents the exact callback-to-SugarCube route. The unified gate passes with
134 tests, 132 passing, zero skipped, and two named server-save todos.

## Wave 5 — Descriptor renderer and action outcomes

### [x] CHEAT-FACTORY-RENDERER-01

- Add a descriptor-aware renderer or a narrow adapter into the existing metadata
  renderer; do not maintain two permanent control component systems.
- Render `meta.controls` using local keys and a descriptor-owned root marker.
- Resolve `action: 'set'` against the same descriptor's `actions.set` before
  mounting an interactive control.
- Bind callback functions/context directly for new descriptors. Use the global
  dispatcher only for declared legacy aliases and application shell commands.
- Await sync and async handlers consistently and disable/reject duplicate action
  execution only where needed.
- Normalize handler results into a single `{ ok, message, variant, refresh }`
  outcome contract.
- Show success feedback only when the handler reports success. Surface validation
  failure, unavailable runtime, and thrown errors distinctly.
- Keep destructive-action confirmation policy, but attach policy to stable cheat
  IDs or explicit descriptor metadata rather than accidental action strings.
- Ensure teardown removes listeners and mounted control references for exactly
  one descriptor instance.
- Test keyboard, input, change, toggle, button, async, failure, confirmation, and
  teardown behavior.

Checkpoint: a new one-shot descriptor renders, calls its local function without a
global action-map entry, mutates a fake runtime, reports the true outcome, and
tears down cleanly.

Completion evidence (2026-08-29): `src/cheats/runtime/renderer.js` mounts
descriptor controls beneath one `data-cheat-id` root and reuses the production
Wave 4 control/context boundaries. It resolves and binds local actions directly,
with no global action-map registration; toggle controls delegate to the explicit
toggle service. Sync and async work is awaited and duplicate suppression is
scoped to the originating control, allowing two controls to share one action.
`action-outcome.js` distinguishes success, validation, blocked runtime or
confirmation, and thrown errors; feedback reflects the normalized result and
only successful actions can request after-action sync. Destructive confirmation
is explicit `meta.confirmation` metadata and is validated by the production
factory. Disposal runs lifecycle cleanup, aborts, removes listeners, and removes
only that descriptor root. Production integration tests cover button, keyboard,
input, range, select/change, toggle, async deduplication, validation, unavailable
runtime, confirmation cancellation, thrown errors, refresh, and isolated
teardown. `docs/CHEAT_FACTORY_RENDERER.md` records the author/runtime behavior.
The legacy metadata renderer remains temporarily for shell compatibility until its Wave
11 removal gate; descriptor controls have one production component path. The
unified gate passes with 139 tests, 137 passing, zero skipped, and two named
server-save todos.

## Wave 6 — First vertical slices

### [x] CHEAT-FACTORY-VERTICAL-SLICE-01

Progress evidence (2026-08-30): three real convention-exported production
descriptors now cover Money (`player.money`), Body Size (`player.body-size`), and
one-shot maximum harmony (`world.max-harmony`). The generated manifest/catalog
contains all three without a hand-edited registry. Production-renderer parity
tests cover Money success/invalid input, Body Size select mutation/derived label,
harmony mutation, and missing `bodysize` applicability that disables only the
affected descriptor root with a useful reason. Migration ownership records these
as evidenced descriptor owners. Wave 10 now mounts the catalog, filters their
duplicate legacy controls, and registers `legacy.actionIds`. The duplicated
`moneyset`, `bodyset`, `max_harmony`, and `max_Ferocity` global map entries and
implementations were physically retired after parity coverage; their aliases now
resolve only through descriptor compatibility data.
The named NPC pregnancy migration subsequently supplied a confirmed
broken-to-fixed slice: removing one legacy lock stopped every remaining lock job,
while the descriptor retains scheduling until the final lock is removed. Browser
parity remains unrecorded. See
`docs/CHEAT_FACTORY_VERTICAL_SLICES.md`. Real-game vanilla and DoLP browser
evidence remains a release-verification checkpoint under Wave 12 rather than an
open implementation item for this wave.

Code-complete audit (2026-09-06): the four initial slices now have no duplicate
global dispatcher entries or legacy mutation implementations. Historical
behavior is retained as a frozen parity oracle and baseline inventory record;
runtime compatibility IDs resolve exclusively through descriptor aliases. Lint,
the 61-cheat manifest drift check, ownership/parity tests, and the complete
factory gate pass with 182 tests, 180 passing, and 2 tracked server-save TODOs.
The implementation wave is complete; the real-game vanilla/DoLP browser checkpoint
remains unrecorded and is carried by Wave 12.

- Select high-priority, reproducible broken cheats from the Wave 1 inventory as
  the first real migration targets once the minimum factory/context/renderer
  path exists. Fix their documented intended behavior instead of preserving the
  broken legacy result.
- Migrate Money as the canonical bound input/set example, preserving current
  presentation and the `moneyset` legacy alias only where required. If Money is
  already working, keep it as a contract example rather than allowing it to
  displace the selected broken-cheat fixes.
- Migrate Body Size as the canonical select/action plus derived-label example.
- Migrate one simple one-shot action that has no custom hydration.
- Migrate one inapplicable/missing-path example and prove only its controls are
  disabled with a useful reason.
- Co-locate each slice's definition, callbacks, required paths, feedback, and
  refresh behavior in its primary module.
- Remove the migrated slices from global method/fetcher maps once their temporary
  aliases are registered by descriptor compatibility data.
- Add side-by-side parity tests for old and new state mutations before deleting
  the old path for working cheats; use intended-behavior regression tests for
  confirmed broken cheats.
- Publish the first API and recipe documentation from the proven slices, including
  one broken-to-fixed troubleshooting example.
- Measure authoring touch points: adding the canonical one-shot example must
  require one conventionally exported definition module plus generated-manifest
  validation, not a hand-edited catalog or cross-cutting registry.

Checkpoint: browser-test the slices in a real SugarCube game. Stop if authors
still need to inspect or edit more than the cheat module for normal authoring
work; generated output and focused tests are expected verification artifacts.

## Wave 7 — Bindings, dynamic options, and refresh ownership

### [x] CHEAT-FACTORY-REFRESH-01

Progress evidence (2026-08-30): the production renderer now owns scalar binding
hydration and opt-in typed writes, protects active edits, evaluates dynamic option
sources with explicit callback context and stable fallbacks, coalesces refreshes,
skips hidden automatic sync, exposes declared section-open/runtime-tick triggers,
and emits sanitized cheat-ID/trigger diagnostics. `world.npc-trait-editor` is the
real dynamic-select/NPC-lookup slice; Body Size supplies the computed-label slice.
Focused tests cover pregnancy-shaped dynamic data and fallback behavior. All
retained fetchers and their reasons are recorded in
`docs/CHEAT_FACTORY_REFRESH_OWNERSHIP.md`. Completed 2026-08-30: the builder makes
the NPC descriptor active, and named/stored NPC pregnancy managers now own dynamic
lists, selected-day hydration, mutation, locking, and scoped scheduling. Their
section fetchers were removed. The migration also fixes and tests the legacy bug
where unlocking one NPC stopped scheduling every remaining NPC lock.

- Move scalar read/write binding into the descriptor renderer/runtime so simple
  controls do not require fetcher functions.
- Define refresh triggers precisely: initial mount, section open, after successful
  action when requested, runtime tick only when explicitly declared, and manual
  refresh for tests/compatibility.
- Coalesce refresh work per visible section and avoid running hidden-section
  sync unless a descriptor explicitly needs it.
- Migrate representative computed-label, dynamic-select, NPC lookup, and
  pregnancy-list cheats before finalizing the sync API.
- Pass selection/event context directly to actions and sync; avoid re-querying
  global DOM IDs to learn which option changed.
- Give option sources an explicit runtime context and stable fallback for missing
  data.
- Prevent sync from overwriting an actively edited input unless the descriptor
  opts into that behavior.
- Replace manual action-to-fetcher calls with returned `refresh: true` or a
  descriptor-local explicit sync call.
- Instrument sync failures by cheat ID and trigger without logging game-state
  values.
- Remove migrated functions from `features/fetchers/index.js` arrays and bound
  action maps as parity is established.

Checkpoint: every retained fetcher has a documented reason it cannot yet live as
a descriptor binding, option source, or sync function.

## Wave 8 — Toggle descriptor integration

### [x] CHEAT-FACTORY-TOGGLE-01

Completed 2026-08-30. Runtime composition now attaches `toggle` plus `effect`
descriptors to the existing scheduler through stable descriptor IDs and a narrow
SugarCube toggle store. It supports frame/daily cadence, cooldown, failure limits,
run-on-activate, user activation/deactivation, legacy-key migration, restoration,
watchdog rebuild, local mounted active state, and disposal that stops scheduling
while preserving user intent. Failure quarantine is descriptor-local and emits no
game-state data. The real `player.infinite-arousal` frame slice and
`world.maximum-church-tasks` daily slice require no additions to legacy toggle or
domain maps. Production integration tests cover save/load-shaped restoration,
unknown descriptors, stable IDs across labels, failure isolation, repeated
injection, section remount, and persistence commit counts. Wave 10 now makes these
descriptors the live UI owners while retaining legacy keys only as migration
aliases. See `docs/CHEAT_FACTORY_TOGGLES.md`.

- Teach runtime composition to recognize `toggle` plus `effect` descriptors and
  register them with the existing scheduler.
- Use stable cheat IDs internally while preserving old persisted toggle keys
  through explicit migration aliases.
- Support `frame` and `daily` cadence, cooldown, maximum failures,
  `runOnActivate`, activation, deactivation, restore, and watchdog behavior.
- Keep scheduler execution observable by cheat ID and isolate one failing effect
  without clearing unrelated toggles unless the proven watchdog policy requires
  a broader recovery.
- Move active-state rendering out of global DOM-ID assumptions and into the
  mounted descriptor control scope.
- Ensure persistence commits happen exactly once per user transition and are
  suppressed during restoration as today.
- Define what disabling/disposal does to runtime scheduling versus persisted
  user intent.
- Migrate one frame toggle and one daily toggle as vertical slices before moving
  the remaining definitions.
- Test save/load restoration, legacy-key migration, absent descriptor, renamed
  display label, scheduler failure, repeated injection, and section remount.

Checkpoint: a new toggle is authored in one module with no entry in
`action-map-toggle.js`, `toggle-runtime.js`, or a domain action aggregate.

## Wave 9 — Domain-by-domain cheat migration

Cheat-by-cheat migration is complete. Renderer stabilization and browser
acceptance are tracked in `TODO_CHEAT_FACTORY_RENDERER_STABILIZATION.md`.

### [x] CHEAT-FACTORY-MIGRATE-01

Progress evidence (2026-09-05), packages 1–7D: player stats/body, Quick one-shot,
Quick daily/frame toggles, Stats editors, and all visible Misc controls now have primary
descriptor candidates for vitals/stat editing, Money, unlimited spray, Body Size,
natural features, balls, virginity, crime, parasites, and grouped
characteristics/fluids, all six selection-based Stats editors, and the combined
Wolfpack harmony/ferocity control, MC pregnancy/tentacle/child managers, and MC,
named-NPC, and stored-NPC pregnancy removal, plus farm editors, dynamic produce
inspection, conditional Vrel integration, and the bounded read-only diagnostics
replacement for `testAll`. Focused
production parity covers mutations, validation, derived labels, live selection
hydration, active-input protection, toggles, and related multi-control behavior.
The generated catalog contains 57 descriptors, and an executable ownership gate
now fails on either missing candidate descriptors or orphan generated exports.
Wave 10 now makes these generated descriptors the live owners and filters their
duplicate legacy controls. Physical metadata/action/fetcher deletion remains Wave
11 compatibility cleanup. Complex player controls still need browser smoke evidence.
See `docs/CHEAT_FACTORY_DOMAIN_MIGRATION.md`. Automated ownership now reports no
legacy-owned actions: Package 7D retired the final three unsafe diagnostics.
Visual/browser acceptance moved to the renderer stabilization plan so it does not
reopen the completed ownership migration.

- Migrate cheats in bounded domain packages rather than rewriting all sections
  in one change.
- Suggested order: player stats/body, world/school/fame, basic toggles, pregnancy
  managers, pregnancy/offspring dynamic UI, then debug/advanced tools.
- For each package, preserve visible order, labels, tooltips, feedback, keyboard
  behavior, required-path handling, state mutations, refresh timing, and toggle
  persistence.
- Delete migrated metadata rows, action-map entries, action-object methods,
  fetcher entries, and compatibility facade exports in the same package once no
  supported caller needs them.
- Keep complex shared domain algorithms as ordinary imported functions when
  multiple descriptors use them. `createCheat()` should own integration, not
  force large algorithms inline.
- Split multi-purpose legacy rows into logical descriptors only when behavior and
  ordering can remain clear; do not create one descriptor per decorative
  control.
- Track catalog parity against the Wave 1 inventory after every package.
- Regenerate and check the manifest after each package; fail if an inventory
  descriptor is absent from the generated catalog or an orphan export appears.
- Require focused unit/integration tests and one browser smoke pass per complex
  domain before proceeding.

Checkpoint: the inventory has no unclassified or multiply owned cheats, and each
migrated cheat has exactly one primary descriptor module.

## Wave 10 — Bootstrap, builder, catalog, and section cutover

### [x] CHEAT-FACTORY-CUTOVER-01

Completed 2026-09-06. Bootstrap compiles the generated catalog once
against `runtimeEngine.adapter`, registers generated legacy aliases before storage
restoration, and uses one repeatable catalog builder for Quick, Stats, and Misc.
The final catalog-only cutover replaced that temporary hybrid path: `cheat-init.js`
now requests only explicit application section shells, and the builder mounts every
descriptor directly in deterministic catalog order with per-cheat applicability,
local actions, refresh, and toggle composition. Modal teardown/remount and section
open route through the builder without duplicate instances or scheduler entries.
Bounded health reports total, applicable, mounted, disabled, failed, and
legacy-backed counts without state values. Integration coverage exercises one-time
compilation, alias registration, direct placement, remount, health, and teardown.
See `docs/CHEAT_FACTORY_BUILDER.md`.

- Make cheat runtime composition an explicit bootstrap step after the active
  runtime engine and required storage state are available.
- Import the generated manifest exactly once, create the validated runtime catalog,
  and build all descriptor UI/action/sync/toggle contributions before rendering
  sections or restoring enabled toggles.
- Pass `runtimeEngine.adapter` into composition; do not make the catalog discover
  SugarCube independently.
- Build Quick, Stats, and Misc content from catalog contributions plus explicit
  layout definitions.
- Move per-cheat required-path checks from `cheat-init.js` section-wide arrays to
  descriptors. Retain only genuine section-shell requirements centrally.
- Preserve deterministic placement through `location.section/group/order` and
  fail development tests on ambiguous ordering.
- Ensure repeated modal open, remount, reinjection, passage changes, and teardown
  do not duplicate actions, sync tasks, observers, or scheduler entries.
- Separate one-time catalog compilation/registration from repeatable UI mount and
  teardown so the builder does not rebuild every cheat on each modal open.
- Expose bounded catalog health: total, applicable, mounted, disabled, failed,
  and legacy-backed counts, with no SugarCube values.
- Keep broad storage/listener lifecycle features in their appropriate bootstrap
  system; do not wrap them in fake cheats.

Checkpoint: the generated manifest feeds one builder, the rendered cheat UI is
catalog-driven, and `cheat-init.js` no longer manually assembles per-domain cheat
metadata.

## Wave 11 — Legacy framework retirement

### [ ] CHEAT-FACTORY-LEGACY-CLEANUP-01

Progress (2026-09-06, descriptor compatibility retirement): removed `legacy`
objects from all 61 production descriptors and removed the field from the
`createCheat()` contract, catalog alias validation, builder alias registration,
toggle-key migration, runtime types, and test harness. The catalog builder's dead
hybrid-registry helpers were deleted. Stable descriptor IDs are now the only
action/control/persistence identity accepted by the descriptor runtime. The full
factory gate passes with 181 tests, 179 passing, and 2 tracked server-save TODOs.
This wave remains open for retirement of the separate global method/toggle/bound
maps, aggregate action facade, and fetcher facade.

Follow-up audit: removed the unreferenced
`features/listeners/runtime-observer-policy.js` compatibility re-export. The
canonical implementation remains `core/runtime-observer-policy.js`. Removed the
unused `firstload`, `alt_fetch`, and default fetcher compatibility exports; named
facades remain temporarily reachable through the global listener/action chain.

- Remove `METHOD_ACTIONS`, `TOGGLE_DEFINITIONS`, and cheat-specific
  `BOUND_ACTIONS` after catalog parity and compatibility evidence pass.
- Keep modal/navigation/search shell actions in a clearly named application UI
  command module rather than leaving them in a misleading cheat listener map.
- Remove the aggregate `cheatActions`/`mycode` facade when no supported external
  caller needs it; otherwise expose a generated, documented compatibility view
  with a removal boundary.
- Remove `hydrateCheatUi`, `hydratePregnancy`, `firstload`, and `alt_fetch` after
  all supported callers use catalog refresh.
- Remove legacy row factories and control overrides only after all migrated
  metadata is represented directly by descriptors/layout definitions.
- Reduce `core/feature-factory.js` to its actual broad-feature purpose and rename
  it if necessary to prevent confusion with `createCheat()`.
- Delete source-regex action validation after descriptor/catalog validation and
  tests cover executable parity.
- Remove temporary DOM/action/storage aliases only when their consumers and
  migration windows are explicitly proven absent.
- Update architecture, contributor, testing, debugging, and “developing a new
  cheat” documentation to show the one-module path.

Checkpoint: there is one authoritative generated manifest, one validated runtime
catalog, one descriptor runtime, and no second global map required to make a
catalog cheat work.

## Wave 12 — Verification and release evidence

### [ ] CHEAT-FACTORY-VERIFY-01

- Verify descriptor validation, catalog uniqueness/order, local control scoping,
  action outcomes, async actions, bindings, dynamic options, refresh triggers,
  applicability, missing paths, cleanup, and diagnostics.
- Verify one-shot, input/set, select/action, frame toggle, daily toggle, complex
  pregnancy manager, and debug tool behavior against Wave 1 parity evidence.
- Verify active SugarCube adapter calls and a fake adapter use the same public
  callback contract.
- Verify fresh state, existing saved toggles, legacy toggle keys, save/load,
  passage transitions, modal remount, repeated injection, and teardown.
- Verify unrelated application shell actions remain functional after cheat action
  maps are removed.
- Run manifest drift, config/action/catalog validation, lint, focused tests, the
  full test suite, build, bundle-size comparison, and `git diff --check`.
- Perform browser smoke tests against the supported DoL/runtime versions and
  record any engine-specific behavior at the adapter boundary.
- Confirm a new example cheat can be added with one exported module and generated
  manifest refresh, with no hand-edited catalog, global action, fetcher, or
  toggle-map edits.
- Verify all commands, paths, API fields, and copyable examples in the final
  contributor and architecture documentation.
- Confirm the test-suite and documentation workstream gates are complete and no
  migrated known-broken cheat remains represented by a skipped/todo assertion.
- Update changelog and release evidence only after all mandatory browser gates
  pass.

Checkpoint: the framework is release-ready and the documented author workflow
matches the executable architecture. Distribution generation and version bump
remain separate explicit actions.

## Test strategy

### Contract tests

- Minimal valid descriptors for each cheat classification.
- Unknown fields, duplicate IDs, duplicate controls, missing local actions,
  invalid refresh triggers, invalid toggle cadence/options, and alias collisions.
- Descriptor immutability without freezing external runtime objects.

### Runtime integration tests

- A fake adapter records the exact `get`, `set`, `variables`, `setup`, and passage
  calls made by a descriptor.
- A SugarCube-shaped fixture proves the adapter writes the expected nested state.
- Two descriptors reuse local keys without DOM/action collisions.
- Mounted controls receive the correct descriptor/event/signal/reason context.
- Handler failures and async rejection never show success feedback.

### Refresh and renderer tests

- Binding initialization and user writeback.
- Derived sync on each declared trigger and no undeclared trigger.
- Dynamic options preserve valid selection and report changed selection once.
- Focused inputs are not overwritten unexpectedly.
- Remount and teardown leave no duplicate listeners or scheduled refresh work.

### Toggle tests

- Activation/deactivation, frame cooldown, daily boundary, immediate activation,
  failure thresholds, restore suppression, persistence, and legacy-key mapping.
- Display-label changes do not affect persisted identity.
- Missing/removed descriptors fail safely and preserve recoverable saved intent.

### Migration parity tests

- Inventory-based test that every logical cheat is owned by exactly one legacy or
  descriptor path during coexistence and exactly one descriptor after cutover.
- State-before/state-after fixtures for representative complex mutations.
- UI order and visible label snapshots where they add meaningful protection.
- No migrated descriptor remains in old action, fetcher, or toggle registries.

## Documentation deliverables

- Update `src/ARCHITECTURE.md` with manifest generation/checking, catalog/builder
  composition, config ownership, callback context, SugarCube adapter path,
  refresh triggers, and toggle flow.
- Replace the current five-step “Developing a New Cheat” instructions with:
  create/export one descriptor module, regenerate/check the manifest, and add
  focused tests.
- Include copyable recipes for one-shot, bound editor, dynamic select, frame
  toggle, daily toggle, and complex shared-domain logic.
- Add a migration guide mapping legacy concepts to descriptor fields.
- Add a troubleshooting trace that begins at a local control key and ends at the
  active engine adapter, including how to inspect a failed action outcome.
- Document which abstractions are intentionally absent so future work does not
  recreate parallel action/fetcher registries.

## Explicit non-goals

- No rewrite of the underlying game logic merely to change how cheats are
  registered.
- No direct SugarCube globals in cheat definitions.
- No generic dependency-injection container, plugin system, workflow DSL,
  decorator framework, or event-bus replacement.
- No runtime filesystem discovery, dynamic imports, or import-order registration.
  Deterministic build-time manifest generation is required and is not runtime
  plugin discovery.
- No factory per control type when plain metadata is already readable.
- No requirement to inline large reusable algorithms inside descriptor objects.
- No conversion of modal navigation, storage bootstrap, or application settings
  into fake cheats.
- No implicit polling or observer creation for every descriptor.
- No duplication of live game variables into central config merely to make them
  globally accessible.
- No migration of existing save-backed CheatPlus state to GM/userscript storage
  during the factory rework.
- No persisted-key rename without an explicit compatibility and migration test.
- No permanent legacy dispatcher alongside the descriptor runtime.
- No generated distribution, release publish, or version bump in the framework
  implementation packages unless requested separately.

## Definition of done

- Every game cheat in the Wave 1 inventory has one primary `createCheat()`
  descriptor.
- A normal new cheat requires one conventionally exported module, generated
  manifest validation, and focused tests; it requires no hand-edited catalog,
  global action, fetcher, or toggle-map edit.
- The build-time manifest and runtime catalog are deterministic, drift-checked,
  side-effect-free on import, and exercised by the normal build/test commands.
- CheatPlus config has central defaults/schema and a narrow config facade, while
  live game values remain exclusively behind the engine adapter.
- Existing save-backed toggle intent and supporting CheatPlus state retain their
  save/load behavior through the storage adapter.
- The callback context visibly exposes the active engine adapter, and the
  SugarCube state path is documented and tested end to end.
- UI, actions, refresh, toggle behavior, feedback, applicability, and cleanup are
  co-located when they belong to the same logical cheat.
- Application shell actions and broad bootstrap features remain clearly separate.
- Legacy registries/facades are removed or have an evidenced, time-bounded
  compatibility reason.
- Every migrated known-broken cheat has a passing intended-behavior regression
  test and recorded fix decision.
- Contributor documentation contains verified one-shot, binding, sync, frame
  toggle, and daily toggle recipes using only the supported descriptor API.
- Full automated verification and required browser parity checks pass.
