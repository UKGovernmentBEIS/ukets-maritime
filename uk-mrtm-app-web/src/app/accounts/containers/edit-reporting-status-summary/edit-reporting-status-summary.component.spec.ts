import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EditReportingStatusSummaryComponent } from '@accounts/containers/edit-reporting-status-summary/edit-reporting-status-summary.component';
import { OperatorAccountsStore } from '@accounts/store';

describe('EditReportingStatusSummaryComponent', () => {
  let component: EditReportingStatusSummaryComponent;
  let fixture: ComponentFixture<EditReportingStatusSummaryComponent>;
  let store: OperatorAccountsStore;
  let page: Page;

  class Page extends BasePage<EditReportingStatusSummaryComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReportingStatusSummaryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({ account: 3, reportingYear: 2025 }) },
      ],
    }).compileComponents();

    store = TestBed.inject(OperatorAccountsStore);
    store.setCurrentAccount({
      account: {
        id: 1,
        imoNumber: '',
        name: '',
        line1: '',
        city: '',
        country: '',
        firstMaritimeActivityDate: '',
      },
    });
    store.setCurrentStatus({
      status: 'EXEMPT',
      year: '2025',
      reason: 'Lorem ipsum',
      reported: false,
    });
    store.editReportingStatus({
      status: 'EXEMPT',
      reason: 'test reason',
    });
    fixture = TestBed.createComponent(EditReportingStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reportingYear', '2025');
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Selected year',
      '2025',
      'Change reporting status to',
      'Exempted',
      'Reason',
      'test reason',
      'Change',
    ]);
  });
});
