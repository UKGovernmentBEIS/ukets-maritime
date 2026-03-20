import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/components';

describe('NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent', () => {
  let component: NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button with correct label', () => {
    expect(page.query('a').textContent).toEqual('Peer review decision');
  });
});
