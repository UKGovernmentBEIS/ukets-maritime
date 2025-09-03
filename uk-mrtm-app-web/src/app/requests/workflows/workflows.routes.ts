import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { TASK_RELATED_ACTIONS_MAP } from '@netz/common/components';
import {
  DAYS_REMAINING_INPUT_TRANSFORMER,
  ITEM_ACTION_TRANSFORMER,
  ITEM_ACTIONS_MAP,
  ITEM_LINK_REQUEST_TYPES_WHITELIST,
  ITEM_NAME_TRANSFORMER,
  TASK_STATUS_TAG_MAP,
} from '@netz/common/pipes';

import { NoteFileDownloadComponent } from '@notes/components';
import { itemActionsMap } from '@requests/common/item-actions.map';
import { relatedActionsMap } from '@requests/common/related-actions.map';
import { statusTagMap } from '@requests/common/status-tag.map';
import { getWorkflowCanActivateGuard, getWorkflowCanDeactivateGuard } from '@requests/workflows/workflows.guards';
import { requestTypesWhitelistForItemLinkPipe } from '@shared/constants';
import {
  daysRemainingTransformer,
  itemActionToTitleTransformer,
  taskActionTypeToTitleTransformer,
} from '@shared/utils';

export const WORKFLOWS_ROUTES: Route[] = [
  {
    path: ':workflowId',
    providers: [
      { provide: TASK_STATUS_TAG_MAP, useValue: statusTagMap },
      { provide: ITEM_ACTIONS_MAP, useValue: itemActionsMap },
      { provide: ITEM_ACTION_TRANSFORMER, useValue: itemActionToTitleTransformer },
      { provide: ITEM_NAME_TRANSFORMER, useValue: taskActionTypeToTitleTransformer },
      { provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: requestTypesWhitelistForItemLinkPipe },
      { provide: DAYS_REMAINING_INPUT_TRANSFORMER, useValue: daysRemainingTransformer },
      { provide: TASK_RELATED_ACTIONS_MAP, useValue: relatedActionsMap },
    ],
    data: { backlink: false, breadcrumb: ({ workflowId }) => workflowId },
    resolve: { workflowId: (route: ActivatedRouteSnapshot) => route.params?.['workflowId'] },
    canActivate: [getWorkflowCanActivateGuard],
    canDeactivate: [getWorkflowCanDeactivateGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('@requests/workflows/workflow-details').then((c) => c.WorkflowDetailsComponent),
      },
      { path: 'timeline', loadChildren: () => import('@requests/timeline').then((r) => r.TIMELINE_ROUTES) },
      { path: 'notes', loadChildren: () => import('@notes/notes.routes').then((r) => r.NOTES_ROUTES) },
      {
        path: 'create-action',
        loadChildren: () => import('@requests/workflows/create-action').then((r) => r.CREATE_ACTION_ROUTES),
      },
      { path: 'file-download/:uuid', component: NoteFileDownloadComponent },
    ],
  },
];
