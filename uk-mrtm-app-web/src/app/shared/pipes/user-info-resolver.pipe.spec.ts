import { UserInfoResolverPipe } from '@shared/pipes';

describe('UserInfoResolverPipe', () => {
  const pipe: UserInfoResolverPipe = new UserInfoResolverPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should display an operator', () => {
    expect(
      pipe.transform('operator', {
        operator: { name: 'operator name', roleCode: 'operator_admin', contactTypes: ['FINANCIAL', 'PRIMARY'] },
      }),
    ).toEqual('operator name, Operator admin - Financial contact, Primary contact');
  });

  it('should display a regulator', () => {
    expect(
      pipe.transform('regulator', {
        regulator: { name: 'regulator name' },
      }),
    ).toEqual('regulator name');
  });
});
