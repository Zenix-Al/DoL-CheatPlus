# `createCheat()` Contract

Contract version: 1

A cheat file exports one named descriptor from `src/cheats/definitions/**/*.cheat.js`:

```js
export const moneyCheat = createCheat({
  id: 'player.money',
  location: { section: 'stats', group: 'player', order: 10 },
  meta: {
    label: 'Money',
    controls: [
      { key: 'value', type: 'input', binding: { path: 'money', coerce: 'number' } },
      { key: 'set', type: 'button', label: 'Set', action: 'set' },
    ],
  },
  actions: {
    set({ game, controls }) {
      game.set('money', controls.number('value'));
      return { ok: true, message: 'Money updated.', refresh: true };
    },
  },
  sync({ game, controls }) {
    controls.setValue('value', game.get('money'));
  },
  refresh: ['mount', 'section-open'],
});
```

`id` is permanent cheat and persistence identity. `location` is the complete
ordering key: section order, numeric order, group, then ID; import order never
matters. `meta` declares UI. Control keys and action names are local to one
descriptor. Rendered IDs are runtime details; authors never construct them.

`actions` handle user intent. `meta.confirmation` optionally declares explicit
destructive-action confirmation for this stable cheat identity. `sync` hydrates
UI only on named `refresh` events.
Neither declaration creates intervals, animation frames, or document listeners.
Repeating work requires `toggle` plus `effect`; `frame` and `daily` are scheduler
policies, and the stable descriptor ID is the persisted key. Lifecycle hooks run
only when the explicit builder mounts/disposes an instance and receive an abort
signal. Cleanup/runtime state belongs to the mounted instance, never the frozen
descriptor.

Callbacks receive `context.game` as the only live game-state surface and the
narrow `context.config` facade for paths declared in `config`. Game bindings such
as money, date, NPCs, and pregnancy are never configuration. All retained config
is save-backed through the SugarCube adapter during cutover.

`context.services.diagnostics` is the only developer-diagnostics capability. It
exposes the bounded probe runner, never the catalog, dispatcher, runtime window,
or arbitrary callbacks. Diagnostic probes are read-only and may return only
sanitized status metadata.

An action may return nothing/true for success, false for validation failure, or
an outcome with `ok`, `kind`, `message`, `variant`, and `refresh`. Promise results
are awaited. Throws/rejections become error outcomes. `kind: 'blocked'` means the
action was valid but runtime prerequisites denied it.

The retired `legacy` descriptor property is rejected as an unknown field. Catalog
validation rejects duplicate IDs and complete placement keys.
The manifest generator discovers `*.cheat.js` and exactly one conventional named
`*Cheat` export per file. Generated output is deterministic, begins with a
never-edit ownership banner, and has separate write/check commands. Wave 3 owns
that generator and the pure `createCheat()` implementation.
