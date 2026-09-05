import { renderSectionShell, teardownSectionShell } from '../../ui/shell/renderer.js';

import { mountCheatDescriptor } from './renderer.js';

export function createCheatRuntimeBuilder({
  catalog,
  adapter,
  config,
  document,
  dispatchShellAction,
  feedback = {},
  services = {},
  logger = console,
}) {
  if (!catalog?.listCheats) throw new TypeError('Cheat builder requires a catalog.');
  if (!adapter) throw new TypeError('Cheat builder requires the active runtime adapter.');
  const descriptors = Object.freeze(catalog.listCheats());
  const bySection = new Map(
    ['quick', 'stats', 'misc'].map((section) => [
      section,
      descriptors.filter((descriptor) => descriptor.location.section === section),
    ])
  );
  const mounted = new Map();
  const failed = new Map();
  const sectionTimers = new Map();
  const sectionContainers = new Map();
  let compiled = false;

  function compile() {
    if (compiled) return false;
    compiled = true;
    return true;
  }

  async function disposeSection(section) {
    const timer = sectionTimers.get(section);
    if (timer != null) {
      document.defaultView.clearInterval(timer);
      sectionTimers.delete(section);
    }
    const ids = new Set((bySection.get(section) ?? []).map(({ id }) => id));
    for (const [id, instance] of [...mounted]) {
      if (!ids.has(id)) continue;
      await instance.dispose();
      mounted.delete(id);
    }
  }

  function placeDescriptor(root, descriptor, shellRoot, groupTails, fallbackTail) {
    const group = descriptor.location.group;
    const tail = groupTails.get(group);
    if (tail) {
      tail.node.after(root);
      tail.node = root;
      return fallbackTail;
    }
    const footer = shellRoot.querySelector('.cp-layout-footer');
    if (fallbackTail) fallbackTail.after(root);
    else if (footer) footer.before(root);
    else shellRoot.appendChild(root);
    return root;
  }

  async function mountSection(section, container, shellRows = []) {
    if (!compiled) compile();
    await disposeSection(section);
    teardownSectionShell(container);
    const sectionDescriptors = bySection.get(section) ?? [];
    const shell = renderSectionShell({
      section,
      rows: shellRows,
      container,
      document,
      dispatchAction: dispatchShellAction,
    });
    sectionContainers.set(section, container);
    const groupTails = new Map();
    for (const row of shell.root.querySelectorAll('[data-shell-groups]')) {
      const sharedTail = { node: row };
      for (const group of row.dataset.shellGroups.split(/\s+/).filter(Boolean)) {
        groupTails.set(group, sharedTail);
      }
    }
    let fallbackTail = null;
    for (const descriptor of sectionDescriptors) {
      try {
        const instance = await mountCheatDescriptor({
          descriptor,
          document,
          parent: shell.root,
          adapter,
          config,
          feedback,
          services,
        });
        fallbackTail = placeDescriptor(
          instance.root,
          descriptor,
          shell.root,
          groupTails,
          fallbackTail
        );
        mounted.set(descriptor.id, instance);
        failed.delete(descriptor.id);
      } catch (error) {
        failed.set(descriptor.id, error?.name ?? 'Error');
        logger?.error?.('Cheat descriptor mount failed.', {
          cheatId: descriptor.id,
          errorType: error?.name ?? 'Error',
        });
      }
    }
    if (sectionDescriptors.some(({ refresh }) => refresh?.includes('runtime-tick'))) {
      sectionTimers.set(
        section,
        document.defaultView.setInterval(() => {
          for (const descriptor of sectionDescriptors) {
            void mounted.get(descriptor.id)?.runtimeTick();
          }
        }, 400)
      );
    }
    return health();
  }

  async function sectionOpened(section) {
    await Promise.all(
      (bySection.get(section) ?? [])
        .map(({ id }) => mounted.get(id))
        .filter(Boolean)
        .map((instance) => instance.sectionOpened())
    );
  }

  async function teardown() {
    for (const timer of sectionTimers.values()) document.defaultView.clearInterval(timer);
    sectionTimers.clear();
    const instances = [...mounted.values()];
    mounted.clear();
    await Promise.all(instances.map((instance) => instance.dispose()));
    for (const container of sectionContainers.values()) teardownSectionShell(container);
    sectionContainers.clear();
    return instances.length > 0;
  }

  function health() {
    const instances = [...mounted.values()];
    const applicable = instances.filter(({ applicable }) => applicable).length;
    return Object.freeze({
      total: descriptors.length,
      applicable,
      mounted: instances.length,
      disabled: instances.length - applicable,
      failed: failed.size,
    });
  }

  return Object.freeze({
    compile,
    mountSection,
    sectionOpened,
    teardown,
    health,
    listCompiled: () => [...descriptors],
    getMounted: (id) => mounted.get(id) ?? null,
  });
}
