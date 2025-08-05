import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { DataGapsMethodologiesSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/data-gaps-methodologies-submitted/data-gaps-methodologies-submitted.component';

describe('DataGapsMethodologiesSubmittedComponent', () => {
  let component: DataGapsMethodologiesSubmittedComponent;
  let fixture: ComponentFixture<DataGapsMethodologiesSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGapsMethodologiesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGapsMethodologiesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
