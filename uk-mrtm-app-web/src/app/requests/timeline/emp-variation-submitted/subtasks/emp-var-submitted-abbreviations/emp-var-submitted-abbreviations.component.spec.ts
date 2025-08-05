import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedAbbreviationsComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-abbreviations';

describe('EmpVarSubmittedAbbreviationsComponent', () => {
  let component: EmpVarSubmittedAbbreviationsComponent;
  let fixture: ComponentFixture<EmpVarSubmittedAbbreviationsComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedAbbreviationsComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVarSubmittedAbbreviationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
