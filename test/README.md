# CheatPlus Test Suite

## Purpose

The test suite protects the current framework while cheats move to the planned
`createCheat()` catalog. It distinguishes working behavior that must be preserved
from known-broken behavior that must be corrected. A broken result is never used
as the migration parity target merely because the legacy code currently produces
it.

## Commands

| Command                         | Scope                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `npm test`                      | Every `*.test.js` file, run serially for global DOM/runtime isolation |
| `npm run test:unit`             | Core policies and runtime units                                       |
| `npm run test:integration`      | Renderer and cross-module integration                                 |
| `npm run test:regression`       | Regressions and explicitly tracked broken behavior                    |
| `npm run test:characterization` | Executable legacy cheat behavior used for migration                   |
| `npm run test:baseline`         | Inventory completeness and status/evidence rules                      |
| `npm run test:contract`         | Proposed descriptor, catalog, config, manifest, and callback contract |
| `npm run test:parity`           | Legacy/descriptor observations and migration ownership gates          |
| `npm run test:toggle`           | Deterministic repeating-toggle lifecycle and persistence contract     |
| `npm run verify:cheat-factory`  | Lint plus the complete executable suite and recorded metric gate      |

The scripts pass quoted glob patterns to Node instead of directory paths. On the
current Node runtime, directory arguments are treated as test modules and fail
before discovering their contained tests.

Test files run with `--test-concurrency=1` because the existing application and
JSDOM harness temporarily install browser globals and use module-scoped runtime
registries. Descriptor-level tests can become concurrent later when the new
runtime supports fully isolated instances.

## Layout

```text
test/
  baseline/          legacy inventory, behavior status, and ownership checks
  characterization/ executable current cheat behavior for migration evidence
  contracts/         reusable descriptor/config cases for POC and production
  helpers/           JSDOM and temporary legacy source-inventory helpers
  integration/       renderer/runtime integration
  parity/            legacy-versus-descriptor observable behavior cases
  regression/        fixed bugs and explicit todo cases for known failures
  unit/              small policy/runtime units
  browser-smoke-checklist.md  versioned manual release evidence template
  full-suite-baseline.json    minimum coverage and allowed-todo budget
```

## Full-suite gate

`npm run verify:cheat-factory` is the supported read-only verification command.
It runs ESLint and every Node test, including manifest drift, descriptor/config,
catalog inventory, integration, regression, characterization, and parity cases.
It then rejects test/pass-count shrinkage, failures, cancellations, skips,
unexplained todos, or a run longer than the recorded generous ceiling. Resolving
an allowed todo and adding tests are accepted without weakening the baseline.

The target-scale lifecycle case creates one descriptor per legacy inventory
entry and performs three complete mount/action/dispose cycles. It checks DOM,
listener, catalog, and scheduler cleanup under a five-second local bound. Replace
the synthetic target-scale descriptors with the production catalog as ownership
migrates. Browser-only cases are tracked in `test/browser-smoke-checklist.md`.

This command deliberately does not run `npm run build`: the current build bumps
`build/version.json` and regenerates distribution files. Build output review and
`git diff --check` remain final-cutover gates in Wave 12, where those mutations
are explicitly in scope.

`test/helpers/legacy-metadata-inventory.js` parses the legacy metadata source only
to locate current action ownership during migration. It is not the target
validation architecture. Once all cheats are executable descriptors, catalog
validation must replace source-text discovery.

## `createCheat` POC harness

`test/helpers/cheat-descriptor-harness.js` is a test-only proof of the proposed
descriptor contract. It can mount one plain descriptor or a small explicit
catalog without starting injection, application bootstrap, the legacy dispatcher,
or the real toggle runtime.

The POC provides:

- a production-shaped fake runtime engine and `game` callback API;
- descriptor-scoped DOM controls addressed by local keys;
- direct local action invocation and DOM event wiring;
- normalized outcomes plus feedback and refresh recording;
- deterministic `mount`, `section-open`, `after-action`, `frame`, `daily`,
  `restore`, and `dispose` reasons;
- lifecycle cleanup and abort-signal assertions;
- a deterministic frame/cooldown/failure scheduler;
- an in-memory persisted-toggle store with operation history;
- shared dependencies and local-key isolation for a small descriptor catalog.

The POC deliberately does not implement production descriptor validation,
SugarCube adaptation, bindings, applicability, the real metadata renderer,
storage migration, or the existing scheduler's watchdog. Those belong to their
implementation waves and contract tests.

This helper must not become a second runtime. When `createCheat()` and production
catalog composition exist, the descriptor fixtures and callback assertions must
be routed through those public entry points. POC-only normalization, mounting, or
toggle behavior must then be removed or reduced to thin test drivers.

## `createCheat` contract POC

`test/contracts/cheat-contract-cases.js` is the reusable input table for the
public contract. `test/helpers/cheat-contract.js` and
`test/helpers/cheat-manifest-harness.js` are test-only oracles used while the
production factory, manifest tool, config schema, and catalog do not yet exist.
They lock the current design decisions without adding runtime code to `src/`.

The executable contract currently requires:

- a lowercase namespaced `id`, deterministic `location`, labeled `meta`, and at
  least one control;
- at least one executable contribution through `actions`, `effect`, or `sync`;
- local action resolution, unique local control keys, known refresh triggers,
  and `frame`/`daily` toggle validation;
- optional config references as an array of centrally declared CheatPlus paths;
- explicit legacy action/control/toggle aliases with catalog-wide collision
  checks;
- one deterministic generated manifest for conventionally named `*.cheat.js`
  modules exporting `*Cheat` descriptors;
- callback context containing `game`, `config`, scoped `controls`, `event`,
  `signal`, `reason`, feedback, and the allowed scheduler/logger services.

Wave 3 routed descriptor, manifest, and catalog contract cases through the
production `src/cheats/` and `scripts/cheat-manifest.js` entry points. Generator
tests write only to isolated operating-system temporary directories. The obsolete
test-only descriptor, manifest, and catalog implementations were removed; the
remaining descriptor harness is a runtime POC until the production builder exists.

## Migration parity contract

`test/helpers/cheat-parity-harness.js` gives legacy and descriptor runners deep-
cloned equivalent starting state. Each runner returns the same observable shape:
state, action outcome, visible control values, refresh requests, applicability,
and cleanup. A `working` case must match the legacy observation exactly. A
`known-broken` case must differ from the broken legacy observation and match an
explicit intended observation instead.

The initial real POC parity cases cover Money success/rejection and repeated
infinite-arousal effects. They do not make their descriptors production owners;
the machine-readable ownership inventory still records every current cheat as
legacy-owned. When a production descriptor enters migration, its ownership row
must provide its stable descriptor ID and parity or intent-correction evidence.
Two active paths require a temporary coexistence reason and a concrete legacy
removal gate. Every bug recorded on an ownership row must name its focused
regression test.

The server-save Export/Import controls remain application integrations and remain
`todo`. A synthetic known-broken parity case tests the intent-correction policy
without pretending those controls have been implemented.

## Repeating-toggle contract

`test/integration/cheat-toggle-contract.test.js` locks the POC lifecycle for
`frame` and `daily` descriptors with deterministic scheduler time—never real
delays. Toggle persistence uses the stable descriptor ID. Restoration reads that
ID first; if only an explicit legacy key exists, it writes the stable ID and
removes the legacy key exactly once. An ordinary restore never rewrites persisted
state or registers/runs the same active callback twice.

The contract distinguishes two failure paths:

- Reaching one descriptor's `maxFailures` quarantines only that toggle, removes
  its persisted enabled intent, updates its scoped control, and leaves unrelated
  toggles running.
- A broader watchdog restoration clears scheduler registrations and rebuilds
  every persisted toggle once. It does not duplicate callbacks or persistence
  commits.

Disposal unregisters runtime work but preserves enabled intent, allowing a fresh
reinjection to restore it. Explicit user disable unregisters work and removes the
stable persisted ID. After either disable or dispose, the old descriptor instance
cannot perform another scheduled game mutation.

## Behavior statuses

Each entry in `test/baseline/legacy-cheat-inventory.js` uses exactly one status:

| Status              | Meaning                                                          | Migration assertion                                |
| ------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| `working`           | Focused automated or recorded browser evidence confirms behavior | Preserve the tested outcome                        |
| `known-broken`      | The failure and intended result are both evidenced               | Fix to the intended result                         |
| `partially-working` | A proven path works while another proven path fails              | Preserve working paths and fix documented failures |
| `unverified`        | No reliable behavior evidence exists yet                         | Characterize before migration                      |

A status other than `unverified` requires an evidence location and a concise
intended-behavior statement. Do not mark a cheat `working` based only on reading
its implementation.

## Initial baseline

Recorded on 2026-08-29 with Node.js 24.16.0:

- The original `npm test` command failed during discovery because it passed
  `test/unit`, `test/integration`, and `test/regression` as modules.
- After adding the descriptor harness, executable contract, and parity packages,
  plus the repeating-toggle lifecycle and full-suite packages, the suite reports
  172 tests: 170 passing, zero skipped, and two explicitly allowlisted todo cases.
- `npm run verify:cheat-factory` passes lint, manifest drift validation, and the
  172-test metric gate in 29 seconds on the recorded environment. Its duration ceiling is 60 seconds
  to catch hangs or major regressions without treating normal host variance as a
  benchmark failure.
- `npm run lint:actions:strict` fails because server-mode metadata exposes
  `save_data` and `load_data` without registered dispatcher handlers.
- The initial `npm run lint` baseline found an unused `getNpcNameList` import in
  `src/features/cheat/toggle-domain-basic-actions.js`; the test-foundation package
  removed that behavior-neutral import, and lint now passes.
- A build baseline was not generated because this framework package does not
  authorize distribution regeneration. Run the build only when its output scope
  is explicitly accepted for the implementation/release package.

The first characterized working behaviors are:

- Money accepts a finite numeric input and replaces `State.variables.money`.
- Money rejects a non-number without changing the existing value.
- Infinite arousal restores `State.variables.arousal` to `10000` every time its
  effect executes.

The first confirmed broken controls are the server-save Export and Import
buttons. Their metadata and start-menu policy exist, but no `save_data` or
`load_data` dispatcher handler is registered. Regression cases remain `todo`
until intended server communication is implemented and testable.

## Browser-only evidence gaps

The following behavior must remain `unverified` until a representative fixture
or browser reproduction exists:

- real passage transitions and save/load lifecycle ordering;
- current supported DoL variable/setup shapes across game versions;
- local server Export/Import transport and error behavior;
- complex named/stored NPC, fetus, offspring, and pregnancy manager workflows;
- multiple active frame/daily toggles under real click, keyup, and day changes;
- userscript Shadow DOM injection and reinjection in supported managers;
- compatibility globals consumed by external pages or scripts.

For a browser-only failure, record the runtime/game version, starting passage and
minimal state prerequisites, exact controls/actions, observed result, intended
result, and whether the failure is deterministic. Never attach a complete save or
personal game-state dump.

## Adding migration evidence

1. Add or update the inventory entry with its classification and current owners.
2. Reproduce behavior using the smallest synthetic SugarCube state possible.
3. Add a characterization test for working behavior, or a regression `todo` with
   the intended assertion for confirmed broken behavior.
4. Change the status only after the evidence exists.
5. When migrating, compare working behavior with the descriptor implementation.
   For broken behavior, assert the intended result instead.
6. Remove the legacy owner only after the new path passes the applicable test and
   the inventory points to exactly one active implementation.
