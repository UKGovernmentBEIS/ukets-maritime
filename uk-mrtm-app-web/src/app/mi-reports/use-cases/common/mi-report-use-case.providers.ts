import { InjectionToken } from '@angular/core';

import { MiReportUseCaseService } from '@mi-reports/use-cases/common/mi-report-use-case.service';

export const MI_REPORT_USE_CASE_SERVICE: InjectionToken<MiReportUseCaseService> =
  new InjectionToken<MiReportUseCaseService>('Mi report use case service');
