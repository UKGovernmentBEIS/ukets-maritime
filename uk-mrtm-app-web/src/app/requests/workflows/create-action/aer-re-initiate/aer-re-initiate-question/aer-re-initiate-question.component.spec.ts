import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { AerReInitiateQuestionComponent } from '@requests/workflows/create-action/aer-re-initiate/aer-re-initiate-question';

describe('AerReInitiateQuestionComponent', () => {
  let component: AerReInitiateQuestionComponent;
  let fixture: ComponentFixture<AerReInitiateQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReInitiateQuestionComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReInitiateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
