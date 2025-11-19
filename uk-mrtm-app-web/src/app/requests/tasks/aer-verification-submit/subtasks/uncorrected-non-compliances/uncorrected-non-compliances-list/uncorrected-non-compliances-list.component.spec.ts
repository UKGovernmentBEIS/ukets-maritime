import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedNonCompliancesListComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-list/uncorrected-non-compliances-list.component';

describe('UncorrectedNonCompliancesListComponent', () => {
  let component: UncorrectedNonCompliancesListComponent;
  let fixture: ComponentFixture<UncorrectedNonCompliancesListComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonCompliancesListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonCompliancesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
