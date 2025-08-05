import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirSubmitTaskItemDetailsComponent } from '@requests/common/vir/components/vir-submit-task-item-details';

describe('VirTaskItemDetailsComponent', () => {
  class Page extends BasePage<VirSubmitTaskItemDetailsComponent> {}

  let component: VirSubmitTaskItemDetailsComponent;
  let fixture: ComponentFixture<VirSubmitTaskItemDetailsComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirSubmitTaskItemDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirSubmitTaskItemDetailsComponent);
    fixture.componentRef.setInput('taskItem', {
      name: 'mockTaskItem',
      data: {
        verificationDataItem: {
          reference: 'B1',
          explanation: 'Explanation B1',
          materialEffect: true,
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
    expect(page.summariesContents).toEqual(["Verifier's recommendation", 'Explanation B1']);
  });
});
