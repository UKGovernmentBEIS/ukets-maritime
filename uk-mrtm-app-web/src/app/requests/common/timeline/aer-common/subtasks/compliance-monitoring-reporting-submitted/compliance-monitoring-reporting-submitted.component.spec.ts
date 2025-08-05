import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { ComplianceMonitoringReportingSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/compliance-monitoring-reporting-submitted/compliance-monitoring-reporting-submitted.component';

describe('ComplianceMonitoringReportingSubmittedComponent', () => {
  let component: ComplianceMonitoringReportingSubmittedComponent;
  let fixture: ComponentFixture<ComplianceMonitoringReportingSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceMonitoringReportingSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceMonitoringReportingSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
