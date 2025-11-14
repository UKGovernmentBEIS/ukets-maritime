import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { PaymentCancelledSummaryTemplateComponent } from '@shared/components/summaries/payment/payment-cancelled-summary-template';

describe('PaymentCancelledSummaryTemplateComponent', () => {
  class Page extends BasePage<PaymentCancelledSummaryTemplateComponent> {}

  let component: PaymentCancelledSummaryTemplateComponent;
  let fixture: ComponentFixture<PaymentCancelledSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCancelledSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCancelledSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      status: 'CANCELLED',
      cancellationReason: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Payment status',
      'Cancelled',
      'Reason',
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    ]);
  });
});
