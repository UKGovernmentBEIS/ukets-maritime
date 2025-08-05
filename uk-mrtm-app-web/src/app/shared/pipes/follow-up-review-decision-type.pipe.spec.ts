import { FollowUpReviewDecisionTypePipe } from '@shared/pipes/follow-up-review-decision-type.pipe';

describe('FollowUpReviewDecisionTypePipe', () => {
  const pipe = new FollowUpReviewDecisionTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform review decision type to string', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('ACCEPTED');
    expect(transformation).toEqual('Accepted');
    transformation = pipe.transform('AMENDS_NEEDED');
    expect(transformation).toEqual('Operator amends needed');
  });
});
