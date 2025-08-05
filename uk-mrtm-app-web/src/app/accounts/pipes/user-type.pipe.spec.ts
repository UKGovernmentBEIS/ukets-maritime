import { UserTypePipe } from '@accounts/pipes';

describe('UserTypePipe', () => {
  const pipe = new UserTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform appropriate user_type to text', () => {
    expect(pipe.transform('operator_admin')).toEqual('operator admin user');
    expect(pipe.transform('operator')).toEqual('operator user');
    expect(pipe.transform('consultant_agent')).toEqual('consultant/agent');
    expect(pipe.transform('emitter_contact')).toEqual('emitter contact user');
    expect(pipe.transform('some default text')).toEqual('some default text');
  });
});
