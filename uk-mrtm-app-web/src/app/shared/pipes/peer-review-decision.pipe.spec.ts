import { PeerReviewDecisionPipe } from '@shared/pipes';

describe('PeerReviewDecisionPipe', () => {
  const pipe: PeerReviewDecisionPipe = new PeerReviewDecisionPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should map task types to item names', () => {
    expect(pipe.transform('AGREE')).toEqual('I agree with the determination');
    expect(pipe.transform(true)).toEqual('I agree with the determination');
    expect(pipe.transform('DISAGREE')).toEqual('I do not agree with the determination');
    expect(pipe.transform(false)).toEqual('I do not agree with the determination');
    expect(pipe.transform(undefined)).toEqual('');
    expect(pipe.transform(null)).toEqual('');
  });
});
