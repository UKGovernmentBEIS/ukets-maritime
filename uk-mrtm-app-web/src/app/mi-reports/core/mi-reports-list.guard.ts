import { inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CanActivate, Resolve } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { MiReportsService, MiReportSystemSearchResult } from '@mrtm/api';

import { ConfigService } from '@core/config';

@Service()
export class MiReportsListGuard implements CanActivate, Resolve<MiReportSystemSearchResult[]> {
  private readonly miReportsService = inject(MiReportsService);
  private readonly configService = inject(ConfigService);
  private readonly useLegacyMiReportsPage = toSignal(this.configService.getConfigProperty('useLegacyMiReportsPage'));
  miReports: MiReportSystemSearchResult[];

  canActivate(): Observable<boolean> {
    return this.miReportsService.getCurrentUserMiReports().pipe(
      tap((result) => (this.miReports = result)),
      map(() => true),
    );
  }

  /**
   * Add a "CUSTOM" report when there is at least one report,
   * since it will never be retrieved from the API
   */
  resolve(): MiReportSystemSearchResult[] {
    return this.miReports
      ? this.useLegacyMiReportsPage() === 'true'
        ? [
            ...this.miReports,
            {
              id: 9999,
              miReportType: 'CUSTOM',
            },
          ]
        : this.miReports
      : [];
  }
}
