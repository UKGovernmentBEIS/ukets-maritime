import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { actionProviders } from '@requests/common/action.providers';
import { mockRequestActionAerSubmittedState } from '@requests/common/aer/testing/aer-submitted.mock';
import { AerSubmittedReportComponent } from '@requests/common/timeline/components/aer-submitted-report/index';

describe('AerSubmittedReportComponent', () => {
  let component: AerSubmittedReportComponent;
  let fixture: ComponentFixture<AerSubmittedReportComponent>;
  let page: Page;
  let store: RequestActionStore;

  class Page extends BasePage<AerSubmittedReportComponent> {
    get operatorDetailsSummaryPage() {
      return this.query<HTMLElement>('mrtm-operator-details-summary-template');
    }

    get monitoringPlanChangesSummaryPage() {
      return this.query<HTMLElement>('mrtm-monitoring-plan-changes-summary-template');
    }

    get listOfShipsSummaryPage() {
      return this.query<HTMLElement>('mrtm-list-of-ships-summary-template');
    }

    get voyagesListSummaryPage() {
      return this.query<HTMLElement>('mrtm-voyages-list-summary-template');
    }

    get portCallsListSummaryPage() {
      return this.query<HTMLElement>('mrtm-port-calls-list-summary-template');
    }

    get aggregatedDataListSummaryPage() {
      return this.query<HTMLElement>('mrtm-aggregated-data-list-summary-template');
    }

    get reportingObligationSummaryPage() {
      return this.query<HTMLElement>('mrtm-reporting-obligation-summary-template');
    }

    get reductionClaimSummaryPage() {
      return this.query<HTMLElement>('mrtm-reduction-claim-summary-template');
    }

    get reductionClaimDetailsSummaryPage() {
      return this.query<HTMLElement>('mrtm-reduction-claim-details-summary-template');
    }

    get additionalDocumentsSummaryPage() {
      return this.query<HTMLElement>('mrtm-additional-documents-summary-template');
    }

    get aerTotalEmissionsSummaryPage() {
      return this.query<HTMLElement>('mrtm-aer-total-emissions-summary-template');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerSubmittedReportComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: CountryService, useClass: CountryServiceStub },
        ...actionProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionAerSubmittedState);

    fixture = TestBed.createComponent(AerSubmittedReportComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.operatorDetailsSummaryPage).toBeTruthy();
    expect(page.monitoringPlanChangesSummaryPage).toBeTruthy();
    expect(page.listOfShipsSummaryPage).toBeTruthy();
    expect(page.voyagesListSummaryPage).toBeTruthy();
    expect(page.portCallsListSummaryPage).toBeTruthy();
    expect(page.aggregatedDataListSummaryPage).toBeTruthy();
    expect(page.reportingObligationSummaryPage).toBeTruthy();
    expect(page.reductionClaimSummaryPage).toBeTruthy();
    expect(page.reductionClaimDetailsSummaryPage).toBeTruthy();
    expect(page.additionalDocumentsSummaryPage).toBeTruthy();
    expect(page.aerTotalEmissionsSummaryPage).toBeTruthy();
  });
});
