import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { UncorrectedMisstatementsSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/uncorrected-misstatements-submitted/uncorrected-misstatements-submitted.component';

describe('UncorrectedMisstatementsSubmittedComponent', () => {
  let component: UncorrectedMisstatementsSubmittedComponent;
  let fixture: ComponentFixture<UncorrectedMisstatementsSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedMisstatementsSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedMisstatementsSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
