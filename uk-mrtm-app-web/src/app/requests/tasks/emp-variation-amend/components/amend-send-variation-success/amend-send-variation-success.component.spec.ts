import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { taskProviders } from '@requests/common/task.providers';
import { AmendSendVariationSuccessComponent } from '@requests/tasks/emp-variation-amend/components/amend-send-variation-success/amend-send-variation-success.component';
import { screen } from '@testing-library/angular';

describe('AmendSendVariationSuccessComponent', () => {
  let component: AmendSendVariationSuccessComponent;
  let fixture: ComponentFixture<AmendSendVariationSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpVariationTaskPayload>> = {
    submit: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmendSendVariationSuccessComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AmendSendVariationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct header and content', () => {
    expect(screen.getByRole('heading', { name: 'Application sent to regulator' })).toBeInTheDocument();
  });
});
