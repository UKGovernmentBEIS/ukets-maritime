import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceCivilPenaltyPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-civil-penalty-peer-review/components';
import { screen } from '@testing-library/angular';

describe('NonComplianceCivilPenaltyPeerReviewActionButtonsComponent', () => {
  let component: NonComplianceCivilPenaltyPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyPeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyPeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyPeerReviewActionButtonsComponent);
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
