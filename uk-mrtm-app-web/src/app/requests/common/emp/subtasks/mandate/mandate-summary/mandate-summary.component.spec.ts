import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { MandateSummaryComponent } from '@requests/common/emp/subtasks/mandate/mandate-summary';
import { taskProviders } from '@requests/common/task.providers';

describe('MandateSummaryComponent', () => {
  let component: MandateSummaryComponent;
  let fixture: ComponentFixture<MandateSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateSummaryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
