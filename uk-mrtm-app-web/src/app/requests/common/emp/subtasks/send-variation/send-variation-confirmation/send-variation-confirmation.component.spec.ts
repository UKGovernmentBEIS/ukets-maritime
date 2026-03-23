import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { SendVariationConfirmationComponent } from '@requests/common/emp/subtasks/send-variation/send-variation-confirmation/send-variation-confirmation.component';
import { taskProviders } from '@requests/common/task.providers';
import { screen } from '@testing-library/angular';

describe('SendVariationConfirmationComponent', () => {
  let component: SendVariationConfirmationComponent;
  let fixture: ComponentFixture<SendVariationConfirmationComponent>;
  let router: Router;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpVariationTaskPayload>> = {
    submit: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submit');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendVariationConfirmationComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendVariationConfirmationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct header and content', () => {
    expect(screen.getByRole('heading', { name: 'Send variation application to regulator' })).toBeInTheDocument();
  });

  it('should submit task', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    screen.getByRole('button', { name: 'Confirm and send' }).click();
    fixture.detectChanges();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['success'], { relativeTo: activatedRouteStub, skipLocationChange: true });
  });
});
