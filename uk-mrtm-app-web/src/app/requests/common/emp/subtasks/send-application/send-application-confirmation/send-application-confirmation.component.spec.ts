import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { SendApplicationConfirmationComponent } from '@requests/common/emp/subtasks/send-application/send-application-confirmation/send-application-confirmation.component';
import { taskProviders } from '@requests/common/task.providers';
import { screen } from '@testing-library/angular';

describe('SendApplicationConfirmationComponent', () => {
  let component: SendApplicationConfirmationComponent;
  let fixture: ComponentFixture<SendApplicationConfirmationComponent>;
  let router: Router;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpTaskPayload>> = {
    submit: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submit');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendApplicationConfirmationComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendApplicationConfirmationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct header and content', () => {
    expect(screen.getByRole('heading', { name: 'Send application to regulator' })).toBeInTheDocument();
  });

  it('should submit task', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    screen.getByRole('button', { name: 'Confirm and send' }).click();
    fixture.detectChanges();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['success'], { relativeTo: activatedRouteStub, skipLocationChange: true });
  });
});
