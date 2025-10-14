import { ManageGuidanceDocumentTypePipe } from '@guidance/pipes/manage-guidance-document-type.pipe';

describe('ManageGuidanceDocumentTypePipe', () => {
  let pipe: ManageGuidanceDocumentTypePipe;

  beforeEach(() => {
    pipe = new ManageGuidanceDocumentTypePipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct text', () => {
    expect(pipe.transform('CREATE')).toBe('Add new file');
    expect(pipe.transform('UPDATE')).toBe('Update file');
    expect(pipe.transform('DELETE')).toBe('Delete file');
  });
});
