import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AccountReportingStatusHistoryListComponent } from '@accounts/components';
import { AccountReportingStatusPipe } from '@accounts/pipes';
import { mockReportingStatusHistoryResults } from '@accounts/testing/mock-data';

describe('AccountReportingStatusHistoryListComponent', () => {
  let component: AccountReportingStatusHistoryListComponent;
  let fixture: ComponentFixture<AccountReportingStatusHistoryListComponent>;
  let page: Page;

  class Page extends BasePage<AccountReportingStatusHistoryListComponent> {
    get getColumns() {
      return this.queryAll<HTMLLIElement>('.govuk-table .govuk-table__head .govuk-table__row .govuk-table__header');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountReportingStatusPipe, AccountReportingStatusHistoryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountReportingStatusHistoryListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('history', mockReportingStatusHistoryResults.reportingStatusHistoryList['2025']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show reporting status for each result', () => {
    expect(page.getColumns.map((status) => status.textContent.trim())).toEqual([
      'Date',
      'Reporting status',
      'Reason',
      'Changed by',
    ]);
  });
});
