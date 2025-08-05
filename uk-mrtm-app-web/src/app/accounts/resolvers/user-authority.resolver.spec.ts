import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';

import { OperatorUserDTO, OperatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteSnapshotStub, asyncData } from '@netz/common/testing';

import { userAuthorityResolver } from '@accounts/resolvers/user-authority.resolver';
import { UserAuthorityDTO } from '@accounts/types/user-authority.type';

describe('userAuthorityResolver', () => {
  let usersService: Partial<jest.Mocked<UsersService>>;
  let operatorUsersService: Partial<jest.Mocked<OperatorUsersService>>;
  let authStore: AuthStore;

  const operator: OperatorUserDTO = {
    email: 'test@host.com',
    firstName: 'Mary',
    lastName: 'Za',
    mobileNumber: { countryCode: '+30', number: '1234567890' },
    phoneNumber: { countryCode: '+30', number: '123456780' },
  };

  const executeResolver: ResolveFn<Observable<UserAuthorityDTO>> = (route: ActivatedRouteSnapshotStub) =>
    TestBed.runInInjectionContext(() => userAuthorityResolver(route, null));

  beforeEach(() => {
    operatorUsersService = {
      getOperatorUserById: jest.fn().mockReturnValue(asyncData<OperatorUserDTO>(operator)),
    };

    usersService = {
      getCurrentUser: jest.fn().mockReturnValue(asyncData<OperatorUserDTO>(operator)),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: OperatorUsersService, useValue: operatorUsersService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      roleType: 'OPERATOR',
      userId: 'ABC1',
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should provide other user information', async () => {
    const route = new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'asdf4' });
    const result$ = executeResolver(route, null) as Observable<UserAuthorityDTO>;

    await expect(lastValueFrom(result$)).resolves.toEqual(operator);
    expect(operatorUsersService.getOperatorUserById).toHaveBeenCalledWith(1, 'asdf4');
  });

  it('should provide current user information', async () => {
    const route = new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' });
    const result$ = executeResolver(route, null) as Observable<UserAuthorityDTO>;
    await expect(lastValueFrom(result$)).resolves.toEqual(operator);
  });
});
