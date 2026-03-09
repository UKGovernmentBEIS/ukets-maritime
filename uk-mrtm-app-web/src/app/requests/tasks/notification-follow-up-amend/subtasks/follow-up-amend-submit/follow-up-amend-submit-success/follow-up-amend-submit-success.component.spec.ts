import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { FollowUpAmendSubmitSuccessComponent } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/follow-up-amend-submit-success/follow-up-amend-submit-success.component';

describe('FollowUpAmendSubmitSuccessComponent', () => {
  let component: FollowUpAmendSubmitSuccessComponent;
  let fixture: ComponentFixture<FollowUpAmendSubmitSuccessComponent>;
  let page: Page;

  class Page extends BasePage<FollowUpAmendSubmitSuccessComponent> {
    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpAmendSubmitSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpAmendSubmitSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent.trim()).toEqual('Response sent to regulator');
    expect(page.heading3).toBeTruthy();
    expect(page.heading3.textContent.trim()).toEqual('What happens next');
    expect(page.paragraphs).toHaveLength(2);
  });
});
