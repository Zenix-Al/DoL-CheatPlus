/**
 * Feature Factory — centralized feature lifecycle coordinator.
 *
 * Feature definition shape:
 *   {
 *     id:               string              (required)
 *     registerActions?: (ctx?) => void      — wire dispatcher actions
 *     init?:            (ctx?) => void      — one-time setup, storage, state
 *     startObservers?:  (ctx?) => void      — attach DOM/event observers
 *     stopObservers?:   (ctx?) => void      — detach observers (teardown order)
 *     dispose?:         (ctx?) => void      — full teardown (teardown order)
 *   }
 *
 * Boot sequence:
 *   factory.registerAllActions()  → all features' registerActions phase
 *   factory.initAllFeatures()     → all features' init phase
 *   factory.startAllObservers()   → all features' startObservers phase
 */

function safeInvoke(featureId, phase, fn, ctx) {
  if (typeof fn !== 'function') return;
  try {
    fn(ctx);
  } catch (err) {
    console.error(`[CheatPlus:factory] ${featureId}.${phase} threw:`, err);
  }
}

function createFeatureFactory() {
  const features = new Map();

  function registerFeature(def) {
    if (!def?.id) throw new Error('[CheatPlus:factory] Feature definition must have an id');
    if (features.has(def.id)) {
      console.warn(`[CheatPlus:factory] Feature "${def.id}" already registered; skipping`);
      return;
    }
    features.set(def.id, def);
  }

  function runPhase(phase, ctx, opts = {}) {
    const list = opts.reverse ? [...features.values()].reverse() : [...features.values()];
    for (const feature of list) {
      safeInvoke(feature.id, phase, feature[phase], ctx);
    }
  }

  return {
    registerFeature,
    registerAllActions: (ctx) => runPhase('registerActions', ctx),
    initAllFeatures: (ctx) => runPhase('init', ctx),
    startAllObservers: (ctx) => runPhase('startObservers', ctx),
    stopAllObservers: (ctx) => runPhase('stopObservers', ctx, { reverse: true }),
    teardownAllFeatures: (ctx) => runPhase('dispose', ctx, { reverse: true }),
  };
}

export const factory = createFeatureFactory();

/** Convenience wrapper — use in individual feature modules to self-register. */
export function registerFeature(def) {
  factory.registerFeature(def);
}
