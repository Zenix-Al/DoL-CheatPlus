/* eslint-disable no-restricted-syntax */

import { JSDOM } from 'jsdom';

export function createDomWithSugarCube({ passage = 'Town', vars = {} } = {}) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.test/',
    pretendToBeVisual: true,
  });

  const { window } = dom;
  const variables = {
    passage,
    ...vars,
  };

  window.SugarCube = {
    State: {
      variables,
    },
    setup: {},
  };

  if (typeof window.confirm !== 'function') {
    window.confirm = () => true;
  }

  const previousDescriptors = new Map();
  const keys = [
    'window',
    'document',
    'navigator',
    'HTMLElement',
    'HTMLInputElement',
    'HTMLSelectElement',
    'HTMLButtonElement',
    'Event',
    'MouseEvent',
    'Node',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'unsafeWindow',
  ];

  keys.forEach((key) => {
    previousDescriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  });

  const globals = {
    window,
    document: window.document,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLInputElement: window.HTMLInputElement,
    HTMLSelectElement: window.HTMLSelectElement,
    HTMLButtonElement: window.HTMLButtonElement,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    Node: window.Node,
    requestAnimationFrame:
      window.requestAnimationFrame?.bind(window) ?? ((cb) => setTimeout(() => cb(Date.now()), 0)),
    cancelAnimationFrame: window.cancelAnimationFrame?.bind(window) ?? ((id) => clearTimeout(id)),
    unsafeWindow: window,
  };

  Object.entries(globals).forEach(([key, value]) => {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value,
    });
  });

  function cleanup() {
    keys.forEach((key) => {
      const descriptor = previousDescriptors.get(key);
      if (!descriptor) {
        delete globalThis[key];
      } else {
        Object.defineProperty(globalThis, key, descriptor);
      }
    });
    window.close();
  }

  return {
    dom,
    window,
    document: window.document,
    variables,
    cleanup,
  };
}
