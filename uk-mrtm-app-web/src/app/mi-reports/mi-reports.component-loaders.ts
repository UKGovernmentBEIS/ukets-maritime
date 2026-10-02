import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Route } from '@angular/router';

import { ConfigService } from '@core/config';

export const loadMiReportMainComponent: Route['loadComponent'] = async () => {
  const configService = inject(ConfigService);
  const useLegacyMiReportsPage = toSignal(configService.getConfigProperty('useLegacyMiReportsPage'))() === `true`;

  if (useLegacyMiReportsPage) {
    return (await import('@mi-reports/mi-reports.component')).MiReportsComponent;
  }

  return (await import('@mi-reports/mi-reports-container')).MiReportsContainerComponent;
};
