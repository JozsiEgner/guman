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

export interface BodyFrame {
  archetype: GumanSex;
  height: number;
  mass: number;
  posture: 'upright' | 'adaptive';
  position: SpatialVector3;
}

export interface EzoCore {
  signature: string;
  energyLevel: number;
  divisionCount: number;
  permissionRequired: boolean;
  lineageCode: string;
}

export interface DivisionAuthorization {
  enabled: boolean;
  grantedBy: string;
  reason: string;
  atIso: string;
}

export interface GumanEntity {
  id: string;
  name: string;
  state: GumanLifecycleState;
  body: BodyFrame;
  core: EzoCore;
  authorization?: DivisionAuthorization;
}
