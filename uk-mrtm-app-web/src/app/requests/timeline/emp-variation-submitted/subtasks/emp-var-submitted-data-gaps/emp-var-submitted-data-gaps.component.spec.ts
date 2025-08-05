import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedDataGapsComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-data-gaps';

describe('EmpVarSubmittedDataGapsComponent', () => {
  let component: EmpVarSubmittedDataGapsComponent;
  let fixture: ComponentFixture<EmpVarSubmittedDataGapsComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedDataGapsComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVarSubmittedDataGapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
