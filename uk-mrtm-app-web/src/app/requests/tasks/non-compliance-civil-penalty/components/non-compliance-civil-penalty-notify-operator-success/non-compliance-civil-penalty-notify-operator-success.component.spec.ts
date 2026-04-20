import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceCivilPenaltyNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-civil-penalty/components/non-compliance-civil-penalty-notify-operator-success';
import { screen } from '@testing-library/dom';

describe('NonComplianceCivilPenaltyNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceCivilPenaltyNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyNotifyOperatorSuccessComponent>;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual('Civil penalty notice sent to operator');
    expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
  });
});
