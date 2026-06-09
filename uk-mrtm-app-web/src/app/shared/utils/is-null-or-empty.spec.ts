import { isNullOrEmpty } from '@shared/utils';

describe('isNullOrEmpty', () => {
  it('should return true for null', () => {
    expect(isNullOrEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNullOrEmpty(undefined)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isNullOrEmpty('')).toBe(true);
  });

  it('should return false for other "falsy" values', () => {
    expect(isNullOrEmpty(0)).toBe(false);
    expect(isNullOrEmpty(false)).toBe(false);
    expect(isNullOrEmpty(NaN)).toBe(false);
  });

  it('should return false for "truthy" values', () => {
    expect(isNullOrEmpty([])).toBe(false);
    expect(isNullOrEmpty({})).toBe(false);
    expect(isNullOrEmpty('hello')).toBe(false);
    expect(isNullOrEmpty(123)).toBe(false);
    expect(isNullOrEmpty(' ')).toBe(false);
  });
});
