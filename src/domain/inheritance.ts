import type { EzoChannel, GumanEntity, GumanSex, InheritancePackage } from './types.js';

/** Fraction of parent energy level passed to offspring. */
const ENERGY_INHERITANCE_RATIO = 0.6;

/** Fraction of each parent channel's energyFlow passed to offspring. */
const CHANNEL_FLOW_INHERITANCE_RATIO = 0.7;

/**
 * Collect the heritable properties from a parent entity at division time.
 * `divisionIndex` is the 1-based count of this particular division event.
 */
export function buildInheritancePackage(
  parent: GumanEntity,
  divisionIndex: number,
): InheritancePackage {
  const inheritedChannels: EzoChannel[] = parent.core.channels.map(ch => ({
    ...ch,
    // Integer rounding is intentional: energy flow is a whole-number resource.
    // Precision loss across generations reflects natural attenuation of lineage energy.
    energyFlow: Math.round(ch.energyFlow * CHANNEL_FLOW_INHERITANCE_RATIO),
  }));

  return {
    parentId: parent.id,
    lineageCode: `${parent.core.lineageCode}.${divisionIndex}`,
    generation: (parent.inheritance?.generation ?? 0) + 1,
    inheritedEnergyLevel: Math.round(parent.core.energyLevel * ENERGY_INHERITANCE_RATIO),
    inheritedChannels,
    inheritedSex: parent.body.archetype as GumanSex,
  };
}

/**
 * Apply an inheritance package to a freshly-created offspring entity.
 * Overwrites energy level, lineage code and channel state with inherited values.
 */
export function applyInheritance(
  entity: GumanEntity,
  pkg: InheritancePackage,
): GumanEntity {
  return {
    ...entity,
    inheritance: pkg,
    core: {
      ...entity.core,
      energyLevel: pkg.inheritedEnergyLevel,
      lineageCode: pkg.lineageCode,
      channels: pkg.inheritedChannels,
    },
  };
}

/** Human-readable lineage description for display / logging purposes. */
export function describeLineage(entity: GumanEntity): string {
  if (!entity.inheritance) {
    return `Origin [${entity.id}]`;
  }
  const gen = entity.inheritance.generation;
  return `Gen-${gen} ← parent:${entity.inheritance.parentId} [${entity.inheritance.lineageCode}]`;
}
