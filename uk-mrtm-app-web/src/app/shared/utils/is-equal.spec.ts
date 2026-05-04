import { isEqual } from '@shared/utils/is-equal';

describe('isEqual', () => {
  describe('Primitives', () => {
    it('should return true for identical primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('test', 'test')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual('apple', 'orange')).toBe(false);
    });
  });

  describe('Deep Objects', () => {
    it('should return true for deeply nested identical objects', () => {
      const obj1 = { a: 1, b: { c: 3, d: [1, 2] } };
      const obj2 = { a: 1, b: { c: 3, d: [1, 2] } };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should return false if a nested value differs', () => {
      const obj1 = { a: 1, b: { c: 3 } };
      const obj2 = { a: 1, b: { c: 4 } };
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    it('should return false if keys are missing', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1 };
      expect(isEqual(obj1, obj2)).toBe(false);
    });
  });

  describe('Special Types', () => {
    it('should correctly compare Dates', () => {
      const d1 = new Date(2024, 1, 1);
      const d2 = new Date(2024, 1, 1);
      const d3 = new Date(2025, 1, 1);
      expect(isEqual(d1, d2)).toBe(true);
      expect(isEqual(d1, d3)).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual(null, undefined)).toBe(false);
    });
  });
});
