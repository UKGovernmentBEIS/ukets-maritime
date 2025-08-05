import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { PaymentBankTransferSummaryTemplateComponent } from '@shared/components/summaries/payment/payment-bank-transfer-summary-template';

describe('PaymentBankTransferSummaryTemplateComponent', () => {
  class Page extends BasePage<PaymentBankTransferSummaryTemplateComponent> {}

  let component: PaymentBankTransferSummaryTemplateComponent;
  let fixture: ComponentFixture<PaymentBankTransferSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentBankTransferSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentBankTransferSummaryTemplateComponent);
    page = new Page(fixture);
    fixture.componentRef.setInput('data', {
      amount: '2246',
      paymentRefNum: 'MAMP00050',
      bankAccountDetails: {
        sortCode: '60-70-80',
        accountNumber: '10014411',
        accountName: 'Environment Agency',
        iban: 'GB23NWBK60708010014411',
        swiftCode: 'NWBKGB2L',
      },
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading3.textContent).toEqual("Environment Agency's bank details");

    expect(page.summariesContents).toEqual([
      'Sort code',
      '60-70-80',
      'Account number',
      '10014411',
      'Account name',
      'Environment Agency',
      'Your payment reference',
      'MAMP00050',
      'Amount to pay',
      '£2,246.00',
    ]);
  });
});
