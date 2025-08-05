import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { UncorrectedNonCompliancesSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/uncorrected-non-compliances-submitted/uncorrected-non-compliances-submitted.component';

describe('UncorrectedNonCompliancesSubmittedComponent', () => {
  let component: UncorrectedNonCompliancesSubmittedComponent;
  let fixture: ComponentFixture<UncorrectedNonCompliancesSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonCompliancesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonCompliancesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
