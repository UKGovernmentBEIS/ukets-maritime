import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { PaymentDetailsSummaryTemplateComponent } from '@shared/components/summaries/payment/payment-details-summary-template';

describe('PaymentDetailsSummaryTemplateComponent', () => {
  class Page extends BasePage<PaymentDetailsSummaryTemplateComponent> {}

  let component: PaymentDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<PaymentDetailsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDetailsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      amount: '2246',
      paymentRefNum: 'MAMP00050',
      creationDate: '2025-06-12',
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading3.textContent).toEqual('Payment details');
    expect(page.summariesContents).toEqual([
      'Payment status',
      'Not paid',
      'Date created',
      '12 Jun 2025',
      'Reference number',
      'MAMP00050',
      'Amount',
      '£2,246.00',
    ]);
  });
});
