import { VerificationBodyStatusPipe } from '@verification-bodies/pipes/verification-body-status.pipe';

describe('VerificationBodyStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new VerificationBodyStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value for valid reporting status', () => {
    const pipe = new VerificationBodyStatusPipe();
    expect(pipe.transform('ACTIVE')).toEqual('Active');
    expect(pipe.transform('DISABLED')).toEqual('Disabled');
    expect(pipe.transform('PENDING')).toEqual('Awaiting confirmation');
  });

  it('should return null value when invalid reporting status', () => {
    const pipe = new VerificationBodyStatusPipe();
    expect(pipe.transform('INVALID' as any)).toEqual(null);
  });
});
