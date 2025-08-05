import { AccountReportingStatusPipe } from '@accounts/pipes';

describe('AccountReportingStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new AccountReportingStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value for valid reporting status', () => {
    const pipe = new AccountReportingStatusPipe();
    expect(pipe.transform('EXEMPT')).toEqual('Exempted');
    expect(pipe.transform('REQUIRED_TO_REPORT')).toEqual('Required to report');
  });

  it('should return null value when invalid reporting status', () => {
    const pipe = new AccountReportingStatusPipe();
    expect(pipe.transform('INVALID' as any)).toEqual(null);
  });
});
