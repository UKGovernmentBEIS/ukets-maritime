import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationRegulatorSuccessComponent } from '@requests/tasks/emp-variation-regulator/components';

describe('EmpVariationRegulatorSuccessComponent', () => {
  let component: EmpVariationRegulatorSuccessComponent;
  let fixture: ComponentFixture<EmpVariationRegulatorSuccessComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationRegulatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationRegulatorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
