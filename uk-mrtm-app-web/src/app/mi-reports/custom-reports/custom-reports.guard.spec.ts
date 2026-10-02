import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { firstValueFrom, Observable, throwError } from 'rxjs';

import { AuthorityManagePermissionDTO, RegulatorAuthoritiesService } from '@mrtm/api';

import { asyncData, MockType } from '@netz/common/testing';

import {
  canManageCustomReportsGuard,
  clearCustomReportsPermissionsGuard,
} from '@mi-reports/custom-reports/custom-reports.guard';
import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';

describe('canManageCustomReportsGuard', () => {
  let regulatorAuthoritiesService: MockType<RegulatorAuthoritiesService>;

  const runGuard = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() =>
        canManageCustomReportsGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
      ) as Observable<boolean | UrlTree>,
    );

  beforeEach(() => {
    regulatorAuthoritiesService = {
      getCurrentRegulatorUserPermissionsByCa: vi
        .fn()
        .mockReturnValue(asyncData({ permissions: { MI_REPORTS_MANAGE_CUSTOM: 'EXECUTE' } })),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: RegulatorAuthoritiesService, useValue: regulatorAuthoritiesService }],
    });
  });

  it('should allow access when user has EXECUTE on MI_REPORTS_MANAGE_CUSTOM', async () => {
    await expect(runGuard()).resolves.toBe(true);
  });

  it.each<AuthorityManagePermissionDTO['permissions'][string]>(['NONE', 'VIEW_ONLY'])(
    'should redirect to MI reports when permission is %s',
    async (level) => {
      regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa.mockReturnValue(
        asyncData<AuthorityManagePermissionDTO>({ permissions: { MI_REPORTS_MANAGE_CUSTOM: level } }) as any,
      );

      await expect(runGuard()).resolves.toEqual(TestBed.inject(Router).createUrlTree(['/mi-reports']));
    },
  );

  it('should redirect to MI reports when permissions request fails', async () => {
    regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa.mockReturnValue(
      throwError(() => new Error()) as any,
    );

    await expect(runGuard()).resolves.toEqual(TestBed.inject(Router).createUrlTree(['/mi-reports']));
  });

  describe('clearCustomReportsPermissionsGuard', () => {
    it('should clear the cached permissions and allow leaving', () => {
      const clearSpy = vi.spyOn(TestBed.inject(CustomReportsPermissionsService), 'clear');

      const result = TestBed.runInInjectionContext(() =>
        clearCustomReportsPermissionsGuard(
          null,
          {} as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot,
          {} as RouterStateSnapshot,
        ),
      );

      expect(result).toBe(true);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });
  });
});
