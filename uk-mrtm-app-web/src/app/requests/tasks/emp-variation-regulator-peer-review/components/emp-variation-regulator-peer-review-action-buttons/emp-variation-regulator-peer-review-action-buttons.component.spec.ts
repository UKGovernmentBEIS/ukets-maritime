import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationRegulatorPeerReviewActionButtonsComponent } from '@requests/tasks/emp-variation-regulator-peer-review/components';

describe('EmpVariationRegulatorPeerReviewActionButtonsComponent', () => {
  let component: EmpVariationRegulatorPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<EmpVariationRegulatorPeerReviewActionButtonsComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationRegulatorPeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationRegulatorPeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
