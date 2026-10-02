import { inject, Service } from '@angular/core';

import { catchError, map, Observable, of, shareReplay } from 'rxjs';

import { RegulatorAuthoritiesService } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';

@Service()
export class CustomReportsPermissionsService {
  private readonly authStore = inject(AuthStore);
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);

  private cache: { userId: string; canManage$: Observable<boolean> } | null = null;

  /** Shares a single permissions request per logged-in user; a failed request is not cached. */
  canManageCustomReports(): Observable<boolean> {
    const userId = this.authStore.select(selectUserId)();

    if (!this.cache || this.cache.userId !== userId) {
      this.cache = {
        userId,
        canManage$: this.regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa().pipe(
          map(({ permissions }) => permissions?.MI_REPORTS_MANAGE_CUSTOM === 'EXECUTE'),
          catchError(() => {
            this.cache = null;
            return of(false);
          }),
          shareReplay(1),
        ),
      };
    }

    return this.cache.canManage$;
  }

  clear(): void {
    this.cache = null;
  }
}
