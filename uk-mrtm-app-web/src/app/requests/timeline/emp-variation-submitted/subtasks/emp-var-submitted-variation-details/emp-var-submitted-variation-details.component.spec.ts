import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedVariationDetailsComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-variation-details';

describe('EmpVarSubmittedVariationDetailsComponent', () => {
  let component: EmpVarSubmittedVariationDetailsComponent;
  let fixture: ComponentFixture<EmpVarSubmittedVariationDetailsComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedVariationDetailsComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVarSubmittedVariationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
