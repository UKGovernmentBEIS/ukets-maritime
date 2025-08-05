import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { CompleteReviewConfirmationComponent } from '@requests/tasks/aer-review/subtasks/complete-review/complete-review-confirmation/complete-review-confirmation.component';

describe('CompleteReviewConfirmationComponent', () => {
  class Page extends BasePage<CompleteReviewConfirmationComponent> {}
  let component: CompleteReviewConfirmationComponent;
  let fixture: ComponentFixture<CompleteReviewConfirmationComponent>;
  let page: Page;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteReviewConfirmationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteReviewConfirmationComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toEqual('Complete emissions report');
    expect(page.query('p').textContent?.trim()).toEqual(
      'By selecting ‘Confirm and complete’ you confirm that the information is correct to the best of your knowledge.',
    );
    expect(page.query('button').textContent).toMatch(/Confirm and complete/);
    expect(page.query('a').textContent).toMatch(/Return to:/);
  });
});
