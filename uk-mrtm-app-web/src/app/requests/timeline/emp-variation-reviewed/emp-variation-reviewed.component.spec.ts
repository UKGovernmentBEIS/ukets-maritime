import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationReviewedComponent } from '@requests/timeline/emp-variation-reviewed/emp-variation-reviewed.component';

describe('EmpVariationReviewedComponent', () => {
  let component: EmpVariationReviewedComponent;
  let fixture: ComponentFixture<EmpVariationReviewedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationReviewedComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationReviewedComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'EMP_VARIATION_APPLICATION_APPROVED_PAYLOAD',
        },
      },
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
