import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RfiSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { RfiSubmittedComponent } from '@requests/timeline/rfi-submitted/rfi-submitted.component';

describe('RfiSubmittedComponent', () => {
  let component: RfiSubmittedComponent;
  let fixture: ComponentFixture<RfiSubmittedComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          rfiSubmitPayload: {
            deadline: '2025-06-29',
            questions: ['q1', 'q2'],
            signatory: '00000000-0000-0000-0000-000000000001',
            files: ['00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f2'],
          },
          usersInfo: {
            '00000000-0000-0000-0000-000000000001': {
              name: 'Regulator England',
            },
            '00000000-0000-0000-0000-000000000002': {
              name: 'Operator 1',
              roleCode: 'operator_admin',
              contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
            },
          },
          officialDocument: {
            name: 'file name',
            uuid: '00000000-0000-0000-0000-00000000000f',
          },
          rfiAttachments: {
            '00000000-0000-0000-0000-0000000000f1': 'Attached file 1',
            '00000000-0000-0000-0000-0000000000f2': 'Attached file 2',
          },
          payloadType: 'RFI_SUBMITTED_PAYLOAD',
        } as RfiSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(RfiSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
