import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/components';

describe('NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent', () => {
  let component: NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent);
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
