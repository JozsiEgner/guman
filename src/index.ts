import { authorizeDivision } from './domain/authorization.js';
import { getJoint } from './domain/body3d.js';
import { divideEntity } from './domain/division.js';
import { totalActiveEnergyFlow } from './domain/ezo-channels.js';
import { createGuman } from './domain/factory.js';
import { describeLineage } from './domain/inheritance.js';
import { getValidNextStates, transitionState } from './domain/state-machine.js';

// ── 1. Create base entities ───────────────────────────────────────────────────
const male   = createGuman('Guman-Adam', 'male');
const female = createGuman('Guman-Eva',  'female');

// ── 2. State machine: forming → stable ───────────────────────────────────────
const stableMale   = transitionState(male,   'stable', 'Initial formation complete.');
const stableFemale = transitionState(female, 'stable', 'Initial formation complete.');

// ── 3. Body 3D — sample joint access ─────────────────────────────────────────
const maleHead    = getJoint(stableMale.body.skeleton,   'head');
const femaleHipL  = getJoint(stableFemale.body.skeleton, 'hip_left');

// ── 4. Ézó energy channels ────────────────────────────────────────────────────
const maleEnergyFlow   = totalActiveEnergyFlow(stableMale.core.channels);
const femaleEnergyFlow = totalActiveEnergyFlow(stableFemale.core.channels);

// ── 5. Authorization + division (Ézó replication) ────────────────────────────
const authorizedMale = authorizeDivision(
  stableMale,
  'GoldMen',
  'Primary Ézó replication access granted.',
);
const { parent, offspring } = divideEntity(authorizedMale);

// ── Output ────────────────────────────────────────────────────────────────────
console.log('=== GUMAN — HUMANOID 3D ENTITY SYSTEM ===\n');

console.log('── Male Entity ─────────────────────────');
console.log('  Name   :', stableMale.name);
console.log('  State  :', stableMale.state);
console.log('  Body   : height =', stableMale.body.height, 'cm  mass =', stableMale.body.mass, 'kg');
console.log('  Skeleton joints  :', stableMale.body.skeleton.joints.length);
console.log('  Shoulder width   :', stableMale.body.skeleton.shoulderWidth, '(normalized)');
console.log('  Head joint       :', maleHead);
console.log('  Ézó channels     :', stableMale.core.channels.map(c => c.name).join(', '));
console.log('  Total energy flow:', maleEnergyFlow);
console.log('  Valid next states:', getValidNextStates(stableMale.state));

console.log('\n── Female Entity ───────────────────────');
console.log('  Name   :', stableFemale.name);
console.log('  State  :', stableFemale.state);
console.log('  Body   : height =', stableFemale.body.height, 'cm  mass =', stableFemale.body.mass, 'kg');
console.log('  Skeleton joints  :', stableFemale.body.skeleton.joints.length);
console.log('  Shoulder width   :', stableFemale.body.skeleton.shoulderWidth, '(normalized)');
console.log('  Hip width        :', stableFemale.body.skeleton.hipWidth, '(normalized)');
console.log('  Left-hip joint   :', femaleHipL);
console.log('  Ézó channels     :', stableFemale.core.channels.map(c => c.name).join(', '));
console.log('  Total energy flow:', femaleEnergyFlow);

console.log('\n── Ézó Division / Replication ──────────');
console.log('  Parent state    :', parent.state);
console.log('  Parent energy   :', parent.core.energyLevel);
console.log('  Division count  :', parent.core.divisionCount);
console.log('  Offspring name  :', offspring.name);
console.log('  Offspring state :', offspring.state);
console.log('  Lineage         :', describeLineage(offspring));
console.log('  Generation      :', offspring.inheritance?.generation);
console.log('  Inherited energy:', offspring.core.energyLevel);
console.log('  Inherited ch.   :', offspring.core.channels.map(c => `${c.name}(${c.energyFlow})`).join(', '));

console.log('\n── State History (authorized male) ─────');
for (const t of authorizedMale.stateHistory) {
  console.log(`  ${t.from.padEnd(10)} → ${t.to.padEnd(10)}  [${t.condition}]`);
}
