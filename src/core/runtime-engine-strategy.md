# Runtime Engine Strategy

This layer is the portability boundary for CheatPlus runtime boot.

## Goal

Adding a second backend should mean:

1. add one engine adapter
2. add one runtime engine profile
3. register that profile

It should not require edits across feature modules, UI modules, or listener wiring.

## Current Shape

- `src/core/sugarcube/adapter.js`
  - engine data access boundary used by the existing codebase
- `src/core/runtime-observer-policy.js`
  - runtime observer hooks used by document-level listeners
- `src/core/runtime-engine-sugarcube.js`
  - SugarCube runtime profile: detection, readiness checks, observer policy, adapter
- `src/core/runtime-engine-renpy-web.js`
  - RenPy-web runtime profile scaffold: registered and inert until backend wiring is defined
- `src/core/runtime-engine-registry.js`
  - runtime profile registry and active-engine selection
- `src/core/injection.js`
  - waits for a detected runtime profile, then waits for that profile's prerequisites
- `src/features/bootstrap.js`
  - consumes the selected runtime profile and applies its observer policy before starting features

## Runtime Engine Profile Contract

A runtime engine profile must provide:

- `id`
- `label`
- `detect()`
- `adapter`
- `observerPolicy`
- `hasCorePrerequisites()`
- `hasRuntimePrerequisites()`
- `describePrerequisiteState()`

## Migration Path For A Second Backend

Example target: `renpy-web`

1. Create a backend adapter

   - Path: `src/core/renpy-web/adapter.js`
   - Match the `EngineAdapter` typedef in `src/core/adapters/types.js`
   - Keep all backend globals isolated there

2. Create a backend runtime profile

   - Path: `src/core/runtime-engine-renpy-web.js`
   - Implement detection logic
   - Define readiness checks for minimal boot and full runtime boot
   - Provide a backend-specific `observerPolicy`

- Example scaffold exists at `src/core/runtime-engine-renpy-web.js`

3. Register the profile

   - Import it in `src/core/runtime-engine-registry.js`
   - Call `registerRuntimeEngine(...)`
   - Registration order is the precedence order when multiple profiles detect true

4. Keep feature modules unchanged

   - feature code should continue to depend on adapter/selectors only
   - if a feature needs new backend data, extend the adapter surface first
   - do not add backend conditionals in feature modules

5. Migrate backend-specific quirks behind the adapter/profile
   - passage/history/load detection belongs in observer policy or backend quirk helpers
   - runtime readiness belongs in the runtime profile

## Non-Goals

- Generic cross-engine gameplay abstraction in one pass
- Rewriting existing DoL-specific feature behavior
- Pretending all engines have identical lifecycle semantics

The portability target here is bootstrap/runtime strategy isolation, not full feature parity across engines.

## Current Scaffold Status

- A no-op RenPy-web profile is already registered.
- It will not affect current DoL/SugarCube boot unless a `RenPyWeb` global is present.
- It exists to prove the registry path and to provide a concrete starting point for full backend integration.
