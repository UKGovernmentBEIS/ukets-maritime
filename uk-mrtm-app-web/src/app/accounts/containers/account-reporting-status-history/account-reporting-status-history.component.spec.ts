import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AccountReportingStatusHistoryService, MaritimeAccountsService } from '@mrtm/api';

import { ActivatedRouteStub, BasePage, mockClass } from '@netz/common/testing';

import { AccountReportingStatusHistoryComponent } from '@accounts/containers';
import { OperatorAccountsStore } from '@accounts/store';

describe('AccountReportingStatusHistoryComponent', () => {
  let component: AccountReportingStatusHistoryComponent;
  let fixture: ComponentFixture<AccountReportingStatusHistoryComponent>;
  let page: Page;

  const activatedRouteStub = new ActivatedRouteStub({ accountId: '1' });
  const mrtmAccountsService = mockClass(MaritimeAccountsService);
  const accountReportingService = mockClass(AccountReportingStatusHistoryService);

  class Page extends BasePage<AccountReportingStatusHistoryComponent> {
    get heading() {
      return this.query<HTMLElement>('netz-page-heading');
    }

    get columns() {
      return this.queryAll<HTMLElement>('govuk-table__header');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, AccountReportingStatusHistoryComponent],
      providers: [
        OperatorAccountsStore,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MaritimeAccountsService, useValue: mrtmAccountsService },
        { provide: AccountReportingStatusHistoryService, useValue: accountReportingService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountReportingStatusHistoryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heading', async () => {
    expect(page.heading.textContent.trim()).toEqual('Reporting status history');
  });
});
