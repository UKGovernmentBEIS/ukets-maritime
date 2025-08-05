import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { OpinionStatementSubmittedComponent } from '@requests/common/timeline/aer-common/subtasks/opinion-statement-submitted/opinion-statement-submitted.component';

describe('OpinionStatementSubmittedComponent', () => {
  let component: OpinionStatementSubmittedComponent;
  let fixture: ComponentFixture<OpinionStatementSubmittedComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionStatementSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...actionProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(OpinionStatementSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
