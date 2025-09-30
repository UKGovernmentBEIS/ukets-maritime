import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { CancelPaymentFormComponent } from '@requests/tasks/payment/subtasks/cancel/cancel-payment-form';

describe('CancelPaymentFormComponent', () => {
  let component: CancelPaymentFormComponent;
  let fixture: ComponentFixture<CancelPaymentFormComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelPaymentFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
