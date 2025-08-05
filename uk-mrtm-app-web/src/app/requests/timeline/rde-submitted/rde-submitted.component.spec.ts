import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RdeSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { RdeSubmittedComponent } from '@requests/timeline/rde-submitted/rde-submitted.component';

describe('RdeSubmittedComponent', () => {
  let component: RdeSubmittedComponent;
  let fixture: ComponentFixture<RdeSubmittedComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
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
          rdePayload: {
            extensionDate: '2025-06-28',
            deadline: '2025-06-27',
            signatory: '00000000-0000-0000-0000-000000000001',
          },
          payloadType: 'RDE_SUBMITTED_PAYLOAD',
        } as RdeSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(RdeSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
