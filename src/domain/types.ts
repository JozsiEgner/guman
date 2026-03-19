export type GumanSex = 'male' | 'female';

export type GumanLifecycleState =
  | 'forming'
  | 'stable'
  | 'evolving'
  | 'dividing'
  | 'restricted';

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

/** A single skeletal joint in 3D space. */
export interface Joint3D {
  name: string;
  position: SpatialVector3;
  rotation: SpatialVector3;
  scale: SpatialVector3;
}

/**
 * Full 3D skeleton with anatomical measurements.
 * Joint positions use a normalized coordinate space where the distance from
 * root (y=0) to the top of the head (y=1) equals the entity's actual height
 * (e.g. 182 cm for male, 168 cm for female). Multiply by `BodyFrame.height`
 * to obtain real-world centimetre values.
 */
export interface Skeleton3D {
  joints: Joint3D[];
  shoulderWidth: number;
  hipWidth: number;
  spineLength: number;
}

export interface BodyFrame {
  archetype: GumanSex;
  height: number;
  mass: number;
  posture: 'upright' | 'adaptive';
  position: SpatialVector3;
  skeleton: Skeleton3D;
}

/** One Ézó energy channel — a directed energy pathway inside the core. */
export interface EzoChannel {
  id: string;
  name: string;
  energyFlow: number;
  direction: 'inward' | 'outward' | 'bidirectional';
  active: boolean;
}

export interface EzoCore {
  signature: string;
  energyLevel: number;
  divisionCount: number;
  permissionRequired: boolean;
  lineageCode: string;
  channels: EzoChannel[];
}

export interface DivisionAuthorization {
  enabled: boolean;
  grantedBy: string;
  reason: string;
  atIso: string;
}

/** A recorded lifecycle state transition. */
export interface StateTransition {
  from: GumanLifecycleState;
  to: GumanLifecycleState;
  condition: string;
  atIso: string;
}

/** Properties carried from a parent entity into its offspring at division time. */
export interface InheritancePackage {
  parentId: string;
  lineageCode: string;
  generation: number;
  inheritedEnergyLevel: number;
  inheritedChannels: EzoChannel[];
  inheritedSex: GumanSex;
}

export interface GumanEntity {
  id: string;
  name: string;
  state: GumanLifecycleState;
  body: BodyFrame;
  core: EzoCore;
  authorization?: DivisionAuthorization;
  stateHistory: StateTransition[];
  inheritance?: InheritancePackage;
}
