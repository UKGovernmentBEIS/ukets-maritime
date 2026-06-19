import { OperatorAccountsStatusColorPipe } from '@accounts/pipes';

describe('OperatorAccountsStatusColorPipe', () => {
  const pipe = new OperatorAccountsStatusColorPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform appropriate statuses to TagColor', () => {
    expect(pipe.transform('NEW')).toEqual('blue');
    expect(pipe.transform('LIVE')).toEqual('green');
    expect(pipe.transform('CLOSED')).toEqual('grey');
    expect(pipe.transform('WITHDRAWN')).toEqual('red');
  });
});
