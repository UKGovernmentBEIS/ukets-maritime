import { ReviewDecisionTypePipe } from '@shared/pipes/review-decision-type.pipe';

describe('ReviewDecisionTypePipe', () => {
  const pipe = new ReviewDecisionTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform review decision type to string', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('ACCEPTED');
    expect(transformation).toEqual('Accepted');
    transformation = pipe.transform('OPERATOR_AMENDS_NEEDED');
    expect(transformation).toEqual('Operator amends needed');
  });
});
