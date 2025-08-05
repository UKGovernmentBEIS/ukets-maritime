import { daysRemainingTransformer } from '@shared/utils/transformers/days-remaining.transformer';

describe('daysRemainingTransformer', () => {
  it('should return undefined if taskType is AER_APPLICATION_SUBMIT and year is greater than or equal to current year', () => {
    const reportingYear = new Date().getFullYear();
    expect(daysRemainingTransformer(10, reportingYear, 'AER_APPLICATION_SUBMIT')).toBeUndefined();
    expect(daysRemainingTransformer(10, reportingYear + 1, 'AER_APPLICATION_SUBMIT')).toBeUndefined();
  });

  it('should return daysRemaining if taskType is AER_APPLICATION_SUBMIT and year is less than current year', () => {
    const reportingYear = new Date().getFullYear();
    expect(daysRemainingTransformer(10, reportingYear - 1, 'AER_APPLICATION_SUBMIT')).toBe(10);
  });

  it('should return daysRemaining if taskType is not AER_APPLICATION_SUBMIT', () => {
    expect(daysRemainingTransformer(10, 2022, 'OTHER_TASK_TYPE')).toBe(10);
  });

  it('should return daysRemaining if taskType is undefined', () => {
    expect(daysRemainingTransformer(10, 2022)).toBe(10);
  });

  it('should return daysRemaining if year is undefined', () => {
    expect(daysRemainingTransformer(10, undefined, 'AER_APPLICATION_SUBMIT')).toBe(10);
  });

  it('should return undefined if daysRemaining is undefined', () => {
    expect(daysRemainingTransformer(undefined, 2022, 'AER_APPLICATION_SUBMIT')).toBeUndefined();
  });
});
