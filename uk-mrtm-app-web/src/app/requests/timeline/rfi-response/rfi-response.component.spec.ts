import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RfiResponseSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { RfiResponseComponent } from '@requests/timeline/rfi-response/rfi-response.component';

describe('RfiResponseComponent', () => {
  let component: RfiResponseComponent;
  let fixture: ComponentFixture<RfiResponseComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiResponseComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          rfiQuestionPayload: {
            questions: ['q1', 'q2'],
            files: ['00000000-0000-0000-0000-0000000000q1', '00000000-0000-0000-0000-0000000000q2'],
          },
          rfiResponsePayload: {
            answers: ['a1', 'a2'],
            files: ['00000000-0000-0000-0000-0000000000r1', '00000000-0000-0000-0000-0000000000r2'],
          },
          rfiAttachments: {
            '00000000-0000-0000-0000-0000000000q1': 'regulator file 1',
            '00000000-0000-0000-0000-0000000000q2': 'regulator file 2',
            '00000000-0000-0000-0000-0000000000r1': 'operator file 1',
            '00000000-0000-0000-0000-0000000000r2': 'operator file 2',
          },
          payloadType: 'RFI_RESPONSE_SUBMITTED_PAYLOAD',
        } as RfiResponseSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(RfiResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
