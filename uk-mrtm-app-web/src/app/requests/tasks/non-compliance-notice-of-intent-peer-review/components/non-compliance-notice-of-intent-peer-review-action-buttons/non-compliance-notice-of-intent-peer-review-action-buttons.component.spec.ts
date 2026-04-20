import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/components';
import { screen } from '@testing-library/angular';

describe('NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent', () => {
  let component: NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button with correct label', () => {
    const button = screen.getByRole('link');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual('Peer review decision');
  });
});
