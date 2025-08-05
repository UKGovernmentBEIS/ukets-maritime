import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { PaymentNotSuccessComponent } from '@requests/tasks/payment/subtasks/make/payment-not-success/payment-not-success.component';

describe('PaymentNotSuccessComponent', () => {
  let component: PaymentNotSuccessComponent;
  let fixture: ComponentFixture<PaymentNotSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentNotSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentNotSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
