import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ITEM_ACTION_TRANSFORMER, ITEM_ACTIONS_MAP, TASK_STATUS_TAG_MAP } from '@netz/common/pipes';
import { ActivatedRouteStub } from '@netz/common/testing';

import { itemActionsMap } from '@requests/common/item-actions.map';
import { statusTagMap } from '@requests/common/status-tag.map';
import { WorkflowStore } from '@requests/workflows/+state';
import { WorkflowDetailsComponent } from '@requests/workflows/workflow-details/workflow-details.component';
import { itemActionToTitleTransformer } from '@shared/utils/transformers';

describe('WorkflowDetailsComponent', () => {
  let component: WorkflowDetailsComponent;
  let fixture: ComponentFixture<WorkflowDetailsComponent>;
  let store: WorkflowStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TASK_STATUS_TAG_MAP, useValue: statusTagMap },
        { provide: ITEM_ACTIONS_MAP, useValue: itemActionsMap },
        { provide: ITEM_ACTION_TRANSFORMER, useValue: itemActionToTitleTransformer },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WorkflowDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(WorkflowStore);

    store.setState({
      details: { id: 'MAMP00020', requestType: 'EMP_ISSUANCE', requestStatus: 'APPROVED', creationDate: '2024-11-07' },
      actions: [
        {
          id: 37,
          type: 'EMP_ISSUANCE_APPLICATION_SUBMITTED',
          submitter: 'Operator Admin',
          creationDate: '2024-11-07T18:43:19.649765Z',
        },
      ],
      tasks: [],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
