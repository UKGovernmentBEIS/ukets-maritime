import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-notice-of-intent/components/non-compliance-notice-of-intent-notify-operator-success';

describe('NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent>;
  let page: Page;

  const activatedRouteStub = new ActivatedRouteStub();

  class Page extends BasePage<NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent> {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    });

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(page.heading1.textContent).toEqual('Notice of intent sent to operator');
    expect(page.heading3.textContent).toEqual('What happens next');
    expect(page.paragraphs.map((item) => item.textContent.trim())).toEqual([
      'The operator can respond within 28 days of you issuing this notice.',
      'As they may respond in other ways, such as by email, you may also choose to send them the penalty notice within this time.',
    ]);
    expect(page.link.textContent).toEqual('Return to: Dashboard');
  });
});
