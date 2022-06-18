import { addWeeks, subDays, subWeeks } from 'date-fns';
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
  { id: '4', replacementProductId: '1', replacementDate: new Date('2021-01-01') },
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

  {
    id: '90',
    replacementProductId: '7',
    replacementDate: subDays(new Date(), 1),
  },

  // Posible client error with self-referencing products
  { id: '10', replacementProductId: '10' },

  // Posible client error with circular references
  { id: '11', replacementProductId: '12', replacementDate: subWeeks(new Date(), 2) },
  { id: '12', replacementProductId: '11', replacementDate: subWeeks(new Date(), 2) },

  { id: '13', replacementProductId: '14', replacementDate: subWeeks(new Date(), 2) },
  { id: '14', replacementProductId: '15', replacementDate: subWeeks(new Date(), 2) },
  { id: '15', replacementProductId: '13', replacementDate: subWeeks(new Date(), 2) },

  // Posible client error without replacementDate and having a replacementProductId
  { id: '16', replacementProductId: '13' },

  // Posible client error without replacementProductId and having a replacementDate
  { id: '17', replacementDate: subWeeks(new Date(), 2) },
];

describe('TODO: add describe text', () => {
  let map: ReturnType<typeof generateProductSubstitutesMap>['map'];
  let productsWithErrors: ReturnType<typeof generateProductSubstitutesMap>['productsWithErrors'];
  beforeAll(() => {
    map = generateProductSubstitutesMap(dbProducts).map;
    productsWithErrors = generateProductSubstitutesMap(dbProducts).productsWithErrors;
  });

  it('map should not have product 9 in entries', () => {
    const hasNine = map.has('9');
    expect(hasNine).toBe(false);
  });

  it('map should have product 8 as replacement for product 90', () => {
    expect(map.get('90')).toBe('8');
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
  it('should have undefined as replacement for product 10', () => {
    expect(map.get('10')).toBe(undefined);
  });
  it('should list product 10 as a product with errors', () => {
    expect(productsWithErrors).toContain('10');
  });
  it('should have undefined as replacement for product 11 and 12', () => {
    expect(map.get('11')).toBe(undefined);
    expect(map.get('12')).toBe(undefined);
  });
  it('should list product 11 and 12 as products with errors', () => {
    expect(productsWithErrors).toContain('11');
    expect(productsWithErrors).toContain('12');
  });
  it('should have undefined as replacement for product 11 and 12', () => {
    expect(map.get('13')).toBe(undefined);
    expect(map.get('14')).toBe(undefined);
    expect(map.get('15')).toBe(undefined);
  });
  it('should list product 11 and 12 as products with errors', () => {
    expect(productsWithErrors).toContain('13');
    expect(productsWithErrors).toContain('14');
    expect(productsWithErrors).toContain('15');
  });
  it('should have undefined as replacement for product 16', () => {
    expect(map.get('16')).toBe(undefined);
  });
  it('should list product 16 as a product with error', () => {
    expect(productsWithErrors).toContain('16');
  });
  it('should have undefined as replacement for product 17', () => {
    expect(map.get('17')).toBe(undefined);
  });
  it('should list product 17 as a product with error', () => {
    expect(productsWithErrors).toContain('17');
  });
});

export {};
