import { inject, Injectable } from '@angular/core';
import { CanActivate, Resolve } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { MiReportSearchResult, MiReportsService } from '@mrtm/api';

@Injectable({ providedIn: 'root' })
export class MiReportsListGuard implements CanActivate, Resolve<MiReportSearchResult[]> {
  private readonly miReportsService = inject(MiReportsService);

  miReports: MiReportSearchResult[];

  canActivate(): Observable<boolean> {
    return this.miReportsService.getCurrentUserMiReports().pipe(
      tap((result) => (this.miReports = result)),
      map(() => true),
    );
  }

  resolve(): MiReportSearchResult[] {
    return this.miReports;
  }
}
