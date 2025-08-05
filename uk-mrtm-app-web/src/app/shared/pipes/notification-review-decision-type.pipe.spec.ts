import { NotificationReviewDecisionTypePipe } from '@shared/pipes';

describe('ReviewDecisionTypePipe', () => {
  const pipe = new NotificationReviewDecisionTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform review decision type to string', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('ACCEPTED');
    expect(transformation).toEqual('Accepted');
    transformation = pipe.transform('REJECTED');
    expect(transformation).toEqual('Rejected');
  });
});
