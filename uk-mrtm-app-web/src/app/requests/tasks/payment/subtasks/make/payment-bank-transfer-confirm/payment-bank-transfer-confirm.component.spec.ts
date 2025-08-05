import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { PaymentBankTransferConfirmComponent } from '@requests/tasks/payment/subtasks/make/payment-bank-transfer-confirm';

describe('PaymentBankTransferConfirmComponent', () => {
  let component: PaymentBankTransferConfirmComponent;
  let fixture: ComponentFixture<PaymentBankTransferConfirmComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentBankTransferConfirmComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentBankTransferConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
