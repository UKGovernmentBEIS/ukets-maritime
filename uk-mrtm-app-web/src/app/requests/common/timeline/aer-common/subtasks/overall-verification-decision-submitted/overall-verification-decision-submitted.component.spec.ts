import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { OverallVerificationDecisionSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/overall-verification-decision-submitted/overall-verification-decision-submitted.component';

describe('OverallVerificationDecisionSubmittedComponent', () => {
  let component: OverallVerificationDecisionSubmittedComponent;
  let fixture: ComponentFixture<OverallVerificationDecisionSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallVerificationDecisionSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(OverallVerificationDecisionSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
