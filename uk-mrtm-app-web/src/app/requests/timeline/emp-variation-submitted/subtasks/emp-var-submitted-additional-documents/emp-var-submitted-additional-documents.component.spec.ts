import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { mockSubmittedStateBuild } from '@requests/common/emp/testing/emp-action-data.mock';
import { mockAdditionalDocuments } from '@requests/common/emp/testing/emp-data.mock';
import { taskProviders } from '@requests/common/task.providers';
import { EmpVarSubmittedAdditionalDocumentsComponent } from '@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-additional-documents';

describe('EmpVarSubmittedAdditionalDocumentsComponent', () => {
  let component: EmpVarSubmittedAdditionalDocumentsComponent;
  let fixture: ComponentFixture<EmpVarSubmittedAdditionalDocumentsComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVarSubmittedAdditionalDocumentsComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState(
      mockSubmittedStateBuild(
        { additionalDocuments: mockAdditionalDocuments },
        { '11111111-1111-4111-a111-111111111111': '100.png' },
      ),
    );
    fixture = TestBed.createComponent(EmpVarSubmittedAdditionalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
