import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { SubmitToRegulatorSuccessComponent } from '@requests/tasks/notification-follow-up/subtasks/submit-to-regulator/submit-to-regulator-success/submit-to-regulator-success.component';

describe('SubmitToRegulatorSuccessComponent', () => {
  let component: SubmitToRegulatorSuccessComponent;
  let fixture: ComponentFixture<SubmitToRegulatorSuccessComponent>;
  let page: Page;

  class Page extends BasePage<SubmitToRegulatorSuccessComponent> {
    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitToRegulatorSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitToRegulatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent).toEqual('Response sent to regulator');
    expect(page.heading3).toBeTruthy();
    expect(page.heading3.textContent.trim()).toEqual('What happens next');
    expect(page.paragraphs).toHaveLength(2);
  });
});
