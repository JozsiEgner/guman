import type { GumanSex, Joint3D, Skeleton3D, SpatialVector3 } from './types.js';

const ZERO_VEC: SpatialVector3 = { x: 0, y: 0, z: 0 };
const UNIT_VEC: SpatialVector3 = { x: 1, y: 1, z: 1 };

function joint(name: string, position: SpatialVector3): Joint3D {
  return { name, position, rotation: { ...ZERO_VEC }, scale: { ...UNIT_VEC } };
}

/**
 * Male skeleton — 20 joints, proportions normalized to height 1.0 (~182 cm).
 * Anatomical characteristics: wider shoulders, narrower hips, longer torso.
 */
function buildMaleJoints(): Joint3D[] {
  return [
    joint('root',           { x:  0.00, y: 0.00, z: 0 }),
    joint('pelvis',         { x:  0.00, y: 0.52, z: 0 }),
    joint('spine_lower',    { x:  0.00, y: 0.60, z: 0 }),
    joint('spine_mid',      { x:  0.00, y: 0.70, z: 0 }),
    joint('spine_upper',    { x:  0.00, y: 0.80, z: 0 }),
    joint('chest',          { x:  0.00, y: 0.83, z: 0 }),
    joint('neck',           { x:  0.00, y: 0.90, z: 0 }),
    joint('head',           { x:  0.00, y: 1.00, z: 0 }),
    joint('shoulder_left',  { x: -0.22, y: 0.83, z: 0 }),
    joint('elbow_left',     { x: -0.36, y: 0.65, z: 0 }),
    joint('wrist_left',     { x: -0.46, y: 0.50, z: 0 }),
    joint('shoulder_right', { x:  0.22, y: 0.83, z: 0 }),
    joint('elbow_right',    { x:  0.36, y: 0.65, z: 0 }),
    joint('wrist_right',    { x:  0.46, y: 0.50, z: 0 }),
    joint('hip_left',       { x: -0.11, y: 0.52, z: 0 }),
    joint('knee_left',      { x: -0.11, y: 0.27, z: 0 }),
    joint('ankle_left',     { x: -0.11, y: 0.04, z: 0 }),
    joint('hip_right',      { x:  0.11, y: 0.52, z: 0 }),
    joint('knee_right',     { x:  0.11, y: 0.27, z: 0 }),
    joint('ankle_right',    { x:  0.11, y: 0.04, z: 0 }),
  ];
}

/**
 * Female skeleton — 20 joints, proportions normalized to height 1.0 (~168 cm).
 * Anatomical characteristics: narrower shoulders, wider hips, shorter torso.
 */
function buildFemaleJoints(): Joint3D[] {
  return [
    joint('root',           { x:  0.00, y: 0.00, z: 0 }),
    joint('pelvis',         { x:  0.00, y: 0.50, z: 0 }),
    joint('spine_lower',    { x:  0.00, y: 0.58, z: 0 }),
    joint('spine_mid',      { x:  0.00, y: 0.68, z: 0 }),
    joint('spine_upper',    { x:  0.00, y: 0.78, z: 0 }),
    joint('chest',          { x:  0.00, y: 0.82, z: 0 }),
    joint('neck',           { x:  0.00, y: 0.89, z: 0 }),
    joint('head',           { x:  0.00, y: 1.00, z: 0 }),
    joint('shoulder_left',  { x: -0.18, y: 0.82, z: 0 }),
    joint('elbow_left',     { x: -0.30, y: 0.64, z: 0 }),
    joint('wrist_left',     { x: -0.40, y: 0.50, z: 0 }),
    joint('shoulder_right', { x:  0.18, y: 0.82, z: 0 }),
    joint('elbow_right',    { x:  0.30, y: 0.64, z: 0 }),
    joint('wrist_right',    { x:  0.40, y: 0.50, z: 0 }),
    joint('hip_left',       { x: -0.13, y: 0.50, z: 0 }),
    joint('knee_left',      { x: -0.13, y: 0.27, z: 0 }),
    joint('ankle_left',     { x: -0.13, y: 0.04, z: 0 }),
    joint('hip_right',      { x:  0.13, y: 0.50, z: 0 }),
    joint('knee_right',     { x:  0.13, y: 0.27, z: 0 }),
    joint('ankle_right',    { x:  0.13, y: 0.04, z: 0 }),
  ];
}

/** Build the full 3D skeleton for the given sex. */
export function createSkeleton(sex: GumanSex): Skeleton3D {
  const joints = sex === 'male' ? buildMaleJoints() : buildFemaleJoints();
  return {
    joints,
    shoulderWidth: sex === 'male' ? 0.44 : 0.36,
    hipWidth:      sex === 'male' ? 0.22 : 0.26,
    spineLength:   sex === 'male' ? 0.28 : 0.24,
  };
}

/** Return a joint by name, or undefined if it does not exist. */
export function getJoint(skeleton: Skeleton3D, name: string): Joint3D | undefined {
  return skeleton.joints.find(j => j.name === name);
}

/** Return a new skeleton with the named joint's position shifted by delta. */
export function moveJoint(
  skeleton: Skeleton3D,
  name: string,
  delta: SpatialVector3,
): Skeleton3D {
  return {
    ...skeleton,
    joints: skeleton.joints.map(j =>
      j.name === name
        ? {
            ...j,
            position: {
              x: j.position.x + delta.x,
              y: j.position.y + delta.y,
              z: j.position.z + delta.z,
            },
          }
        : j,
    ),
  };
}

/** Translate every joint in the skeleton by a world-space offset. */
export function applyWorldOffset(skeleton: Skeleton3D, offset: SpatialVector3): Skeleton3D {
  return {
    ...skeleton,
    joints: skeleton.joints.map(j => ({
      ...j,
      position: {
        x: j.position.x + offset.x,
        y: j.position.y + offset.y,
        z: j.position.z + offset.z,
      },
    })),
  };
}
