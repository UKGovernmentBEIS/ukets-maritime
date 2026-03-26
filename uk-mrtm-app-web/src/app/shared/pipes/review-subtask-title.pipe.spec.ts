import { ReviewSubtaskTitlePipe } from '@shared/pipes/review-subtask-title.pipe';

describe('ReviewSubtaskTitlePipe', () => {
  const pipe = new ReviewSubtaskTitlePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform title to review subtask pattern', () => {
    expect(pipe.transform('Test subtask NETZ')).toEqual('Review test subtask NETZ');
  });
});
