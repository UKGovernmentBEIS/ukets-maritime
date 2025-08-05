import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/components/non-compliance-initial-penalty-notice-notify-operator-success';
import { screen } from '@testing-library/dom';

describe('NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual('Initial penalty notice sent to operator');
    expect(screen.getAllByRole('heading')[1].textContent).toEqual('What happens next');
    expect(screen.getByRole('paragraph').textContent).toEqual(
      'You can now issue a notice of intent to the operator from your task dashboard.',
    );
    expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
  });
});
