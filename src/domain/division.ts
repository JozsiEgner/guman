import type { GumanEntity } from './types.js';

function cloneName(parentName: string): string {
  return `${parentName}-offspring-${Date.now().toString().slice(-5)}`;
}

function nextOffset(count: number) {
  return { x: count + 1, y: 0, z: 0 };
}

export function canDivide(entity: GumanEntity): boolean {
  return Boolean(
    entity.authorization?.enabled &&
      entity.core.energyLevel >= 60 &&
      entity.core.permissionRequired
  );
}

export function divideEntity(entity: GumanEntity): {
  parent: GumanEntity;
  offspring: GumanEntity;
} {
  if (!canDivide(entity)) {
    throw new Error('Division denied: missing authorization or insufficient Ézó energy.');
  }

  const divisionCount = entity.core.divisionCount + 1;

  const parent: GumanEntity = {
    ...entity,
    state: 'dividing',
    core: {
      ...entity.core,
      energyLevel: entity.core.energyLevel - 25,
      divisionCount
    }
  };

  const offspring: GumanEntity = {
    ...entity,
    id: `guman-child-${Date.now()}`,
    name: cloneName(entity.name),
    state: 'forming',
    body: {
      ...entity.body,
      position: nextOffset(divisionCount)
    },
    core: {
      ...entity.core,
      signature: `ezo-child-${Date.now()}`,
      energyLevel: 70,
      divisionCount: 0,
      lineageCode: `${entity.core.lineageCode}.${divisionCount}`
    },
    authorization: undefined
  };

  return { parent, offspring };
}
