import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceInitialPenaltyNoticeTimelinePayload } from '@requests/common/non-compliance';
import { NonComplianceInitialPenaltyNoticeSubmittedComponent } from '@requests/timeline/non-compliance-initial-penalty-notice-submitted/non-compliance-initial-penalty-notice-submitted.component';

describe('NonComplianceInitialPenaltyNoticeSubmittedComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeSubmittedComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeSubmittedComponent>;
  let store: RequestActionStore;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {} as NonComplianceInitialPenaltyNoticeTimelinePayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
