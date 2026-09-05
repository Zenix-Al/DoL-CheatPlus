# Cheat factory diagnostics

“Run Diagnostics” replaces the legacy `testAll` action. It is a bounded,
read-only support facility; it is not a mechanism for executing cheats as tests.

## Probe contract

Create probes with `createDiagnosticProbe({ ... })`. A probe declares exactly:

| Field        | Contract |
| ------------ | -------- |
| `id`         | Stable lowercase namespaced ID. |
| `label`      | Non-empty display label. |
| `scope`      | `catalog`, `runtime`, `aliases`, `scheduler`, or `config`. |
| `applicable` | Optional read-only predicate. False produces `blocked`. |
| `run`        | Required read-only callback returning sanitized status metadata. |
| `timeoutMs`  | Required positive integer timeout. |

Results use `pass`, `warning`, `fail`, or `blocked`, plus an optional bounded
message. The runner executes probes sequentially with independent applicability,
exception, invalid-result, and timeout handling. It returns frozen results and
aggregate counts.

## Capability boundary

The builder composes a dedicated runner and exposes only
`context.services.diagnostics` to the Developer Tools descriptor. The service
offers `runAll`, `formatReport`, and probe listing. It does not expose the action
dispatcher, runtime window, catalog mutation, storage, or arbitrary functions.

Probes may perform bounded reads from injected providers. They must not call:

- Descriptor actions, effects, or lifecycle callbacks.
- Toggle execution or activation methods.
- Game/config setters or persistence methods.
- Arbitrary global or enumerable functions.
- Destructive controls or repair routines.

## Production probes

The initial registry checks catalog identity, unavailable required paths, bounded
builder health, alias registration count/uniqueness, scheduler ownership count,
and config-reference/schema consistency. Reports contain only counts, stable probe
IDs, statuses, and controlled messages. They exclude SugarCube values, save data,
NPC data, arbitrary exceptions, and runtime object serialization.

## Developer UI

The descriptor initially renders only “Show Developer Tools”. Reveal state is
held against the mounted control scope, is never persisted, and is discarded on
dispose/remount. After reveal, “Run Diagnostics”, “Copy Report”, and the report
field become available. The temporary `testAll` alias is blocked until reveal.

Copy uses `navigator.clipboard.writeText` when available. Otherwise the report
field is focused and selected for manual copying; deprecated `execCommand` is not
used.

## Test guarantees

Contract tests reject unknown, malformed, duplicated, and unsafe-scope probe
declarations. Integration tests cover pass/blocked/thrown/timeout isolation,
partial failures, absent diagnostics service, repeated execution, remount reset,
clipboard fallback, bounded exception handling, and before/after game snapshots.
Production-probe tests prove scheduler effects are not executed.
