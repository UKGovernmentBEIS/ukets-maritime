import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { RecommendedImprovementsSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/recommended-improvements-submitted/recommended-improvements-submitted.component';

describe('RecommendedImprovementsSubmittedComponent', () => {
  let component: RecommendedImprovementsSubmittedComponent;
  let fixture: ComponentFixture<RecommendedImprovementsSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedImprovementsSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedImprovementsSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
