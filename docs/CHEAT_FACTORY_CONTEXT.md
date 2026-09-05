# Cheat Callback Context

Every callback receives one frozen context created from explicit builder inputs:

```text
descriptor + active adapter + declared config + mounted control root
           + operation AbortSignal + reason/event + allowed services
                                      |
                                      v
                             CheatCallbackContext
```

`context.game` normalizes the active adapter to `variables()`, `get(path)`,
`set(path, value)`, `has(path)`, `setup(path)`, and `passage()`. It never looks up
an engine global. For SugarCube the exact call path is:

```text
cheat callback -> context.game -> scAdapter -> core/sugarcube/state or selectors
               -> SugarCube.State.variables / SugarCube.setup
```

An unavailable runtime throws `CheatRuntimeUnavailableError`. Reading a missing
path returns `undefined`, `has()` returns false, and writing below a missing
parent throws `CheatGamePathError`; callbacks cannot accidentally report a null
runtime mutation as successful.

`context.controls` resolves `data-cheat-control` keys only inside that mounted
descriptor root. The same key may safely exist in other roots. Generated DOM IDs
and document-wide lookup are not part of the API.

`context.config` allows only paths listed by the descriptor's `config` array and
delegates type/scope/storage ownership to the central provider. It cannot read a
live game path such as `money`; those values belong to `context.game`.

Each mounted instance owns its AbortController and cleanup. The context exposes
only the supplied scheduler and logger services. Disposal aborts that instance
without affecting another descriptor.
