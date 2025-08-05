import { VariationDeterminationHeaderTypePipe } from '@shared/pipes/variation-determination-header-type.pipe';

describe('VariationDeterminationHeaderTypePipe', () => {
  const pipe = new VariationDeterminationHeaderTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account statuses', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform(undefined);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('APPROVED');
    expect(transformation).toEqual('Provide a reason for your decision (optional)');
    transformation = pipe.transform('DEEMED_WITHDRAWN');
    expect(transformation).toEqual('Provide a reason for withdrawing the application');
    transformation = pipe.transform('REJECTED');
    expect(transformation).toEqual('Provide a reason to support the rejection decision');
  });
});
