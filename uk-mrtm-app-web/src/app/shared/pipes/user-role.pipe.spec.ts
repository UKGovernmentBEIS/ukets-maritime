import { UserRolePipe } from '@shared/pipes';

describe('UserRolePipe', () => {
  const pipe: UserRolePipe = new UserRolePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should map task types to item names', () => {
    expect(pipe.transform('operator_admin')).toEqual('Operator admin');
    expect(pipe.transform('operator')).toEqual('Operator');
    expect(pipe.transform('consultant_agent')).toEqual('Consultant');
    expect(pipe.transform('emitter_contact')).toEqual('Emitter Contact');
  });
});
