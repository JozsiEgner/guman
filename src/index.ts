import { authorizeDivision } from './domain/authorization.js';
import { divideEntity } from './domain/division.js';
import { createGuman } from './domain/factory.js';

const male = createGuman('Guman-Adam', 'male');
const female = createGuman('Guman-Eva', 'female');

const authorizedMale = authorizeDivision(
  male,
  'GoldMen',
  'Primary Ézó replication access granted.'
);

const result = divideEntity(authorizedMale);

console.log('=== GUMAN FOUNDATION ===');
console.log('Female base entity:', female);
console.log('Authorized male parent:', result.parent);
console.log('Generated offspring:', result.offspring);
