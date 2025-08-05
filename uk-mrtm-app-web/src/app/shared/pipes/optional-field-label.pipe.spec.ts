import { OptionalFieldLabelPipe } from '@shared/pipes';

describe('OptionalFieldLabelPipe', () => {
  let pipe: OptionalFieldLabelPipe;

  beforeEach(() => {
    pipe = new OptionalFieldLabelPipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should add `(Optional) text for given string if optional is true`', () => {
    const testText = 'Label';

    expect(pipe.transform(testText)).toBe(testText);
    expect(pipe.transform(testText, true)).toBe(`${testText} (Optional)`);
  });
});
