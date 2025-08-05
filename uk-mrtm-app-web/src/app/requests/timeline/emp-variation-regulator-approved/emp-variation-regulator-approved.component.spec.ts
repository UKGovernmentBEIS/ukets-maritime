import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationRegulatorApprovedComponent } from '@requests/timeline/emp-variation-regulator-approved/emp-variation-regulator-approved.component';

describe('EmpVariationRegulatorApprovedComponent', () => {
  let component: EmpVariationRegulatorApprovedComponent;
  let fixture: ComponentFixture<EmpVariationRegulatorApprovedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationRegulatorApprovedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationRegulatorApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
