import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { AerReturnedForAmendsComponent } from '@requests/timeline/aer-returned-for-amends/aer-returned-for-amends.component';
import { AerReturnedForAmendsActionPayload } from '@requests/timeline/aer-returned-for-amends/aer-returned-for-amends.type';

describe('AerReturnedForAmendsComponent', () => {
  class Page extends BasePage<AerReturnedForAmendsComponent> {}
  let component: AerReturnedForAmendsComponent;
  let fixture: ComponentFixture<AerReturnedForAmendsComponent>;
  let store: RequestActionStore;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReturnedForAmendsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReturnedForAmendsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'AER_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD',
          reviewGroupDecisions: {
            OPERATOR_DETAILS: {
              details: {
                requiredChanges: [{ reason: 'Please change address' }],
              },
              type: 'OPERATOR_AMENDS_NEEDED',
            },
          },
          reviewAttachments: {},
        } as AerReturnedForAmendsActionPayload,
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
