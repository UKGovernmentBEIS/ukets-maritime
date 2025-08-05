import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { MaterialityLevelSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/materiality-level-submitted/materiality-level-submitted.component';

describe('MaterialityLevelSubmittedComponent', () => {
  let component: MaterialityLevelSubmittedComponent;
  let fixture: ComponentFixture<MaterialityLevelSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialityLevelSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialityLevelSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
