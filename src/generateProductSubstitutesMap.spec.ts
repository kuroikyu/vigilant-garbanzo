import { addWeeks } from 'date-fns';
import { Product, generateProductSubstitutesMap } from './generateProductSubstitutesMap';

const dbProducts: ReadonlyArray<Product> = [
  {
    id: '1',
    replacementProductId: '2',
    replacementDate: new Date('2021-01-01'),
  },
  {
    id: '2',
    replacementProductId: '3',
    replacementDate: addWeeks(new Date(), 5),
  },
  { id: '3' },
  { id: '4', replacementProductId: '1' },
  {
    id: '5',
    replacementProductId: '6',
    replacementDate: new Date('2021-01-01'),
  },
  { id: '6' },
  {
    id: '7',
    replacementProductId: '8',
    replacementDate: new Date('2021-01-01'),
  },
  { id: '8' },
  { id: '9' },

  // Posible client error with self-referencing products
  { id: '10', replacementProductId: '10' },

  // Posible client error with circular references
  { id: '11', replacementProductId: '12' },
  { id: '12', replacementProductId: '11' },

  { id: '13', replacementProductId: '14' },
  { id: '14', replacementProductId: '15' },
  { id: '15', replacementProductId: '13' },
];

describe('TODO: add describe text', () => {
  let map: ReturnType<typeof generateProductSubstitutesMap>['map'];
  beforeAll(() => {
    map = generateProductSubstitutesMap(dbProducts).map;
  });

  it('map should not have product 9 in entries', () => {
    const hasNine = map.has('9');
    expect(hasNine).toBe(false);
  });

  it('map should return undefined of a product without replacementProductId', () => {
    expect(map.get('9')).toBe(undefined);
  });

  it('should have 8 as replacement for product 7', () => {
    expect(map.get('7')).toBe('8');
  });

  it('should have 6 as replacement for product 5', () => {
    expect(map.get('5')).toBe('6');
  });
  it('should have 2 as replacement for product 4', () => {
    expect(map.get('4')).toBe('2');
  });
  it('should not have replacement product for itself product(2)', () => {
    expect(map.has('2')).toBe(false);
  });
  it('should have 2 as replacement for product 1', () => {
    expect(map.get('1')).toBe('2');
  });
  // Here hardcore tests for circular references
  it.todo('should have undefined as replacement for product 10');
  it.todo('should have undefined as replacement for product 11');
});

export {};
