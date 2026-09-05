# Wave 11 legacy retirement handoff

Status date: 2026-09-06

This document is the durable handoff for completing Wave 11 before a separate
project-structure cleanup. Do not mix directory reshaping or broad renames into
this retirement pass.

## Completed

- All 61 production cheat descriptors are catalog-owned and render through the
  descriptor runtime.
- The `legacy` property was removed from every `createCheat()` object and from
  contract validation, runtime types, catalog validation, builder composition,
  toggle restoration, and test helpers.
- Stable descriptor IDs are the only supported cheat action, control, scheduler,
  and persistence identity.
- Descriptor action aliases and old persisted toggle-key migration were removed.
- Dead hybrid registry/filter/slot helpers were removed from the catalog builder.
- The unused `features/listeners/runtime-observer-policy.js` compatibility
  re-export was deleted; `core/runtime-observer-policy.js` is canonical.
- The generated catalog contains 61 cheats. The last complete factory gate after
  descriptor retirement reported 181 tests, 179 passing, zero failed/skipped,
  and two tracked server-save TODOs.
- Distribution version `2.0.44` contains the descriptor-property retirement.

## Current legacy dependency root

`core/injection.js -> features/bootstrap.js -> features/registry.js ->
features/listeners/index.js`

The listener index still imports:

- `features/actions.js` (`cheatActions`/`mycode` aggregate);
- `features/fetchers/index.js` (`hydrateCheatUi`, `hydratePregnancy`, and section
  wrappers);
- `features/listeners/action-maps.js`, which imports `METHOD_ACTIONS`,
  `TOGGLE_DEFINITIONS`, and cheat-specific `BOUND_ACTIONS`;
- old toggle-domain and mutation modules reachable through the aggregate facade.

These modules are reachable today because the old listener framework imports
them. Reachability is not evidence that they should survive Wave 11.

## Required retirement order

### Package 11A — application-shell commands

- [ ] Replace `action-maps.js` with a narrowly named application command module.
- [ ] Keep only modal open/close, section navigation, search, floating history,
  sidebar, settings controls, and `init_interface` commands.
- [ ] Move history/sidebar helpers out of `world-actions.js`; they are application
  commands, not cheats.
- [ ] Keep server save/import commands wherever their existing feature currently
  owns them; do not represent them as cheats.
- [ ] Add a test proving all rendered shell `data-shell-action` values resolve.

### Package 11B — observer and scheduler ownership

- [ ] Replace `cheatActions.runitall()` calls with a focused runtime scheduler
  driver owned by the observer/bootstrap layer.
- [ ] Preserve frame coalescing, load suppression, daily boundary detection, and
  watchdog restoration through `createProductionCheatToggleRuntime().restore()`.
- [ ] On save/load/history transitions, reinitialize config and restore attached
  descriptor toggles without dispatching old toggle IDs.
- [ ] Remove `services/storage.js#reactivateToggles` and old toggle-state
  repository/engine dependencies after parity tests pass.

### Package 11C — global registries and facades

- [ ] Delete `METHOD_ACTIONS` and `action-map-methods.js`.
- [ ] Delete `TOGGLE_DEFINITIONS` and `action-map-toggle.js`.
- [ ] Delete cheat-specific `BOUND_ACTIONS`; descriptor controls already own
  change/input events and refresh.
- [ ] Reduce `action-map-schema.js` to application-command validation or delete it
  if direct registration is clearer and covered.
- [ ] Delete `features/actions.js`, including `cheatActions` and `mycode`.
- [ ] Delete old player, pregnancy, world, and toggle-domain action modules once
  no production import remains.

### Package 11D — fetchers and utility cleanup

- [ ] Make Quick/Stats/Misc navigation call only
  `getActiveCheatBuilder()?.sectionOpened(section)`.
- [ ] Delete `hydrateCheatUi`, `hydratePregnancy`, and
  the aggregate/default exports from `features/fetchers/index.js`.
- [x] Delete the unused `firstload` and `alt_fetch` compatibility aliases and the
  unused default fetcher export.
- [ ] Delete fetcher modules whose behavior is fully descriptor-local:
  `core-updates.js`, `misc-updates.js`, `offspring-updates.js`, and
  `pregnancy-updates.js` after confirming no production imports.
- [ ] Delete UI hydration utilities used only by those fetchers.
- [ ] Keep `features/utils/value-tree.js` while search actions use it; it is not a
  legacy cheat utility.
- [ ] Remove or rewrite characterization tests that import deleted implementations;
  retain frozen parity fixtures only where they still protect intended behavior.

### Package 11E — broad feature factory and documentation

- [ ] Decide whether `core/feature-factory.js` remains useful for storage/listener
  lifecycle. If retained, rename it in the later structure project—not during
  this pass—and document that it is unrelated to `createCheat()`.
- [ ] Delete obsolete source-regex action validation after catalog/shell command
  tests cover all executable ownership.
- [ ] Update `src/ARCHITECTURE.md`, `README.md`, contributor/testing/debugging
  documentation, and current factory docs to remove active legacy instructions.
- [ ] Keep Wave 1/baseline documents clearly marked as historical rather than
  silently rewriting migration evidence.

## Deletion gate

Before deleting a module:

1. `rg` must show no production import after the replacement path is implemented.
2. A descriptor or application-shell module must own every still-supported
   behavior.
3. Relevant focused tests must pass before and after deletion.
4. The complete factory gate must pass without new skips or TODOs.

Never delete all of `src/features`: bootstrap, catalog setup, observers, search,
and application commands still require a feature-level integration boundary.

## Verification commands

```powershell
npm run lint
npm run check:cheat-manifest
npm run verify:cheat-factory
git diff --check
npm run build
```

Also verify production retirement directly:

```powershell
rg -n "METHOD_ACTIONS|TOGGLE_DEFINITIONS|BOUND_ACTIONS|cheatActions|mycode|hydrateCheatUi|hydratePregnancy|firstload|alt_fetch" src
rg -n "legacy\s*:|descriptor\.legacy|legacyStorageKey" src/cheats test
```

## Completion checkpoint

Wave 11 is complete when the generated manifest feeds one validated catalog and
one descriptor runtime; the dispatcher contains application-shell commands only;
no global cheat action/toggle/bound map or aggregate cheat/fetcher facade is
required; stable descriptor IDs are the sole persistence identity; and the full
verification/build gates pass.

Project directory restructuring, naming cleanup, and larger module moves belong
to the next dedicated TODO after this retirement is stable.
