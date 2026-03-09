import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiReportsService } from '@mrtm/api';

import { mockClass } from '@netz/common/testing';

import { miReportTypeDescriptionMap } from '@mi-reports/core/mi-report';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { ReportPreviewComponent } from '@mi-reports/report-preview';
import { MI_REPORT_USE_CASE_SERVICE } from '@mi-reports/use-cases/common';
import { ListOfAccountsUseCaseService } from '@mi-reports/use-cases/list-of-accounts-use-case.service';
import { screen } from '@testing-library/angular';

describe('ReportPreviewComponent', () => {
  let component: ReportPreviewComponent;
  let fixture: ComponentFixture<ReportPreviewComponent>;

  const miReportsService = mockClass(MiReportsService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPreviewComponent],
      providers: [
        { provide: MiReportsService, useValue: miReportsService },
        { provide: MI_REPORT_USE_CASE_SERVICE, useClass: ListOfAccountsUseCaseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display HTML Elements', () => {
    expect(screen.getByRole('heading').textContent).toEqual(
      miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
    );
    expect(screen.getByRole('button', { name: /Execute/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export to excel/ })).toBeInTheDocument();
  });
});
