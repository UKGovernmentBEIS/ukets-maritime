import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { lastValueFrom, Observable, throwError } from 'rxjs';

import { OperatorUserDTO, OperatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ErrorCodes } from '@netz/common/error';
import { ActivatedRouteSnapshotStub, asyncData, expectBusinessErrorToBe } from '@netz/common/testing';

import { saveNotFoundOperatorError } from '@accounts/errors';
import { deleteUserAuthorityGuard } from '@accounts/guards/delete-user-authority.guard';

describe('deleteUserAuthorityGuard', () => {
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

  const executeGuard: CanActivateFn = (route: ActivatedRouteSnapshotStub) =>
    TestBed.runInInjectionContext(() => deleteUserAuthorityGuard(route, null));

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
    expect(executeGuard).toBeTruthy();
  });

  it('should provide other user information', async () => {
    const route = new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'asdf4' });
    const result$ = executeGuard(route, null) as Observable<boolean>;

    await expect(lastValueFrom(result$)).resolves.toBeTruthy();
    expect(operatorUsersService.getOperatorUserById).toHaveBeenCalledWith(1, 'asdf4');
  });

  it('should provide current user information', async () => {
    const route = new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' });
    const result$ = executeGuard(route, null) as Observable<boolean>;

    await expect(lastValueFrom(result$)).resolves.toBeTruthy();
    expect(usersService.getCurrentUser).toHaveBeenCalled();
  });

  it('should throw an error when visiting a deleted user', async () => {
    operatorUsersService.getOperatorUserById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: ErrorCodes.AUTHORITY1004 } })),
    );
    const route = new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'asdf4' });
    const result$ = executeGuard(route, null) as Observable<boolean>;

    await expect(lastValueFrom(result$)).rejects.toBeTruthy();
    await expectBusinessErrorToBe(saveNotFoundOperatorError(1));
  });
});
