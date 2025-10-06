import { Route } from '@angular/router';

import {
  MANDATE_REGISTERED_OWNER_FORM_MODE,
  MANDATE_REGISTERED_OWNER_PARAM,
  MandateWizardStep,
} from '@requests/common/emp/subtasks/mandate';
import {
  canActivateMandateDecision,
  canActivateMandateStep,
  canActivateRegisteredOwners,
} from '@requests/common/emp/subtasks/mandate/mandate.guard';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { canActivateMandateSummary } from '@requests/tasks/emp-variation-review/subtasks/mandate/mandate.guard';

export const MANDATE_ROUTES: Route[] = [
  {
    path: '',
    title: mandateMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateMandateSummary],
    loadComponent: () => import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateSummaryComponent),
  },
  {
    path: MandateWizardStep.DECISION,
    title: mandateMap.decision.title,
    canActivate: [canActivateMandateDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/mandate/mandate-variation-review-decision').then(
        (c) => c.MandateVariationReviewDecisionComponent,
      ),
  },
  {
    path: MandateWizardStep.RESPONSIBILITY,
    title: mandateMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateMandateStep(MandateWizardStep.DECISION)],
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () => import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateResponsibilityComponent),
  },
  {
    path: MandateWizardStep.RESPONSIBILITY_DECLARATION,
    title: mandateMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateMandateStep(MandateWizardStep.DECISION)],
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, MandateWizardStep.REGISTERED_OWNERS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateResponsibilityDeclarationComponent),
  },
  {
    path: MandateWizardStep.REGISTERED_OWNERS,
    canActivate: [canActivateMandateStep(MandateWizardStep.DECISION), canActivateRegisteredOwners],
    children: [
      {
        path: '',
        title: mandateMap.registeredOwners.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(MandateWizardStep.SUMMARY, MandateWizardStep.RESPONSIBILITY),
        },
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateRegisteredOwnersListComponent),
      },
      {
        path: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD,
        title: mandateMap.registeredOwnersAddForm.caption,
        data: { breadcrumb: false, backlink: '../' },
        providers: [
          { provide: MANDATE_REGISTERED_OWNER_FORM_MODE, useValue: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD },
        ],
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateRegisteredOwnersFormComponent),
      },
      {
        path: `${MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT}/:${MANDATE_REGISTERED_OWNER_PARAM}`,
        title: mandateMap.registeredOwnersEditForm.caption,
        data: { breadcrumb: false, backlink: '../../' },
        providers: [
          { provide: MANDATE_REGISTERED_OWNER_FORM_MODE, useValue: MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT },
        ],
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateRegisteredOwnersFormComponent),
      },
    ],
  },
  {
    path: MandateWizardStep.UPLOAD_OWNERS,
    title: mandateMap.uploadOwners.title,
    data: { breadcrumb: false },
    canActivate: [canActivateRegisteredOwners],
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, MandateWizardStep.REGISTERED_OWNERS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate/mandate-upload').then((c) => c.MandateUploadComponent),
  },
];
