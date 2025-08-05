import { NonConformitiesToTextPipe } from '@shared/pipes';

describe('NonConformitiesToTextPipe', () => {
  let pipe: NonConformitiesToTextPipe;

  beforeEach(() => (pipe = new NonConformitiesToTextPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform values', () => {
    expect(pipe.transform('YES')).toEqual('Yes');
    expect(pipe.transform('NO')).toEqual('No');
    expect(pipe.transform('NOT_APPLICABLE')).toEqual('Not applicable');
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
