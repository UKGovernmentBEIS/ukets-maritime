import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirRespondToRegulatorCommentsTaskItemDetailsComponent } from '@requests/tasks/vir-respond-to-regulator-comments/components/vir-respond-to-regulator-comments-task-item-details';

describe('VirTaskItemDetailsComponent', () => {
  class Page extends BasePage<VirRespondToRegulatorCommentsTaskItemDetailsComponent> {}

  let component: VirRespondToRegulatorCommentsTaskItemDetailsComponent;
  let fixture: ComponentFixture<VirRespondToRegulatorCommentsTaskItemDetailsComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirRespondToRegulatorCommentsTaskItemDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirRespondToRegulatorCommentsTaskItemDetailsComponent);
    fixture.componentRef.setInput('taskItem', {
      name: 'mockTaskItem',
      data: {
        regulatorImprovements: {
          improvementRequired: true,
          improvementDeadline: '2025-06-01',
          operatorActions: 'Test actions',
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
    expect(page.summariesContents).toEqual(['Actions for the operator', 'Test actions']);
  });
});
