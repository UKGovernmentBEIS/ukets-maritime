import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/components/non-compliance-initial-penalty-notice-notify-operator-success';

describe('NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent;
  let page: Page;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();

  class Page extends BasePage<NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(page.heading1.textContent).toEqual('Initial penalty notice sent to operator');
    expect(page.heading3.textContent).toEqual('What happens next');
    expect(page.paragraph.textContent).toEqual(
      'You can now issue a notice of intent to the operator from your task dashboard.',
    );
    expect(page.link.textContent).toEqual('Return to: Dashboard');
  });
});
