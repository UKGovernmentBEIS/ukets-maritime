import { isNil } from '@shared/utils';

describe('isNil', () => {
  it('should return true for null', () => {
    expect(isNil(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false for other "falsy" values', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil(NaN)).toBe(false);
  });

  it('should return false for "truthy" values', () => {
    expect(isNil([])).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil('hello')).toBe(false);
    expect(isNil(123)).toBe(false);
  });
});
