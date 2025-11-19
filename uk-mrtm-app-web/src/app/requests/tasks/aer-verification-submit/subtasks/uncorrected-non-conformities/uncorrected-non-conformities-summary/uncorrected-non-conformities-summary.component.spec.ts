import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedNonConformitiesSummaryComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-summary/uncorrected-non-conformities-summary.component';

describe('UncorrectedNonConformitiesSummaryComponent', () => {
  let component: UncorrectedNonConformitiesSummaryComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesSummaryComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
