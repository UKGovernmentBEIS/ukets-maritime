import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { throwError } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';
import { ActivatedRouteStub, asyncData, MockType } from '@netz/common/testing';

import { CreateCustomReportComponent } from '@mi-reports/custom-reports/create-custom-report/create-custom-report.component';
import { MiReportFormMode } from '@mi-reports/custom-reports/custom-reports.constants';

describe('CreateCustomReportComponent', () => {
  let component: CreateCustomReportComponent;
  let fixture: ComponentFixture<CreateCustomReportComponent>;
  let service: MockType<MiReportsUserDefinedService>;
  let router: Router;
  let feedbackBannerStore: FeedbackBannerStore;

  const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];

  const setup = async (formMode: MiReportFormMode = MiReportFormMode.ADD, params: Record<string, string> = {}) => {
    service = {
      getCategories: vi.fn().mockReturnValue(asyncData(categories)),
      getAllMiReportsUserDefined: vi.fn().mockReturnValue(asyncData({ queries: [], total: 0 })),
      createMiReportUserDefined: vi.fn().mockReturnValue(asyncData(undefined)),
      updateMiReportUserDefined: vi.fn().mockReturnValue(asyncData(undefined)),
      previewCustomReport: vi.fn().mockReturnValue(asyncData({ columnNames: [], results: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [CreateCustomReportComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub(params, {}, { formMode }) },
        { provide: MiReportsUserDefinedService, useValue: service },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    feedbackBannerStore = TestBed.inject(FeedbackBannerStore);

    fixture = TestBed.createComponent(CreateCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  describe('add mode', () => {
    beforeEach(async () => setup(MiReportFormMode.ADD));

    it('should set the title to "Add a custom report"', () => {
      expect((component as any).title()).toBe('Add a custom report');
    });

    it('should resolve the form mode', () => {
      expect((component as any).formMode()).toBe(MiReportFormMode.ADD);
    });

    it('should disable the reason control', () => {
      expect((component as any).formGroup.get('reason').disabled).toBe(true);
    });

    it('should call createMiReportUserDefined, show a success message and navigate on submit', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const formGroup = (component as any).formGroup;
      formGroup.patchValue({
        reportName: 'Report',
        categories: ['1'],
        description: 'Description',
        queryDefinition: 'select 1',
      });

      (component as any).onSubmit();
      await fixture.whenStable();

      expect(service.createMiReportUserDefined).toHaveBeenCalledWith({
        reportName: 'Report',
        description: 'Description',
        queryDefinition: 'select 1',
        favourite: null,
        categories: [{ id: 1, name: 'Category 1' }],
      });
      expect(feedbackBannerStore.state.successMessages).toEqual(['Report saved']);
      expect(navigateSpy).toHaveBeenCalledWith(['../../'], expect.objectContaining({ relativeTo: expect.anything() }));
    });

    it('should set a preview error on the query control when the submit fails', async () => {
      service.createMiReportUserDefined.mockReturnValue(throwError(() => new Error('failed')));
      const formGroup = (component as any).formGroup;
      formGroup.patchValue({
        reportName: 'Report',
        categories: ['1'],
        description: 'Description',
        queryDefinition: 'select 1',
      });

      (component as any).onSubmit();
      await fixture.whenStable();

      expect(formGroup.get('queryDefinition').errors).toEqual({
        previewError: 'Custom query could not be executed',
      });
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => setup(MiReportFormMode.EDIT, { id: '7' }));

    it('should set the title to "Edit report"', () => {
      expect((component as any).title()).toBe('Edit report');
    });

    it('should keep the reason control enabled', () => {
      expect((component as any).formGroup.get('reason').disabled).toBe(false);
    });

    it('should call updateMiReportUserDefined with the route id and reason, then navigate on submit', async () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const formGroup = (component as any).formGroup;
      formGroup.patchValue({
        reportName: 'Report',
        categories: ['2'],
        description: 'Description',
        queryDefinition: 'select 1',
        reason: 'Because it changed',
      });

      (component as any).onSubmit();
      await fixture.whenStable();

      expect(service.updateMiReportUserDefined).toHaveBeenCalledWith(7, {
        reasonForChange: 'Because it changed',
        userDefinedDTO: {
          reportName: 'Report',
          description: 'Description',
          queryDefinition: 'select 1',
          favourite: null,
          categories: [{ id: 2, name: 'Category 2' }],
        },
      });
      expect(navigateSpy).toHaveBeenCalledWith(['../'], expect.objectContaining({ relativeTo: expect.anything() }));
    });
  });

  describe('onPreviewResults', () => {
    beforeEach(async () => setup(MiReportFormMode.ADD));

    it('should not call the service when the query is empty', () => {
      const formGroup = (component as any).formGroup;
      formGroup.get('queryDefinition').setValue('   ');

      (component as any).onPreviewResults();

      expect(service.previewCustomReport).not.toHaveBeenCalled();
    });

    it('should populate the preview data and columns on success', async () => {
      service.previewCustomReport.mockReturnValue(
        asyncData({ columnNames: ['a', 'b'], results: [{ a: 1, b: 2 }] }) as any,
      );
      const formGroup = (component as any).formGroup;
      formGroup.get('queryDefinition').setValue('select 1');

      (component as any).onPreviewResults();
      await fixture.whenStable();

      expect((component as any).previewColumns()).toEqual([
        { field: 'a', header: 'a' },
        { field: 'b', header: 'b' },
      ]);
      expect((component as any).previewData()).toEqual([{ a: 1, b: 2 }]);
    });

    it('should keep the query control valid while the preview request is pending', async () => {
      const formGroup = (component as any).formGroup;
      const queryCtrl = formGroup.get('queryDefinition');
      queryCtrl.setValue('select 1');
      queryCtrl.setErrors({ previewError: 'Custom query could not be executed' });

      (component as any).onPreviewResults();

      expect(queryCtrl.errors).toBeNull();
      expect(queryCtrl.valid).toBe(true);
      await fixture.whenStable();
    });

    it('should set a preview error on the query control when the preview fails', async () => {
      service.previewCustomReport.mockReturnValue(throwError(() => new Error('failed')));
      const formGroup = (component as any).formGroup;
      formGroup.get('queryDefinition').setValue('select 1');

      (component as any).onPreviewResults();
      await fixture.whenStable();

      expect(formGroup.get('queryDefinition').errors).toEqual({
        previewError: 'Custom query could not be executed',
      });
    });
  });
});
