import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { EmpReturnedForAmendsComponent } from '@requests/timeline/emp-returned-for-amends/emp-returned-for-amends.component';
import { EmpReturnedForAmendsPayload } from '@requests/timeline/emp-returned-for-amends/emp-returned-for-amends.types';

describe('EmpReturnedForAmendsComponent', () => {
  class Page extends BasePage<EmpReturnedForAmendsComponent> {}
  let component: EmpReturnedForAmendsComponent;
  let fixture: ComponentFixture<EmpReturnedForAmendsComponent>;
  let store: RequestActionStore;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReturnedForAmendsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReturnedForAmendsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'EMP_ISSUANCE_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD',
          reviewGroupDecisions: {
            MARITIME_OPERATOR_DETAILS: {
              details: {
                requiredChanges: [
                  {
                    reason: 'Please change address',
                  },
                ],
              },
              type: 'OPERATOR_AMENDS_NEEDED',
            },
          },
          reviewAttachments: {},
        } as EmpReturnedForAmendsPayload,
      },
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summariesContents).toEqual(['Changes required by operator', 'Please change address']);
  });
});
