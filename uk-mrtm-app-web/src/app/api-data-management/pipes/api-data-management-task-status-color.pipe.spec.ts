import { ApiDataManagementTaskStatusColorPipe } from '@api-data-management/pipes/api-data-management-task-status-color.pipe';

describe('ApiDataManagementTaskStatusColorPipe', () => {
  let pipe: ApiDataManagementTaskStatusColorPipe;

  beforeEach(() => {
    pipe = new ApiDataManagementTaskStatusColorPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for COMPLETED', () => {
    expect(pipe.transform('COMPLETED')).toBeNull();
  });

  it('should return "orange" for COMPLETED_WITH_FAILURES', () => {
    expect(pipe.transform('COMPLETED_WITH_FAILURES')).toBe('orange');
  });

  it('should return "yellow" for IN_PROGRESS', () => {
    expect(pipe.transform('IN_PROGRESS')).toBe('yellow');
  });

  it('should return "red" for FAILED', () => {
    expect(pipe.transform('FAILED')).toBe('red');
  });

  it('should return "red" for an unknown status', () => {
    expect(pipe.transform(undefined)).toBe('red');
  });
});
