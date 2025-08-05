import { BooleanToTextPipe } from '@shared/pipes';

describe('ConvertBooleanPipe', () => {
  let pipe: BooleanToTextPipe;

  beforeEach(() => (pipe = new BooleanToTextPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account types', () => {
    expect(pipe.transform(true)).toEqual('Yes');
    expect(pipe.transform(false)).toEqual('No');
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
