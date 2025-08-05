import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusDetailsComponent } from '@requests/timeline/payment/payment-status-details/payment-status-details.component';

describe('PaymentStatusDetailsComponent', () => {
  let component: PaymentStatusDetailsComponent;
  let fixture: ComponentFixture<PaymentStatusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStatusDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
