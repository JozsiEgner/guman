import type { DivisionAuthorization, GumanEntity } from './types.js';
import { transitionState } from './state-machine.js';

export function authorizeDivision(
  entity: GumanEntity,
  grantedBy: string,
  reason: string,
): GumanEntity {
  const authorization: DivisionAuthorization = {
    enabled: true,
    grantedBy,
    reason,
    atIso: new Date().toISOString(),
  };

  return transitionState(
    { ...entity, authorization },
    'evolving',
    `Division authorization granted by: ${grantedBy}`,
  );
}

/** Revoke an existing authorization and move the entity to 'restricted'. */
export function revokeDivisionAuth(entity: GumanEntity, reason: string): GumanEntity {
  const updated: GumanEntity = {
    ...entity,
    authorization: entity.authorization
      ? { ...entity.authorization, enabled: false }
      : undefined,
  };
  return transitionState(updated, 'restricted', `Authorization revoked: ${reason}`);
}
