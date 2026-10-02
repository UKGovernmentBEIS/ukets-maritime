import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { provideCustomReportFormModel } from '@mi-reports/custom-reports/create-custom-report/create-custom-report.provider';

describe('provideCustomReportFormModel', () => {
  let service: MockType<MiReportsUserDefinedService>;

  const buildForm = (activatedRoute: ActivatedRouteStub): FormGroup => {
    const fb = TestBed.inject(FormBuilder);

    return TestBed.runInInjectionContext(() =>
      (provideCustomReportFormModel as any).useFactory(fb, activatedRoute, service),
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should initialise all controls to null when there is no current report and no other reports exist', () => {
    service = { getAllMiReportsUserDefined: vi.fn().mockReturnValue(of({ queries: [], total: 0 })) };
    const activatedRoute = new ActivatedRouteStub({}, {}, {});

    const form = buildForm(activatedRoute);

    expect(form.value).toEqual({
      reportName: null,
      categories: null,
      description: null,
      favourite: null,
      queryDefinition: null,
      reason: null,
    });
  });

  it('should populate the controls from the current report when editing', () => {
    service = { getAllMiReportsUserDefined: vi.fn().mockReturnValue(of({ queries: [], total: 0 })) };
    const currentReport = {
      reportName: 'Existing report',
      categories: [{ id: 1, name: 'Category 1' }],
      description: 'A description',
      favourite: true,
      queryDefinition: 'select 1',
    };
    const activatedRoute = new ActivatedRouteStub({ id: '9' }, {}, { customReport: currentReport });

    const form = buildForm(activatedRoute);

    expect(form.value).toEqual({
      reportName: 'Existing report',
      categories: ['1'],
      description: 'A description',
      favourite: true,
      queryDefinition: 'select 1',
      reason: null,
    });
  });

  it('should report a reportName error when the name already exists among the other reports', () => {
    service = {
      getAllMiReportsUserDefined: vi
        .fn()
        .mockReturnValue(of({ queries: [{ id: 1, reportName: 'Taken name' }], total: 1 })),
    };
    const activatedRoute = new ActivatedRouteStub({}, {}, {});

    const form = buildForm(activatedRoute);
    form.get('reportName').setValue('taken name');

    expect(form.get('reportName').errors).toEqual({
      reportName: 'The report name already exists. Enter a different report name.',
    });
  });

  it('should exclude the report currently being edited from the uniqueness check', () => {
    service = {
      getAllMiReportsUserDefined: vi
        .fn()
        .mockReturnValue(of({ queries: [{ id: 9, reportName: 'Existing report' }], total: 1 })),
    };
    const activatedRoute = new ActivatedRouteStub({ id: '9' }, {}, {});

    const form = buildForm(activatedRoute);
    form.get('reportName').setValue('Existing report');

    expect(form.get('reportName').errors).toBeNull();
  });
});
