import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { MiReportsUserDefinedService, MiReportUserDefinedDTO } from '@mrtm/api';

export const resolveCustomReportData: ResolveFn<MiReportUserDefinedDTO> = (route: ActivatedRouteSnapshot) => {
  const service = inject(MiReportsUserDefinedService);
  const id = Number(route.params.id);
  return service.getMiReportUserDefinedById(id);
};
