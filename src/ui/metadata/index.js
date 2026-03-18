/**
 * Barrel: ui/metadata
 *
 * Re-exports the schema contract and all section registries so
 * consumers only need one import path.
 *
 *   import { CONTROL_TYPES, validateControl, createQuickMetadata } from '@ui/metadata';
 */

export * from './schema.js';
export * from './factory.js';
export * from './feedback-presets.js';
export * from './quick/index.js';
export * from './stat/index.js';
export * from './misc/index.js';
