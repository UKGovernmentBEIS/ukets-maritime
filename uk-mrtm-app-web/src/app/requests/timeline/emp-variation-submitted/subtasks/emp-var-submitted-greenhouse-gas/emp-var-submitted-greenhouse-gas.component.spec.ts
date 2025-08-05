import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedGreenhouseGasComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-greenhouse-gas';

describe('EmpVarSubmittedGreenhouseGasComponent', () => {
  let component: EmpVarSubmittedGreenhouseGasComponent;
  let fixture: ComponentFixture<EmpVarSubmittedGreenhouseGasComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedGreenhouseGasComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVarSubmittedGreenhouseGasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
