import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { AerReviewedTasksListComponent } from '@requests/timeline/aer-reviewed/components/aer-reviewed-tasks-list/aer-reviewed-tasks-list.component';

describe('AerReviewedTasksListComponent', () => {
  let component: AerReviewedTasksListComponent;
  let fixture: ComponentFixture<AerReviewedTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReviewedTasksListComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReviewedTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
