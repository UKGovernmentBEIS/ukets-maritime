import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClosureSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { AccountClosureSubmittedComponent } from '@requests/timeline/account-closure-submitted/account-closure-submitted.component';

describe('AccountClosureSubmittedComponent', () => {
  let component: AccountClosureSubmittedComponent;
  let fixture: ComponentFixture<AccountClosureSubmittedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosureSubmittedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        type: 'ACCOUNT_CLOSURE_SUBMITTED',
        submitter: 'Regulator England',
        payload: {
          payloadType: 'ACCOUNT_CLOSURE_SUBMITTED_PAYLOAD',
          accountClosure: {
            reason: 'closure reason',
          },
        } as AccountClosureSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(AccountClosureSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
