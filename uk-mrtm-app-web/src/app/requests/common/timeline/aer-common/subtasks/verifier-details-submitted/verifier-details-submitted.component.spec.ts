import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { VerifierDetailsSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/verifier-details-submitted/verifier-details-submitted.component';

describe('VerifierDetailsSubmittedComponent', () => {
  let component: VerifierDetailsSubmittedComponent;
  let fixture: ComponentFixture<VerifierDetailsSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifierDetailsSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifierDetailsSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
