import type { GumanEntity } from './types.js';
import { buildInheritancePackage, applyInheritance } from './inheritance.js';
import { createGuman } from './factory.js';
import { transitionState } from './state-machine.js';

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
      entity.core.permissionRequired,
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

  const parent: GumanEntity = transitionState(
    {
      ...entity,
      core: {
        ...entity.core,
        energyLevel: entity.core.energyLevel - 25,
        divisionCount,
      },
    },
    'dividing',
    'Division initiated by authorized Ézó-core.',
  );

  const inheritancePkg = buildInheritancePackage(entity, divisionCount);

  const baseOffspring = createGuman(cloneName(entity.name), entity.body.archetype);

  const offspring: GumanEntity = applyInheritance(
    {
      ...baseOffspring,
      body: {
        ...baseOffspring.body,
        position: nextOffset(divisionCount),
      },
    },
    inheritancePkg,
  );

  return { parent, offspring };
}
