import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { taskProviders } from '@requests/common/task.providers';
import { SubmitSendVariationSuccessComponent } from '@requests/tasks/emp-variation/components/submit-send-variation-success/submit-send-variation-success.component';
import { screen } from '@testing-library/angular';

describe('SubmitSendVariationSuccessComponent', () => {
  let component: SubmitSendVariationSuccessComponent;
  let fixture: ComponentFixture<SubmitSendVariationSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpVariationTaskPayload>> = {
    submit: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSendVariationSuccessComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitSendVariationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct header and content', () => {
    expect(screen.getByRole('heading', { name: 'Variation application sent to regulator' })).toBeInTheDocument();
  });
});
