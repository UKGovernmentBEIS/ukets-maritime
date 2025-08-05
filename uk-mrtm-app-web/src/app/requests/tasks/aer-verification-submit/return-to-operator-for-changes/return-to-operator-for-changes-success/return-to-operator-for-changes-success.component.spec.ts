import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import {
  initialReturnToOperatorForChangesState,
  ReturnToOperatorForChangesStore,
} from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state';
import { ReturnToOperatorForChangesSuccessComponent } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes-success/return-to-operator-for-changes-success.component';

describe('ReturnToOperatorForChangesSuccessComponent', () => {
  let component: ReturnToOperatorForChangesSuccessComponent;
  let fixture: ComponentFixture<ReturnToOperatorForChangesSuccessComponent>;
  const route = new ActivatedRouteStub();
  let store: ReturnToOperatorForChangesStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnToOperatorForChangesSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    store = TestBed.inject(ReturnToOperatorForChangesStore);
    fixture = TestBed.createComponent(ReturnToOperatorForChangesSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the store when leaving the page', () => {
    store.setState({
      isSubmitted: true,
      changesRequired: 'lorem ipsum',
    });
    fixture.destroy();
    expect(store.state).toEqual(initialReturnToOperatorForChangesState);
  });
});
