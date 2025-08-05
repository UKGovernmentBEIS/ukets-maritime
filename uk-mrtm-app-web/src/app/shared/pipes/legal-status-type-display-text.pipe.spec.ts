import { LegalStatusTypeDisplayTextPipe } from '@shared/pipes';

describe('LegalStatusTypeDisplayTextPipe', () => {
  const pipe: LegalStatusTypeDisplayTextPipe = new LegalStatusTypeDisplayTextPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform legal status type', () => {
    expect(pipe.transform('INDIVIDUAL')).toEqual('Individual');
    expect(pipe.transform('LIMITED_COMPANY')).toEqual('Company');
    expect(pipe.transform('PARTNERSHIP')).toEqual('Partnership');
    expect(pipe.transform(null)).toEqual(null);
  });
});
