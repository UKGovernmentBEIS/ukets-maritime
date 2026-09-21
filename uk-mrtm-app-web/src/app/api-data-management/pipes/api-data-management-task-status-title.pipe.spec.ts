import { ApiDataManagementTaskStatusTitlePipe } from '@api-data-management/pipes/api-data-management-task-status-title.pipe';

describe('ApiDataManagementTaskStatusTitlePipe', () => {
  let pipe: ApiDataManagementTaskStatusTitlePipe;

  beforeEach(() => {
    pipe = new ApiDataManagementTaskStatusTitlePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Completed" for COMPLETED', () => {
    expect(pipe.transform('COMPLETED')).toBe('Completed');
  });

  it('should return "Completed with failures" for COMPLETED_WITH_FAILURES', () => {
    expect(pipe.transform('COMPLETED_WITH_FAILURES')).toBe('Completed with failures');
  });

  it('should return "In Progress" for IN_PROGRESS', () => {
    expect(pipe.transform('IN_PROGRESS')).toBe('In Progress');
  });

  it('should return "Failed" for FAILED', () => {
    expect(pipe.transform('FAILED')).toBe('Failed');
  });

  it('should return "Failed" for an unknown status', () => {
    expect(pipe.transform(undefined)).toBe('Failed');
  });
});
