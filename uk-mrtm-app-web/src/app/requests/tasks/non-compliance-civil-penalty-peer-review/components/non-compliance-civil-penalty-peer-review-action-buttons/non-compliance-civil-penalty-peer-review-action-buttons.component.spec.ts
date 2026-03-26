import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceCivilPenaltyPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-civil-penalty-peer-review/components';

describe('NonComplianceCivilPenaltyPeerReviewActionButtonsComponent', () => {
  let component: NonComplianceCivilPenaltyPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyPeerReviewActionButtonsComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceCivilPenaltyPeerReviewActionButtonsComponent> {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyPeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyPeerReviewActionButtonsComponent);
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
