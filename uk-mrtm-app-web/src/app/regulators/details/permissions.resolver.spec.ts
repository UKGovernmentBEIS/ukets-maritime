import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter } from '@angular/router';

import { lastValueFrom, Observable } from 'rxjs';

import { AuthorityManagePermissionDTO, RegulatorAuthoritiesService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteSnapshotStub, asyncData } from '@netz/common/testing';

import { permissionsResolver } from '@regulators/details/permissions.resolver';

describe('PermissionsResolver', () => {
  const resolver = permissionsResolver;
  let regulatorAuthService: Partial<jest.Mocked<RegulatorAuthoritiesService>>;
  let authStore: AuthStore;

  const callResolver: (route: ActivatedRouteSnapshot) => Observable<AuthorityManagePermissionDTO> = (route) =>
    TestBed.runInInjectionContext(() => resolver(route));

  const permissions = {
    editable: true,
    permissions: {
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_USERS_AND_CONTACTS: 'EXECUTE',
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
    },
  };

  beforeEach(() => {
    regulatorAuthService = {
      getCurrentRegulatorUserPermissionsByCa: jest.fn().mockReturnValue(asyncData(permissions)),
      getRegulatorUserPermissionsByCaAndId: jest.fn().mockReturnValue(asyncData(permissions)),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: RegulatorAuthoritiesService, useValue: regulatorAuthService }],
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

  it('should provide the permissions of another user', async () => {
    await expect(lastValueFrom(callResolver(new ActivatedRouteSnapshotStub({ userId: '1234567' })))).resolves.toEqual(
      permissions,
    );

    expect(regulatorAuthService.getRegulatorUserPermissionsByCaAndId).toHaveBeenCalledWith('1234567');
  });

  it('should provide current user permissions', async () => {
    await expect(
      lastValueFrom(callResolver(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' }))),
    ).resolves.toEqual(permissions);

    expect(regulatorAuthService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalled();
  });
});
