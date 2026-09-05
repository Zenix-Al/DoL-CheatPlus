# Catalog builder and bootstrap

The application compiles the generated cheat catalog once during bootstrap. The
builder receives `runtimeEngine.adapter`; descriptors never detect SugarCube or
read a runtime global independently.

Bootstrap order is:

1. register application-shell dispatcher commands;
2. create and compile the catalog builder;
3. initialize storage;
4. start broad application observers;
5. mount descriptor sections when the modal UI is rendered.

Stable descriptor toggles restore when their mounted controls become available.

## Catalog-only section cutover

Cheat ownership migration and renderer stabilization are complete. For each Quick,
Stats, or Misc mount, the builder:

- renders the explicit application shell layout;
- mounts section descriptors in validated catalog order;
- applies each descriptor's own required-path policy;
- restores its local toggle state and refresh lifecycle.

No descriptor action, control, or persistence aliases are registered.

## Repeatable lifecycle

Catalog compilation is idempotent and one-time. Section
mounting is repeatable: an earlier mounted instance is disposed before replacement.
Closing the modal tears down local listeners, refresh work, and scheduler entries;
persisted toggle intent is retained and restored once on remount. Section navigation
calls descriptor `section-open` refresh.

`builder.health()` exposes only bounded counts:

```js
{
  total,
  applicable,
  mounted,
  disabled,
  failed,
}
```

No game values, paths containing values, or callback payloads are included.
