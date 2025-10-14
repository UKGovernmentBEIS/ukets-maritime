import { ManageGuidanceSectionTypePipe } from '@guidance/pipes/manage-guidance-section-type.pipe';

describe('ManageGuidanceSectionTypePipe', () => {
  let pipe: ManageGuidanceSectionTypePipe;

  beforeEach(() => {
    pipe = new ManageGuidanceSectionTypePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct text', () => {
    expect(pipe.transform('CREATE')).toBe('Add new section');
    expect(pipe.transform('UPDATE')).toBe('Update section details');
    expect(pipe.transform('DELETE')).toBe('Delete section');
  });
});
