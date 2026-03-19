import type { GumanEntity, GumanSex } from './types.js';
import { createSkeleton } from './body3d.js';
import { createEzoChannels } from './ezo-channels.js';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createGuman(name: string, sex: GumanSex): GumanEntity {
  return {
    id: createId('guman'),
    name,
    state: 'forming',
    body: {
      archetype: sex,
      height: sex === 'male' ? 182 : 168,
      mass: sex === 'male' ? 78 : 62,
      posture: 'upright',
      position: { x: 0, y: 0, z: 0 },
      skeleton: createSkeleton(sex),
    },
    core: {
      signature: createId('ezo'),
      energyLevel: 100,
      divisionCount: 0,
      permissionRequired: true,
      lineageCode: createId('lineage'),
      channels: createEzoChannels(sex),
    },
    stateHistory: [],
  };
}
