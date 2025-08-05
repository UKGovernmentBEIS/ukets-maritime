import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { CancelPaymentSuccessComponent } from '@requests/tasks/payment/subtasks/cancel/cancel-payment-success';

describe('CancelPaymentSuccessComponent', () => {
  let component: CancelPaymentSuccessComponent;
  let fixture: ComponentFixture<CancelPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelPaymentSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
