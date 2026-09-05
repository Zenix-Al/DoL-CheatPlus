const mountedShells = new WeakMap();

function renderControl(control, document, dispatchAction, cleanup) {
  let element;
  if (control.type === 'heading') {
    element = document.createElement('span'); element.className = 'gold';
  } else if (control.type === 'help') {
    element = document.createElement('span'); element.className = 'cp-shell-help';
  } else if (control.type === 'link') {
    element = document.createElement('a'); element.className = 'modal-link';
    element.href = control.href; element.target = '_blank'; element.rel = 'noopener noreferrer';
  } else if (control.type === 'action') {
    element = document.createElement('button'); element.type = 'button'; element.className = 'modal-button';
    const handler = () => dispatchAction?.(control.action);
    element.addEventListener('click', handler);
    cleanup.push(() => element.removeEventListener('click', handler));
  } else {
    element = document.createElement('span'); element.className = 'modal-text';
  }
  element.textContent = control.text ?? '';
  if (control.key) element.dataset.shellControl = control.key;
  if (control.action) element.dataset.shellAction = control.action;
  return element;
}

export function teardownSectionShell(container) {
  const state = mountedShells.get(container);
  if (!state) return false;
  state.cleanup.forEach((fn) => fn());
  state.root.remove();
  mountedShells.delete(container);
  return true;
}

export function renderSectionShell({ section, rows, container, document, dispatchAction }) {
  if (!container) throw new TypeError('Shell renderer requires a section container.');
  teardownSectionShell(container);
  const cleanup = [];
  const root = document.createElement('div');
  root.className = 'cp-section-shell'; root.dataset.shellSection = section;
  for (const definition of rows ?? []) {
    const row = document.createElement('div');
    row.className = `modal-content-padding cp-layout-${definition.role}`;
    row.dataset.shellKey = `${section}.${definition.key}`;
    const groups = definition.groups ?? (definition.group ? [definition.group] : []);
    if (groups.length) row.dataset.shellGroups = groups.join(' ');
    for (const control of definition.controls ?? []) {
      if (!control.text) continue;
      row.appendChild(renderControl(control, document, dispatchAction, cleanup));
    }
    root.appendChild(row);
  }
  container.appendChild(root);
  mountedShells.set(container, { root, cleanup });
  return Object.freeze({ root, dispose: () => teardownSectionShell(container) });
}
