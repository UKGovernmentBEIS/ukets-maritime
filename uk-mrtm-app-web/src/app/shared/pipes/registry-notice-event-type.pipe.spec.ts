import { RegistryNoticeEventTypePipe } from '@shared/pipes/registry-notice-event-type.pipe';

describe('RegistryNoticeEventTypePipe', () => {
  const pipe = new RegistryNoticeEventTypePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct string value for given type', () => {
    expect(pipe.transform('ACCOUNT_CLOSED')).toEqual('Account closed');
    expect(pipe.transform('EMP_WITHDRAWN')).toEqual('EMP withdrawn');
  });
});
