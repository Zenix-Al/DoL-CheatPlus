# Descriptor Renderer and Action Outcomes

## Production Rendering Path (Package UI-8)

All cheat rendering is now accomplished through a single, descriptor-first pipeline:

1. **Cheat initialization** (`src/features/cheat-init.js`) calls `createCheatRuntimeBuilder()`
2. **Builder** (`src/cheats/runtime/builder.js`) receives shell definitions and the cheat catalog
3. **Mount** (`src/cheats/runtime/renderer.js`) calls `mountCheatDescriptor()` for each descriptor

## `mountCheatDescriptor()` — Descriptor Rendering

`mountCheatDescriptor()` renders migrated cheats beneath one `data-cheat-id`
root, creates the scoped control API, and binds events directly to local action
functions. It does not register descriptor actions in the global dispatcher.

### Event Binding

Buttons use `click`; inputs and ranges use `input`; selects and toggles use
`change`. A control may declare an explicit event such as `keyup`. Pending work
is deduplicated per mounted control, preventing repeated async activation while
allowing two controls to share one action.

### Action Results

Results normalize to `{ ok, kind, message, variant, refresh }`, where `kind` is
`success`, `validation`, `blocked`, or `error`. Runtime unavailability and
cancelled confirmation are blocked; thrown errors are errors. Feedback reflects
the normalized result. Only successful actions may request `after-action` sync.

### Destructive Confirmation

Destructive confirmation is declared as `meta.confirmation` and injected into
the renderer. It is never inferred from a legacy action string.

### Lifecycle and Disposal

Disposal runs lifecycle hooks, aborts the instance, removes its listeners and
cleanup callbacks, and removes only its root. Toggle controls forward to the
explicit toggle service; Wave 8 owns scheduler and persistence composition.

---

## Legacy Renderer (Removed in Package UI-8)

The hybrid metadata renderer and legacy metadata registries were frozen after
Package UI-7 and deleted after browser acceptance testing in Package UI-8.
They are no longer part of the codebase.

**Deleted files (reference only):**
- `src/ui/renderers/metadata-renderer.js`
- `src/ui/renderers/metadata-renderer-*.js` (event wiring, missing policy, runtime binding, primitives)
- `src/ui/metadata/` (all legacy metadata registries)
- `test/integration/cheat-runtime-builder.test.js` (hybrid registry tests)
- `test/baseline/legacy-cheat-inventory.test.js`, `wave1-baseline.test.js`, `retired-diagnostics.test.js`
- `test/helpers/legacy-metadata-inventory.js` (characterization helper)

All legacy renderer code and test coverage was removed after the production
cutover audit confirmed that bootstrap and the runtime builder use only the
descriptor-first path and no longer invoke hybrid rendering functions.
