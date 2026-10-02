import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { of, throwError } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';
import { ActivatedRouteStub, asyncData, MockType } from '@netz/common/testing';

import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';
import { CustomReportsPreviewComponent } from '@mi-reports/custom-reports/custom-reports-preview/custom-reports-preview.component';
import { mockCustomMiReportResult } from '@mi-reports/testing/mi-reports-data.mock';
import * as fs from 'fs';

describe('CustomReportsPreviewComponent', () => {
  let component: CustomReportsPreviewComponent;
  let fixture: ComponentFixture<CustomReportsPreviewComponent>;
  let service: MockType<MiReportsUserDefinedService>;
  let feedbackBannerStore: FeedbackBannerStore;

  const customReport = {
    id: 5,
    reportName: 'Report 1',
    description: 'A description',
    favourite: false,
    queryDefinition: 'select 1',
    categories: [{ id: 1, name: 'Category 1' }],
    lastUpdatedOn: '2026-01-01',
  };

  const setup = async (canManage = true) => {
    service = {
      previewCustomReport: vi.fn().mockReturnValue(asyncData({ columnNames: [], results: [] })),
      generateCustomReport: vi.fn().mockReturnValue(of(mockCustomMiReportResult)),
      addMiReportUserDefinedAsFavourite: vi.fn().mockReturnValue(asyncData(undefined)),
      removeMiReportUserDefinedFromFavourites: vi.fn().mockReturnValue(asyncData(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [CustomReportsPreviewComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, {}, { customReport }) },
        { provide: MiReportsUserDefinedService, useValue: service },
        {
          provide: CustomReportsPermissionsService,
          useValue: { canManageCustomReports: vi.fn().mockReturnValue(of(canManage)) },
        },
      ],
    }).compileComponents();

    feedbackBannerStore = TestBed.inject(FeedbackBannerStore);

    fixture = TestBed.createComponent(CustomReportsPreviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', customReport.id);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    // Exporting the report calls `writeFileXLSX`, which schedules a stray
    // `setTimeout(revokeObjectURL, ...)`; fake timers so that pending timer is never a real
    // (leaking) resource.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await setup();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (fs.existsSync('./Report_1.xlsx')) {
      fs.unlinkSync('./Report_1.xlsx');
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the edit and delete buttons when user can manage custom reports', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Edit report');
    expect(text).toContain('Delete report');
  });

  it('should hide the edit and delete buttons when user cannot manage custom reports', async () => {
    TestBed.resetTestingModule();
    await setup(false);

    const text = fixture.nativeElement.textContent;

    expect(text).not.toContain('Edit report');
    expect(text).not.toContain('Delete report');
  });

  it('should populate the sql query control with the resolved query definition', () => {
    expect((component as any).formGroup.get('sqlQuery').value).toBe(customReport.queryDefinition);
  });

  it('should initialise favourite from the resolved data', () => {
    expect((component as any).favourite()).toBe(customReport.favourite);
  });

  describe('onPreview', () => {
    it('should not call the service when the query is empty', () => {
      (component as any).queryCtrl.setValue('   ');

      (component as any).onPreview();

      expect(service.previewCustomReport).not.toHaveBeenCalled();
    });

    it('should populate preview data and columns, clearing any previous error, on success', async () => {
      service.previewCustomReport.mockReturnValue(asyncData({ columnNames: ['a'], results: [{ a: 1 }] }) as any);
      (component as any).queryCtrl.setValue('select 1');

      (component as any).onPreview();
      await fixture.whenStable();

      expect((component as any).previewColumns()).toEqual([{ field: 'a', header: 'a' }]);
      expect((component as any).previewData()).toEqual([{ a: 1 }]);
      expect((component as any).queryCtrl.errors).toBeNull();
    });

    it('should set previewError on the query control when the preview fails', async () => {
      service.previewCustomReport.mockReturnValue(throwError(() => new Error('failed')));
      (component as any).queryCtrl.setValue('select 1');

      (component as any).onPreview();
      await fixture.whenStable();

      expect((component as any).queryCtrl.errors).toEqual({ previewError: 'Custom query could not be executed' });
    });
  });

  describe('onSubmit', () => {
    it('should set a previewError and not call the service when the form is invalid', () => {
      (component as any).queryCtrl.setValue(null);

      (component as any).onSubmit();

      expect(service.generateCustomReport).not.toHaveBeenCalled();
      expect((component as any).queryCtrl.errors).toEqual({ required: 'Query must not be empty' });
    });

    it('should export the report and clear formGroup errors on success', () => {
      (component as any).queryCtrl.setValue('select 1');

      (component as any).onSubmit();
      vi.runOnlyPendingTimers();

      expect(service.generateCustomReport).toHaveBeenCalledWith({ sqlQuery: 'select 1' });
      expect((component as any).formGroup.errors).toEqual({ invalid: null });
    });

    it('should register a business error with the feedback banner on a REPORT1001 bad request', () => {
      service.generateCustomReport.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: { code: 'REPORT1001', message: 'Custom query could not be executed' },
              status: 400,
            }),
        ),
      );
      const setInvalidFormSpy = vi.spyOn(feedbackBannerStore, 'setInvalidForm');
      (component as any).queryCtrl.setValue('select 1');

      (component as any).onSubmit();

      expect((component as any).formGroup.errors).toEqual({ invalid: 'Custom query could not be executed' });
      expect(setInvalidFormSpy).toHaveBeenCalledWith((component as any).formGroup);
    });

    it('should register a live error with the feedback banner on any other error', () => {
      service.generateCustomReport.mockReturnValue(throwError(() => new Error('Unexpected failure')));
      const setInvalidFormLiveSpy = vi.spyOn(feedbackBannerStore, 'setInvalidFormLive');
      (component as any).queryCtrl.setValue('select 1');

      (component as any).onSubmit();

      expect((component as any).formGroup.errors).toEqual({ invalid: 'Unexpected failure' });
      expect(setInvalidFormLiveSpy).toHaveBeenCalledWith((component as any).formGroup);
    });
  });

  describe('exportFileName', () => {
    it('should build the file name from the report name using underscores as separators', () => {
      expect((component as any).exportFileName()).toBe('Report_1');
    });

    it('should collapse and trim whitespace in the report name', () => {
      vi.spyOn(component as any, 'data').mockReturnValue({
        ...customReport,
        reportName: '  Monthly   applications report ',
      });

      expect((component as any).exportFileName()).toBe('Monthly_applications_report');
    });
  });

  describe('toggleFavourites', () => {
    const createEvent = () => {
      const event = new MouseEvent('click');
      vi.spyOn(event, 'stopPropagation');
      vi.spyOn(event, 'preventDefault');
      return event;
    };

    it('should add the report to favourites and update the signal', async () => {
      const event = createEvent();

      (component as any).toggleFavourites(event, true);
      await fixture.whenStable();

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(service.addMiReportUserDefinedAsFavourite).toHaveBeenCalledWith(customReport.id);
      expect((component as any).favourite()).toBe(true);
    });

    it('should remove the report from favourites and update the signal', async () => {
      const event = createEvent();

      (component as any).toggleFavourites(event, false);
      await fixture.whenStable();

      expect(service.removeMiReportUserDefinedFromFavourites).toHaveBeenCalledWith(customReport.id);
      expect((component as any).favourite()).toBe(false);
    });
  });
});
