import { ApiDataManagementTaskTypeToTextPipe } from '@api-data-management/pipes/api-data-management-task-type-to-text.pipe';

describe('ApiDataManagementTaskTypeToTextPipe', () => {
  let pipe: ApiDataManagementTaskTypeToTextPipe;

  beforeEach(() => {
    pipe = new ApiDataManagementTaskTypeToTextPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a year-specific AER text when a year is provided', () => {
    expect(pipe.transform('AER', 2025)).toBe('Complete 2025 emissions report');
  });

  it('should return a generic AER text when no year is provided', () => {
    expect(pipe.transform('AER')).toBe('Complete annual emissions report');
  });

  it('should return the EMP issuance text', () => {
    expect(pipe.transform('EMP_ISSUANCE')).toBe('Apply for an emissions monitoring plan');
  });

  it('should ignore the year for the EMP issuance text', () => {
    expect(pipe.transform('EMP_ISSUANCE', 2025)).toBe('Apply for an emissions monitoring plan');
  });

  it('should return the EMP variation text', () => {
    expect(pipe.transform('EMP_VARIATION')).toBe('Apply to vary the emissions monitoring plan');
  });

  it('should return the value unchanged for an unknown request type', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });
});
