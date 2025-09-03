import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceCivilPenaltyTimelinePayload } from '@requests/common/non-compliance';
import { NonComplianceCivilPenaltySubmittedComponent } from '@requests/timeline/non-compliance-civil-penalty-submitted/non-compliance-civil-penalty-submitted.component';

describe('NonComplianceCivilPenaltySubmittedComponent', () => {
  let component: NonComplianceCivilPenaltySubmittedComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltySubmittedComponent>;
  let store: RequestActionStore;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltySubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {} as NonComplianceCivilPenaltyTimelinePayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceCivilPenaltySubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
