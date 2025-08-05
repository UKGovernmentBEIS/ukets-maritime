import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpReviewedComponent } from '@requests/timeline/emp-reviewed/emp-reviewed.component';

describe('EmpReviewedComponent', () => {
  let component: EmpReviewedComponent;
  let fixture: ComponentFixture<EmpReviewedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReviewedComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReviewedComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'EMP_ISSUANCE_APPLICATION_APPROVED_PAYLOAD',
        },
      },
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
