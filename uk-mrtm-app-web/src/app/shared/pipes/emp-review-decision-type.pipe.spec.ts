import { EmpReviewDecisionTypePipe } from '@shared/pipes/emp-review-decision-type.pipe';

describe('EmpReviewDecisionTypePipe', () => {
  const pipe = new EmpReviewDecisionTypePipe();

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
