import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { SubmitNotificationToRegulatorSuccessComponent } from '@requests/tasks/notification-submit/subtasks/submit-notification-to-regulator/submit-notification-to-regulator-success/submit-notification-to-regulator-success.component';

describe('SubmitNotificationToRegulatorSuccessComponent', () => {
  let component: SubmitNotificationToRegulatorSuccessComponent;
  let fixture: ComponentFixture<SubmitNotificationToRegulatorSuccessComponent>;
  let page: Page;

  class Page extends BasePage<SubmitNotificationToRegulatorSuccessComponent> {
    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitNotificationToRegulatorSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitNotificationToRegulatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent).toEqual('Notification sent to regulator');
    expect(page.heading3).toBeTruthy();
    expect(page.heading3.textContent.trim()).toEqual('What happens next');
    expect(page.paragraphs).toHaveLength(2);
  });
});
