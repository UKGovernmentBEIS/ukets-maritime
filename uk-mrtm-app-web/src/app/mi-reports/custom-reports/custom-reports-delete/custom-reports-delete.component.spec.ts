import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';
import { ActivatedRouteStub, asyncData, MockType } from '@netz/common/testing';

import { CustomReportsDeleteComponent } from '@mi-reports/custom-reports/custom-reports-delete/custom-reports-delete.component';

describe('CustomReportsDeleteComponent', () => {
  let component: CustomReportsDeleteComponent;
  let fixture: ComponentFixture<CustomReportsDeleteComponent>;
  let service: MockType<MiReportsUserDefinedService>;
  let router: Router;
  let feedbackBannerStore: FeedbackBannerStore;

  beforeEach(async () => {
    service = {
      deleteMiReportUserDefined: vi.fn().mockReturnValue(asyncData(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [CustomReportsDeleteComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: MiReportsUserDefinedService, useValue: service },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    feedbackBannerStore = TestBed.inject(FeedbackBannerStore);

    fixture = TestBed.createComponent(CustomReportsDeleteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 7);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete the report, show a success message and navigate away', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    (component as any).onDelete();
    await fixture.whenStable();

    expect(service.deleteMiReportUserDefined).toHaveBeenCalledWith(7);
    expect(feedbackBannerStore.state.successMessages).toEqual(['The report has been deleted']);
    expect(navigateSpy).toHaveBeenCalledWith(['../../../'], expect.objectContaining({ relativeTo: expect.anything() }));
  });
});
