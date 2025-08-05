import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { EtsComplianceRulesSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/ets-compliance-rules-submitted/ets-compliance-rules-submitted.component';

describe('EtsComplianceRulesSubmittedComponent', () => {
  let component: EtsComplianceRulesSubmittedComponent;
  let fixture: ComponentFixture<EtsComplianceRulesSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtsComplianceRulesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(EtsComplianceRulesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
