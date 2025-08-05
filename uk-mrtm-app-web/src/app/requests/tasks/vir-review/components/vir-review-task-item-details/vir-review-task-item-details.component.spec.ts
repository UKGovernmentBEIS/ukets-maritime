import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirReviewTaskItemDetailsComponent } from '@requests/tasks/vir-review/components/vir-review-task-item-details/vir-review-task-item-details.component';

describe('VirReviewTaskItemDetailsComponent', () => {
  class Page extends BasePage<VirReviewTaskItemDetailsComponent> {}
  let component: VirReviewTaskItemDetailsComponent;
  let fixture: ComponentFixture<VirReviewTaskItemDetailsComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirReviewTaskItemDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirReviewTaskItemDetailsComponent);
    fixture.componentRef.setInput('taskItem', {
      name: 'mockTaskItem',
      data: {
        operatorResponse: {
          isAddressed: false,
          addressedDescription: 'Test description',
          uploadEvidence: true,
          files: ['82121780-8e62-4485-9ee2-7024f2563612'],
        },
      },
    });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summariesContents).toEqual(["Operator's response", 'Test description']);
  });
});
