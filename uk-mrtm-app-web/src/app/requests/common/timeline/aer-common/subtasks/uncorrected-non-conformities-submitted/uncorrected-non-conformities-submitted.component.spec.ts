import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { UncorrectedNonConformitiesSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/uncorrected-non-conformities-submitted/uncorrected-non-conformities-submitted.component';

describe('UncorrectedNonConformitiesSubmittedComponent', () => {
  let component: UncorrectedNonConformitiesSubmittedComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
