import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { InternationalPaymentDetailsSummaryTemplateComponent } from '@shared/components/summaries/payment/international-payment-details-summary-template';

describe('InternationalPaymentDetailsSummaryTemplateComponent', () => {
  class Page extends BasePage<InternationalPaymentDetailsSummaryTemplateComponent> {}

  let component: InternationalPaymentDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<InternationalPaymentDetailsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalPaymentDetailsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternationalPaymentDetailsSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      sortCode: '60-70-80',
      accountNumber: '10014411',
      accountName: 'Environment Agency',
      iban: 'GB23NWBK60708010014411',
      swiftCode: 'NWBKGB2L',
    });
    page = new Page(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Sort code',
      'NWBKGB2L',
      'Account number',
      'GB23NWBK60708010014411',
      'Account name',
      'Environment Agency',
    ]);
  });
});
