import { valuesAreEqual } from '@shared/utils/values-are-equal.util';

describe('valuesAreEqual', () => {
  it('should return expected valuesAreEqual results', () => {
    // Primitives, null, undefined
    expect(valuesAreEqual(null, null)).toBe(true);
    expect(valuesAreEqual(null, undefined)).toBe(false);
    expect(valuesAreEqual(5, 5)).toBe(true);
    expect(valuesAreEqual(5, 6)).toBe(false);
    expect(valuesAreEqual('hello', 'hello')).toBe(true);
    expect(valuesAreEqual('hello', 'Hello')).toBe(false);
    expect(valuesAreEqual(NaN, NaN)).toBe(false);

    // Arrays
    expect(valuesAreEqual([1, 2], [1, 2])).toBe(true);
    expect(valuesAreEqual([1, 2], [2, 1])).toBe(false);

    // Objects
    expect(valuesAreEqual({ x: 1 }, { x: 1 })).toBe(true);
    expect(valuesAreEqual({ x: 1 }, { x: 1, y: 2 })).toBe(false);
    expect(valuesAreEqual({ x: 1 }, { x: 2 })).toBe(false);
    expect(valuesAreEqual({ a: { b: 2, c: 3 } }, { a: { b: 2, c: 3 } })).toBe(true);
    expect(valuesAreEqual({ a: { b: 2, c: 3 } }, { a: { b: 2, c: 4 } })).toBe(false);

    // Mixed objects and arrays
    expect(valuesAreEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);
    expect(valuesAreEqual({ a: { b: [1, 2] } }, { a: { b: [2, 1] } })).toBe(false);

    // Dates
    expect(valuesAreEqual(new Date('2023-01-01'), new Date('2023-01-01'))).toBe(true);
    expect(valuesAreEqual(new Date('2023-01-01'), new Date('2024-01-01'))).toBe(false);
  });
});
