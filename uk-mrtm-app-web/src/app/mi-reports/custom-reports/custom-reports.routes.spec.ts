import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { asyncData, MockType } from '@netz/common/testing';

import { CUSTOM_REPORTS_ROUTES } from '@mi-reports/custom-reports/custom-reports.routes';

@Component({ template: '' })
class StubComponent {}

describe('CUSTOM_REPORTS_ROUTES', () => {
  let service: MockType<MiReportsUserDefinedService>;

  beforeEach(() => {
    service = {
      getMiReportUserDefinedById: vi.fn().mockReturnValue(asyncData({ id: 1, reportName: 'Report 1' })),
    };

    // Keep the real `:id` route config but stub its children so only the resolver behaviour is exercised
    const idRoute = CUSTOM_REPORTS_ROUTES.find((route) => route.path === ':id');
    const routes: Routes = [
      {
        ...idRoute,
        children: [
          { path: '', component: StubComponent },
          { path: 'edit', component: StubComponent },
        ],
      },
    ];

    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: MiReportsUserDefinedService, useValue: service }],
    });
  });

  it('should re-fetch the report when returning to the preview from edit', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/1/edit');
    await harness.navigateByUrl('/1');

    expect(service.getMiReportUserDefinedById).toHaveBeenCalledTimes(2);
  });
});
