# Toggle descriptors

A repeating cheat is authored in the same module as its UI and effect. Runtime
composition recognizes `toggle` plus `effect`, mounts active state inside the
descriptor control scope, and registers the effect with the existing scheduler.

```js
export const infiniteExample = createCheat({
  id: 'player.infinite-example',
  location: { section: 'quick', order: 10 },
  meta: {
    label: 'Infinite Example',
    controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }],
  },
  toggle: {
    cadence: 'frame',
    cooldownMs: 100,
    maxFailures: 5,
    runOnActivate: true,
  },
  effect({ game }) {
    game.set('example', 100);
  },
});
```

Use `cadence: 'daily'` for effects that should run once when the scheduler observes
a new game day. `runOnActivate` controls the immediate first execution.

## Ownership and persistence

- The descriptor ID is the scheduler and persistence identity. Display labels can
  change without affecting restoration.
- Retired pre-catalog keys are ignored. A user transition writes or removes the
  stable descriptor ID once, and restoration does not rewrite it.
- Disposal unregisters runtime work but preserves persisted intent, allowing a
  section remount or reinjection to restore exactly one scheduler entry.
- An unavailable descriptor leaves its persisted entry untouched. It can restore
  after the descriptor becomes available again.
- A repeated effect failure removes only that descriptor's persisted intent and
  local active state; unrelated toggles remain active.
- A scheduler watchdog may clear registrations and call `toggleRuntime.restore()`
  to rebuild attached persisted descriptors without persistence commits.

The production slices are `player.infinite-arousal` (frame) and
`world.maximum-church-tasks` (daily). Neither descriptor requires an entry in a
global action map, toggle map, or domain action aggregate.
