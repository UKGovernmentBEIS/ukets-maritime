import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { AerReviewSubtasksListComponent } from '@requests/tasks/aer-review/components/aer-review-subtasks-list/aer-review-subtasks-list.component';

describe('AerReviewSubtasksListComponent', () => {
  let component: AerReviewSubtasksListComponent;
  let fixture: ComponentFixture<AerReviewSubtasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReviewSubtasksListComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReviewSubtasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
