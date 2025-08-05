import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NonComplianceNoticeOfIntentTimelinePayload } from '@requests/common/non-compliance';
import { NonComplianceNoticeOfIntentSubmittedComponent } from '@requests/timeline/non-compliance-notice-of-intent-submitted/non-compliance-notice-of-intent-submitted.component';

describe('NonComplianceNoticeOfIntentSubmittedComponent', () => {
  let component: NonComplianceNoticeOfIntentSubmittedComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentSubmittedComponent>;
  let store: RequestActionStore;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {} as NonComplianceNoticeOfIntentTimelinePayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
