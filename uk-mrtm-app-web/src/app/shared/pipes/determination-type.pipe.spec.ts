import { DeterminationTypePipe } from '@shared/pipes/determination-type.pipe';

describe('DeterminationTypePipe', () => {
  const pipe = new DeterminationTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account statuses', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform(undefined);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('APPROVED');
    expect(transformation).toEqual('Approve');
    transformation = pipe.transform('DEEMED_WITHDRAWN');
    expect(transformation).toEqual('Withdraw');
  });
});
