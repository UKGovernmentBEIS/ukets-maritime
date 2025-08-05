import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-notice-of-intent/components/non-compliance-notice-of-intent-notify-operator-success';
import { screen } from '@testing-library/dom';

describe('NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual('Notice of intent sent to operator');
    expect(screen.getAllByRole('heading')[1].textContent).toEqual('What happens next');
    expect(screen.getAllByRole('paragraph')[0].textContent.trim()).toEqual(
      'The operator can respond within 28 days of you issuing this notice.',
    );
    expect(screen.getAllByRole('paragraph')[1].textContent.trim()).toEqual(
      'As they may respond in other ways, such as by email, you may also choose to send them the penalty notice within this time.',
    );
    expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
  });
});
