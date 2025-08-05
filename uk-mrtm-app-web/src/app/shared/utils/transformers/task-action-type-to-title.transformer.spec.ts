import { taskActionTypeToTitleMap } from '@shared/constants';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers/task-action-type-to-title.transformer';

describe('taskActionTypeToTitleTransformer', () => {
  it('should return mapped title for valid task type', () => {
    Object.keys(taskActionTypeToTitleMap).forEach((taskType) => {
      const result = taskActionTypeToTitleTransformer(taskType);
      expect(result).toBe(taskActionTypeToTitleMap[taskType]);
    });
  });

  it('should replace "annual" with year for AER_APPLICATION_SUBMIT type', () => {
    const taskType = 'AER_APPLICATION_SUBMIT';
    const year = '2023';
    const result = taskActionTypeToTitleTransformer(taskType, year);
    expect(result).toBe('Complete 2023 emissions report');
  });

  it('should handle numeric year for AER_APPLICATION_SUBMIT type', () => {
    const taskType = 'AER_APPLICATION_SUBMIT';
    const year = 2023;
    const result = taskActionTypeToTitleTransformer(taskType, year);
    expect(result).toBe('Complete 2023 emissions report');
  });

  it('should replace "annual" with year for DOE_APPLICATION_SUBMIT type', () => {
    const taskType = 'DOE_APPLICATION_SUBMIT';
    const year = '2023';
    const result = taskActionTypeToTitleTransformer(taskType, year);
    expect(result).toBe('Determine 2023 emissions');
  });

  it('should return null for unknown task type', () => {
    const taskType = 'UNKNOWN_TASK';
    const result = taskActionTypeToTitleTransformer(taskType);
    expect(result).toBeNull();
  });
});
