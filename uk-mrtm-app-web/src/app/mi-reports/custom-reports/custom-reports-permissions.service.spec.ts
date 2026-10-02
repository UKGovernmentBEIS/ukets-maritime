import { TestBed } from '@angular/core/testing';

import { firstValueFrom, throwError } from 'rxjs';

import { RegulatorAuthoritiesService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { asyncData, MockType } from '@netz/common/testing';

import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';

describe('CustomReportsPermissionsService', () => {
  let service: CustomReportsPermissionsService;
  let authStore: AuthStore;
  let regulatorAuthoritiesService: MockType<RegulatorAuthoritiesService>;

  const setUserId = (userId: string) =>
    authStore.setState({ ...authStore.state, userState: { ...authStore.state.userState, userId } });

  beforeEach(() => {
    regulatorAuthoritiesService = {
      getCurrentRegulatorUserPermissionsByCa: vi
        .fn()
        .mockReturnValue(asyncData({ permissions: { MI_REPORTS_MANAGE_CUSTOM: 'EXECUTE' } })),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: RegulatorAuthoritiesService, useValue: regulatorAuthoritiesService }],
    });

    service = TestBed.inject(CustomReportsPermissionsService);
    authStore = TestBed.inject(AuthStore);
    setUserId('user1');
  });

  it('should share a single request between callers for the same user', async () => {
    await expect(firstValueFrom(service.canManageCustomReports())).resolves.toBe(true);
    await expect(firstValueFrom(service.canManageCustomReports())).resolves.toBe(true);

    expect(regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalledTimes(1);
  });

  it('should request permissions again when the user changes', async () => {
    await firstValueFrom(service.canManageCustomReports());
    setUserId('user2');
    await firstValueFrom(service.canManageCustomReports());

    expect(regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalledTimes(2);
  });

  it('should not cache a failed request', async () => {
    regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa.mockReturnValueOnce(
      throwError(() => new Error()) as any,
    );

    await expect(firstValueFrom(service.canManageCustomReports())).resolves.toBe(false);
    await expect(firstValueFrom(service.canManageCustomReports())).resolves.toBe(true);

    expect(regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalledTimes(2);
  });

  it('should request permissions again after the cache is cleared', async () => {
    await firstValueFrom(service.canManageCustomReports());
    service.clear();
    await firstValueFrom(service.canManageCustomReports());

    expect(regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalledTimes(2);
  });
});
