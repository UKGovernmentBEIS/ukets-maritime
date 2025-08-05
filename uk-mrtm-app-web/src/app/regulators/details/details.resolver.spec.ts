import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { lastValueFrom, Observable, throwError } from 'rxjs';

import { RegulatorUserDTO, RegulatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ErrorCodes, HttpStatuses } from '@netz/common/error';
import { ActivatedRouteSnapshotStub, asyncData, expectBusinessErrorToBe } from '@netz/common/testing';

import { detailsResolver } from '@regulators/details/details.resolver';
import { viewNotFoundRegulatorError } from '@regulators/errors/business-error';

describe('DetailsResolver', () => {
  const resolver = detailsResolver;
  let regulatorUsersService: Partial<jest.Mocked<RegulatorUsersService>>;
  let usersService: Partial<jest.Mocked<UsersService>>;
  let authStore: AuthStore;

  const callResolver: (route: ActivatedRouteSnapshot) => Observable<RegulatorUserDTO> = (route) =>
    TestBed.runInInjectionContext(() => resolver(route));

  const user: RegulatorUserDTO = {
    email: 'test@host.com',
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'developer',
    phoneNumber: '23456',
  };

  beforeEach(() => {
    regulatorUsersService = { getRegulatorUserByCaAndId: jest.fn().mockReturnValue(asyncData(user)) };
    usersService = { getCurrentUser: jest.fn().mockReturnValue(asyncData(user)) };

    TestBed.configureTestingModule({
      providers: [
        { provide: RegulatorUsersService, useValue: regulatorUsersService },
        { provide: UsersService, useValue: usersService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      roleType: 'REGULATOR',
      status: 'ENABLED',
      userId: 'ABC1',
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should provide the information of another user', async () => {
    await expect(lastValueFrom(callResolver(new ActivatedRouteSnapshotStub({ userId: '1234567' })))).resolves.toEqual(
      user,
    );

    expect(regulatorUsersService.getRegulatorUserByCaAndId).toHaveBeenCalledWith('1234567');
  });

  it('should provide current user information', async () => {
    await expect(
      lastValueFrom(callResolver(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' }))),
    ).resolves.toEqual(user);

    expect(usersService.getCurrentUser).toHaveBeenCalled();
  });

  it('should return to regulator list when visiting a deleted user', async () => {
    usersService.getCurrentUser.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: HttpStatuses.BadRequest,
            error: { code: ErrorCodes.AUTHORITY1003, message: 'User is not related to competent authority', data: [] },
          }),
      ),
    );

    await expect(
      lastValueFrom(callResolver(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' }))),
    ).rejects.toBeTruthy();
    await expectBusinessErrorToBe(viewNotFoundRegulatorError);
  });
});
