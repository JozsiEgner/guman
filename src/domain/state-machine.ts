import type { GumanEntity, GumanLifecycleState, StateTransition } from './types.js';

/**
 * Permitted lifecycle state transitions.
 * A transition not listed here is forbidden and will throw at runtime.
 *
 *   forming  ──► stable ──► evolving ──► dividing
 *      │            │           │            │
 *      └───────────────────────►└────────────► restricted
 */
const VALID_TRANSITIONS: Record<GumanLifecycleState, GumanLifecycleState[]> = {
  forming:    ['stable', 'restricted'],
  stable:     ['evolving', 'restricted'],
  evolving:   ['stable', 'dividing', 'restricted'],
  dividing:   ['stable', 'forming', 'restricted'],
  restricted: [],
};

/** Return true if moving from `from` to `to` is an allowed transition. */
export function canTransition(
  from: GumanLifecycleState,
  to: GumanLifecycleState,
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/** Return the list of states reachable from the given state. */
export function getValidNextStates(state: GumanLifecycleState): GumanLifecycleState[] {
  return [...VALID_TRANSITIONS[state]];
}

/**
 * Apply a lifecycle transition to an entity.
 * Throws if the transition is not permitted by the state machine rules.
 * The transition is appended to the entity's `stateHistory`.
 */
export function transitionState(
  entity: GumanEntity,
  to: GumanLifecycleState,
  condition: string,
): GumanEntity {
  if (!canTransition(entity.state, to)) {
    throw new Error(
      `Invalid state transition: '${entity.state}' → '${to}' is not permitted.`,
    );
  }

  const transition: StateTransition = {
    from: entity.state,
    to,
    condition,
    atIso: new Date().toISOString(),
  };

  return {
    ...entity,
    state: to,
    stateHistory: [...entity.stateHistory, transition],
  };
}
