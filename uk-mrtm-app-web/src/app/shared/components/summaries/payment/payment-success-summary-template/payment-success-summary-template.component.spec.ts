import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { PaymentSuccessSummaryTemplateComponent } from '@shared/components/summaries/payment/payment-success-summary-template';

describe('PaymentSuccessSummaryTemplateComponent', () => {
  class Page extends BasePage<PaymentSuccessSummaryTemplateComponent> {}

  let component: PaymentSuccessSummaryTemplateComponent;
  let fixture: ComponentFixture<PaymentSuccessSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuccessSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      amount: '2500.2',
      paidByFullName: 'First Last',
      paymentDate: '2025-06-17',
      paymentMethod: 'CREDIT_OR_DEBIT_CARD',
      paymentRefNum: 'MAMP00050',
      receivedDate: '2025-06-17',
      status: 'MARK_AS_RECEIVED',
    });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading3.textContent).toEqual('Payment summary');
    expect(page.summariesContents).toEqual([
      'Payment status',
      'Marked as received',
      'Date paid',
      '17 Jun 2025',
      'Date received',
      '17 Jun 2025',
      'Paid by',
      'First Last',
      'Payment method',
      'Debit card or credit card',
      'Reference number',
      'MAMP00050',
      'Amount',
      '£2,500.20',
    ]);
  });
});
