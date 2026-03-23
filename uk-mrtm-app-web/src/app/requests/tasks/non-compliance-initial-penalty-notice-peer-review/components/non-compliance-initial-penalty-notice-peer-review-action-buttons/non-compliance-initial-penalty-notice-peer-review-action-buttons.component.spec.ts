import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/components';
import { screen } from '@testing-library/angular';

describe('NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent', () => {
  let component: NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent);
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
