import type { DivisionAuthorization, GumanEntity } from './types.js';

export function authorizeDivision(
  entity: GumanEntity,
  grantedBy: string,
  reason: string
): GumanEntity {
  const authorization: DivisionAuthorization = {
    enabled: true,
    grantedBy,
    reason,
    atIso: new Date().toISOString()
  };

  return {
    ...entity,
    authorization,
    state: 'evolving'
  };
}
