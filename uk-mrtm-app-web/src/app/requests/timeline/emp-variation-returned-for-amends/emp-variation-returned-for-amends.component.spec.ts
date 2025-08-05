import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { EmpVariationReturnedForAmendsComponent } from '@requests/timeline/emp-variation-returned-for-amends/emp-variation-returned-for-amends.component';
import { EmpVariationReturnedForAmendsActionPayload } from '@requests/timeline/emp-variation-returned-for-amends/emp-variation-returned-for-amends.type';

describe('EmpVariationReturnedForAmendsComponent', () => {
  class Page extends BasePage<EmpVariationReturnedForAmendsComponent> {}
  let component: EmpVariationReturnedForAmendsComponent;
  let fixture: ComponentFixture<EmpVariationReturnedForAmendsComponent>;
  let store: RequestActionStore;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationReturnedForAmendsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationReturnedForAmendsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'EMP_VARIATION_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD',
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
        } as EmpVariationReturnedForAmendsActionPayload,
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
