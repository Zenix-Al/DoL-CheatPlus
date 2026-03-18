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

  const previous = new Map();
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
    previous.set(key, globalThis[key]);
  });

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.navigator = window.navigator;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.HTMLInputElement = window.HTMLInputElement;
  globalThis.HTMLSelectElement = window.HTMLSelectElement;
  globalThis.HTMLButtonElement = window.HTMLButtonElement;
  globalThis.Event = window.Event;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.Node = window.Node;
  globalThis.requestAnimationFrame =
    window.requestAnimationFrame?.bind(window) ?? ((cb) => setTimeout(() => cb(Date.now()), 0));
  globalThis.cancelAnimationFrame =
    window.cancelAnimationFrame?.bind(window) ?? ((id) => clearTimeout(id));
  globalThis.unsafeWindow = window;

  function cleanup() {
    keys.forEach((key) => {
      const value = previous.get(key);
      if (value === undefined) {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
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
