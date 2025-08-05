import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerVerificationReturnToOperatorRequestTaskActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { AerVerificationReturnedToOperatorComponent } from '@requests/timeline/aer-verification-returned-to-operator/aer-verification-returned-to-operator.component';

describe('AerVerificationReturnedToOperatorComponent', () => {
  class Page extends BasePage<AerVerificationReturnedToOperatorComponent> {}

  let component: AerVerificationReturnedToOperatorComponent;
  let fixture: ComponentFixture<AerVerificationReturnedToOperatorComponent>;
  let page: Page;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerVerificationReturnedToOperatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerVerificationReturnedToOperatorComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        type: 'AER_VERIFICATION_RETURNED_TO_OPERATOR',
        submitter: 'Verifier User',
        payload: {
          payloadType: 'AER_VERIFICATION_RETURNED_TO_OPERATOR_PAYLOAD',
          changesRequired: 'Some text',
        } as AerVerificationReturnToOperatorRequestTaskActionPayload,
      },
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
    expect(page.summariesContents).toEqual(['Changes required from operator', 'Some text']);
  });
});
