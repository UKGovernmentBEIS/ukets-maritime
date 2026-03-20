import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { NonComplianceCivilPenaltyNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-civil-penalty/components/non-compliance-civil-penalty-notify-operator-success';

describe('NonComplianceCivilPenaltyNotifyOperatorSuccessComponent', () => {
  let component: NonComplianceCivilPenaltyNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyNotifyOperatorSuccessComponent>;
  let page: Page;
  const activatedRouteStub = new ActivatedRouteStub();

  class Page extends BasePage<NonComplianceCivilPenaltyNotifyOperatorSuccessComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct HTML Content', () => {
    expect(page.heading1.textContent).toEqual('Civil penalty notice sent to operator');
    expect(page.link.textContent).toEqual('Return to: Dashboard');
  });
});
