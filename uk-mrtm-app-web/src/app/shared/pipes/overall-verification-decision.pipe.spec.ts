import { OverallVerificationDecisionPipe } from '@shared/pipes';

describe('OverallVerificationDecisionPipe', () => {
  const pipe: OverallVerificationDecisionPipe = new OverallVerificationDecisionPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform overall verification decision type', () => {
    expect(pipe.transform('VERIFIED_AS_SATISFACTORY')).toEqual('Verified as satisfactory');
    expect(pipe.transform('VERIFIED_AS_SATISFACTORY_WITH_COMMENTS')).toEqual('Verified as satisfactory with comments');
    expect(pipe.transform('NOT_VERIFIED')).toEqual('Not verified');
    expect(pipe.transform(null)).toEqual(null);
  });
});
