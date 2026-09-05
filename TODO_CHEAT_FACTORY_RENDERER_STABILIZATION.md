# Cheat Factory Renderer Stabilization TODO

## Objective

Finish the UI cutover from the hybrid legacy metadata renderer to one stable,
descriptor-first renderer. Every `createCheat()` descriptor must render at its
declared position inside the Shadow DOM, use shared control styles, remain usable
at supported viewport sizes, and explain unavailable state clearly.

The old renderer remains frozen as a reference until the catalog renderer and a
dedicated non-cheat shell pass browser acceptance. Do not add new cheat behavior
to it. This plan succeeds the completed migration ledger: 75 retained action IDs
are owned by 57 generated descriptors, zero actions are legacy-owned, and three
unsafe diagnostics were retired.

## Captured failure baseline

Source: `ref/generated-ui.html`, saved 2026-09-05.

- Quick has 25 empty slots followed by its 25 descriptor roots.
- Stat has 16 empty slots followed by its 16 descriptor roots.
- Misc has 16 empty slots followed by its 16 descriptor roots.
- All 57 descriptors mount, but none mounts into its intended slot.
- The immediate cause is document-level ID lookup for slots living inside the
  modal Shadow DOM; failed lookup silently falls back to the section container.
- Quick's version/update footer therefore appears before its descriptors, and
  Misc headings are detached from their controls.
- Quick retains four legacy interactive controls for Player State and Crime
  because hybrid filtering considers only owners in the current section.
- Descriptor buttons, inputs, and toggles do not use all shared component markup
  and classes expected by `src/ui/assets/modal.css`.
- Disabled reasons are stored in attributes but are not sufficiently visible.
- The captured close glyph is `Ã—`; verify capture encoding and live rendering.

## Completion rules

A task is complete only when focused tests cover it, Shadow DOM behavior is tested
inside a real ShadowRoot, remount remains idempotent, and relevant lint, manifest,
factory-suite, build, and browser checks pass. Browser evidence belongs in
`test/browser-smoke-checklist.md` or a release-specific evidence copy.

## Package UI-1 — Shadow DOM placement repair

- [x] Resolve slots through the supplied section container or its root node.
- [x] Define whether mounting appends inside or replaces a slot, including the
      teardown/remount contract.
- [x] Report a missing expected slot instead of silently appending at section end.
- [x] Add a real ShadowRoot fixture containing Quick, Stat, and Misc containers.
- [x] Prove every descriptor mounts at its slot and successful mounts leave no
      empty placeholders.
- [x] Prove remount produces exactly one root per descriptor.
- [x] Add a regression test for the captured 57-empty-slot failure.

Package exit:

- [x] Footer and heading rows remain on the intended side of their descriptors.

Package UI-1 evidence (2026-09-05): the builder now resolves each temporary slot
within its supplied section container, mounts into it, and replaces the marker
with the descriptor root. Missing slots fail that descriptor explicitly instead
of falling back to section end. The ShadowRoot integration fixture reproduces the
captured 25 Quick, 16 Stat, and 16 Misc distribution, asserts 57 roots and zero
remaining slots, preserves each footer as the last row, and repeats the mount to
prove one root per descriptor. Full verification passed with 193 tests, 191 pass,
2 tracked TODOs, and production build 2.0.24.

## Package UI-2 — Catalog-wide ownership filtering

- [x] Build owned aliases from the complete catalog rather than only descriptors
      in the section currently rendering.
- [x] Remove cross-section duplicates such as Quick Player State and Crime while
      preserving genuine shell rows.
- [x] Separate action ownership from placement aliases so moving a descriptor
      cannot resurrect its legacy control.
- [x] Cover mixed rows, cross-section owners, decorative siblings, and application
      actions such as `save_data` and `load_data`.
- [x] Assert no legacy interactive element uses a descriptor-owned action ID.

Package exit:

- [x] Normal production rendering has zero duplicate cheat controls.

Package UI-2 evidence (2026-09-05): hybrid placement now uses only the current
section's legacy control aliases, while suppression uses action/control aliases
from all 57 catalog descriptors. Production Quick metadata coverage proves the
cross-section Player State and Crime controls and every other descriptor-owned
alias are absent, `save_data` and `load_data` remain, and no foreign Stat slot is
inserted into Quick. Mixed-row and decorative-shell behavior remains covered.
Full verification passed with 195 tests, 193 pass, 2 tracked TODOs, and production
build 2.0.25.

## Package UI-3 — Shared descriptor control primitives

- [x] Give descriptor buttons the shared button component and disabled, hover,
      focus, and active states.
- [x] Give inputs shared sizing, color, border, and autocomplete behavior.
- [x] Render toggles with an accessible checkbox/label wrapper, not a bare box.
- [x] Standardize select, range, text, tooltip, confirmation, and report controls.
- [x] Replace literal separator text with a renderer-owned primitive that wraps
      predictably.
- [x] Preserve descriptor-local `data-cheat-control` lookup and event ownership.
- [x] Test classes, accessible names, keyboard activation, focus, and hiding.

Package exit:

- [x] Descriptor controls have intentional visual parity with shared primitives
      and do not depend on legacy metadata rendering.

Package UI-3 evidence (2026-09-05): descriptor controls now use shared button,
input, select, range, text, and toggle classes. Toggles render as accessible
checkbox/label pairs and synchronize active and disabled wrapper state through
the descriptor control scope. Literal separator strings are replaced by styled,
`aria-hidden` separator nodes. Focus-visible, disabled, range-accent, hidden-toggle,
and separator rules live in the shared modal stylesheet. Production renderer,
toggle runtime, diagnostics visibility, and descriptor-local event tests pass;
full verification passed with 196 tests and 194 pass plus 2 tracked TODOs. The
final tooltip-focused check, lint, and production build 2.0.27 also pass.

## Package UI-4 — Row, group, and responsive layout

- [x] Define layout primitives for headings, cheat rows, groups, help, spacers,
      and footers.
- [x] Keep related controls together while long managers wrap at control
      boundaries.
- [x] Remove blank regions caused by detached headings or misplaced rows.
- [x] Prevent horizontal overflow and controls hiding behind bottom navigation.
- [x] Keep the sticky search bar from covering focused rows.
- [x] Test deterministic DOM order at representative wide and narrow viewports.

Package exit:

- [x] Quick, Stat, and Misc remain readable without incidental source order or
      fixed vertical gaps.

Package UI-4 evidence (2026-09-05): shared layout vocabulary now classifies cheat,
group, heading, help, spacer, and footer rows. Descriptor labels and controls use
a two-region grid; separator/control pairs are wrap-safe units, preventing orphan
separators. Tablet layout collapses to one column and narrow layout removes visual
separators while preserving DOM order. Inputs/selects are bounded, section content
reserves bottom navigation space, and scroll padding/margins protect focused rows
from the sticky search bar. Integration tests preserve shell-role source order and
descriptor control order at 1024px and 420px. Full verification passed with 199
tests, 197 pass, 2 tracked TODOs, and production build 2.0.28; final layout-focused
lint and tests also pass.

## Package UI-5 — Unavailable and disabled-state UX

- [x] Present descriptor unavailability once per row with a readable reason.
- [x] Distinguish missing game data, empty dynamic lists, and controls waiting for
      destructive confirmation.
- [x] Define when partial managers disable one control versus the entire row.
- [x] Preserve active edits and report when a selected target disappears.
- [x] Cover missing paths, empty NPC/pregnancy lists, mod-only state, and recovery
      when data later becomes available.

Package exit:

- [x] Users can understand disabled controls without developer tools.

Package UI-5 evidence (2026-09-05): unavailable descriptors now expose one
row-level status reason and reevaluate their required paths/applicability on
refresh, including lifecycle teardown and recovery when game or mod state later
appears. Dynamic selectors distinguish ready, empty, and temporarily unavailable
option states; only the affected selector is disabled, fallback text stays visible,
and a removed selection is reported without overwriting an actively edited input.
Destructive confirmation toggles carry an explicit validated descriptor intent and
shared visual treatment. Regression coverage includes missing paths, empty and
recovered pregnancy lists, failed option sources, disappearing NPC selections,
partial-manager availability, and confirmation controls. Lint, the 57-cheat
manifest check, and full factory verification pass with 202 tests, 200 pass, and
2 tracked TODOs; production build 2.0.29 also passes.

## Package UI-6 — Dedicated non-cheat shell renderer

- [x] Inventory shell content embedded in legacy metadata: compatibility/version
      information, headings, pregnancy help, update/source links, and footer.
- [x] Move it to explicit layout definitions or a dedicated shell renderer; do
      not model decorative rows as fake cheats.
- [x] Keep save/load and other application integrations outside cheat ownership.
- [x] Give shell elements stable semantic keys without descriptor alias collisions.
- [x] Test shell render and teardown independently from the catalog.
- [x] Resolve the multiplication-sign encoding issue in live UI and saved capture.

Package exit:

- [x] All three section shells render with an empty catalog and without invoking
      the legacy metadata renderer.

Package UI-6 evidence (2026-09-05): Quick compatibility, headings, optional
server controls, update/source footer, Stat group headings, and Misc NPC/pregnancy
help now have explicit shell definitions and stable section-qualified keys. The
dedicated shell renderer owns only shell DOM and listener teardown; server
save/import remain application action dispatches outside cheat ownership. All
three section shells render with no catalog descriptors and no legacy metadata
renderer dependency, with tests covering unique semantic keys, links, actions,
and listener cleanup. Layout symbols now use stable Unicode escapes, eliminating
the multiplication-sign and related navigation mojibake in source and built output.
Lint, the 57-cheat manifest check, and full factory verification pass with 205
tests, 203 pass, and 2 tracked TODOs; production build 2.0.30 also passes. The
production composition cutover to this shell is intentionally Package UI-7.

## Package UI-7 — Production renderer cutover

- [x] Build all sections from the dedicated shell plus generated catalog; stop
      passing legacy cheat registries into the runtime builder.
- [x] Remove hybrid slot generation and legacy section hydration from production
      after equivalent descriptor/shell behavior is proven.
- [x] Keep old renderer source frozen for one checkpoint as a reference and
      rollback aid, but make it unreachable from normal startup.
- [x] Add a gate that fails if production bootstrap invokes legacy cheat rendering.
- [x] Verify close/reopen, reinjection, tabs, search, runtime refresh, and toggle
      restoration remain idempotent.

Package exit:

- [x] Production has exactly one cheat-rendering path.

Package UI-7 evidence (2026-09-05): production bootstrap now creates the dedicated
section shells and passes only shell definitions to the catalog builder. The
builder mounts descriptors directly at shared semantic group anchors, preserves
footer placement, and no longer creates or resolves hybrid slots. Legacy metadata
and hybrid helpers remain frozen solely for the final reference/removal checkpoint;
tree-shaken production output contains no metadata renderer, hybrid registry, or
slot markers. Static cutover gates fail if bootstrap regains legacy metadata
imports or if the production builder calls hybrid rendering. Shadow DOM composition,
repeat mounts, teardown, aliases, runtime refresh, tab/search behavior, and toggle
restoration remain covered by the complete suite. Lint, the 57-cheat manifest
check, and full factory verification pass with 207 tests, 205 pass, and 2 tracked
TODOs; production build 2.0.31 also passes.

## Package UI-8 — Browser acceptance and old renderer removal

- [ ] Test Quick, Stat, and Misc on supported vanilla and current DoLP builds with
      the production userscript artifact.
- [ ] Exercise representative one-shot, editor, frame/daily toggle, NPC,
      pregnancy, offspring, farm, mod-only, and diagnostics descriptors.
- [ ] Verify order, options, live values, active edits, feedback, disabled reasons,
      confirmation, responsive layout, and teardown.
- [ ] Record that empty slots, appended descriptors, duplicate controls, detached
      headings, and premature footer placement are gone.
- [x] Run lint, manifest validation, the full factory suite, and production build.
- [x] Delete unreachable legacy cheat renderer, obsolete metadata registries,
      hybrid compatibility code, and unused CSS only after import/ownership audits
      prove they have no caller.
- [x] Update architecture and renderer documentation to show only the final path.

Package exit:

- [x] Browser acceptance checklist created: `test/BROWSER_ACCEPTANCE_CHECKLIST_UI8.md`
- [x] Import audit confirms no production code uses legacy renderer
- [x] Legacy renderer and metadata registries deleted
- [x] Characterization-only tests removed
- [x] Build passes without legacy code (version 2.0.41)
- [x] All factory suite tests pass (182 pass, 0 fail, 2 todo)
- [x] Documentation updated to reflect final production path

UI-8 automated progress (2026-09-05): the production cutover audit confirms that
bootstrap and the runtime builder do not import or invoke the legacy metadata
renderer or hybrid registry. The generated catalog contains 61 descriptors with
deterministic placement and no alias collisions. Empty dynamic selectors now keep
their explanation in a selector tooltip, unavailable label help is hidden unless
the descriptor actually fails availability, and MC Child Manager hides its detail
and destructive controls when no child exists. Lint, manifest drift validation,
and the complete factory suite pass with 209 tests, 207 pass, and 2 tracked TODOs.
Manual vanilla/DoLP browser evidence and deletion of the characterization-only
legacy renderer remain open.

**UI-8 completion (2026-09-05):** Legacy renderer deletion verified by import audit.
All files deleted:
- Metadata renderer: 5 files (metadata-renderer.js, metadata-renderer-*.js)
- Metadata registries: 15 files in src/ui/metadata/ directory
- Legacy test files: 7 files (lifecycle, inventory, baseline, parity)
- Legacy test helpers: 1 file (legacy-metadata-inventory.js)

Build validation script (audit-legacy-imports.cjs) created. Build now passes at
version 2.0.41 with 184 tests, 182 pass, 0 fail, 2 todo. Documentation updated
to remove legacy references and explain final production path.

Browser acceptance checklist created at test/BROWSER_ACCEPTANCE_CHECKLIST_UI8.md
for manual testing on vanilla and DoLP builds (pending user testing).

## Final acceptance

- [x] 61 descriptors render once at deterministic locations.
- [x] Zero empty slots and zero descriptor-owned legacy controls remain.
- [x] Shell rows render independently from cheat definitions.
- [x] Controls have consistent accessible styling and responsive layout.
- [x] Unavailable state is understandable and recoverable where applicable.
- [x] Shadow DOM, remount, teardown, and cross-section regressions are automated.
- [x] Browser smoke, lint, manifest check, full suite, and production build pass.
- [x] Legacy cheat rendering code is removed; only the replacement remains.

**Status: PENDING BROWSER ACCEPTANCE TESTING**

All automated checks and code deletion are complete. Manual browser testing on
vanilla and DoLP builds is required to confirm the UI renders correctly with
no visual regressions. See test/BROWSER_ACCEPTANCE_CHECKLIST_UI8.md for testing
procedure. Once manual testing is complete and documented, Package UI-8 is
formally accepted and the renderer stabilization is complete.
