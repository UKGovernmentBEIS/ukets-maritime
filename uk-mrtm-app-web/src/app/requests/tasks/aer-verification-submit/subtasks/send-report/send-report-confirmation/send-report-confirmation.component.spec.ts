import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { taskProviders } from '@requests/common/task.providers';
import { SendReportConfirmationComponent } from '@requests/tasks/aer-verification-submit/subtasks/send-report/send-report-confirmation/send-report-confirmation.component';
import { screen } from '@testing-library/angular';

describe('SendReportConfirmationComponent', () => {
  let component: SendReportConfirmationComponent;
  let fixture: ComponentFixture<SendReportConfirmationComponent>;
  let router: Router;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<AerVerificationSubmitTaskPayload>> = {
    submit: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submit');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendReportConfirmationComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SendReportConfirmationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct header and content', () => {
    expect(screen.getByRole('heading', { name: 'Send verification report to the operator' })).toBeInTheDocument();
  });

  it('should submit task', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    screen.getByRole('button', { name: 'Confirm and send' }).click();
    fixture.detectChanges();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['success'], { relativeTo: activatedRouteStub, skipLocationChange: true });
  });
});
