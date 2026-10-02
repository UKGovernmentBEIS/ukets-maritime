import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { asyncData, MockType } from '@netz/common/testing';

import { resolveCustomReportData } from '@mi-reports/custom-reports/create-custom-report/create-custom-report.resolver';

describe('resolveCustomReportData', () => {
  let service: MockType<MiReportsUserDefinedService>;

  const mockReport = { id: 5, reportName: 'Report 1' };

  beforeEach(() => {
    service = {
      getMiReportUserDefinedById: vi.fn().mockReturnValue(asyncData(mockReport)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MiReportsUserDefinedService, useValue: service }],
    });
  });

  it('should fetch the report using the id from the route params', async () => {
    const snapshot = { params: { id: '5' } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => resolveCustomReportData(snapshot, undefined as any));

    expect(service.getMiReportUserDefinedById).toHaveBeenCalledWith(5);
    await expect(firstValueFrom(result as Observable<unknown>)).resolves.toEqual(mockReport);
  });
});
