import { getYearFromRequestId } from './get-year-from-request-id.util';

describe('getYearFromRequestId', () => {
  it('should return the year when requestId is valid', () => {
    expect(getYearFromRequestId('MAR00005-2025')).toBe('2025');
    expect(getYearFromRequestId('DOE00004-2022-1')).toBe('2022');
  });

  it('should return undefined when year string is not an integer', () => {
    expect(getYearFromRequestId('MAR00005-55.55')).toBeUndefined();
  });

  it('should return undefined when year string is not 4 digits long', () => {
    expect(getYearFromRequestId('MAR00005-555')).toBeUndefined();
    expect(getYearFromRequestId('MAR00005-55555')).toBeUndefined();
  });

  it('should return undefined when requestId does not contain a year', () => {
    expect(getYearFromRequestId('MAR00005-ABC')).toBeUndefined();
    expect(getYearFromRequestId('MAR00005555')).toBeUndefined();
  });

  it('should return undefined when requestId is empty, null or undefined', () => {
    expect(getYearFromRequestId('')).toBeUndefined();
    expect(getYearFromRequestId(undefined)).toBeUndefined();
    expect(getYearFromRequestId(null)).toBeUndefined();
  });
});
