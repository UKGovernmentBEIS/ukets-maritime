import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVarSubmittedShipComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-ship';

describe('EmpVarSubmittedShipComponent', () => {
  let component: EmpVarSubmittedShipComponent;
  let fixture: ComponentFixture<EmpVarSubmittedShipComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    route.snapshot.params = { shipId: 1 };
    fixture = TestBed.createComponent(EmpVarSubmittedShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
