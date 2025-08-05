import { DeterminationHeaderTypePipe } from '@shared/pipes/determination-header-type.pipe';

describe('DeterminationHeaderTypePipe', () => {
  const pipe = new DeterminationHeaderTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account statuses', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform(undefined);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('APPROVED');
    expect(transformation).toEqual('Emissions monitoring plan approved');
    transformation = pipe.transform('DEEMED_WITHDRAWN');
    expect(transformation).toEqual('Emissions monitoring plan withdrawn');
  });
});
