import { Routes } from '@angular/router';

import {
  canActivateMandateSummary,
  canActivateMandateWizardStep,
  canActivateRegisteredOwners,
} from '@requests/common/emp/subtasks/mandate/mandate.guard';
import {
  MANDATE_REGISTERED_OWNER_FORM_MODE,
  MANDATE_REGISTERED_OWNER_PARAM,
  MandateWizardStep,
} from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { mandateSubtaskMap } from '@requests/common/emp/subtasks/mandate/mandate-subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const MANDATE_ROUTES: Routes = [
  {
    path: '',
    title: mandateSubtaskMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateMandateSummary],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate/mandate-summary').then((c) => c.MandateSummaryComponent),
  },
  {
    path: MandateWizardStep.RESPONSIBILITY,
    title: mandateSubtaskMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateMandateWizardStep],
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate/mandate-responsibility').then(
        (c) => c.MandateResponsibilityComponent,
      ),
  },
  {
    path: MandateWizardStep.RESPONSIBILITY_DECLARATION,
    title: mandateSubtaskMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateMandateWizardStep],
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, MandateWizardStep.REGISTERED_OWNERS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration').then(
        (c) => c.MandateResponsibilityDeclarationComponent,
      ),
  },
  {
    path: MandateWizardStep.REGISTERED_OWNERS,
    canActivate: [canActivateMandateWizardStep, canActivateRegisteredOwners],
    children: [
      {
        path: '',
        title: mandateSubtaskMap.registeredOwners.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(MandateWizardStep.SUMMARY, MandateWizardStep.RESPONSIBILITY),
        },
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate/mandate-registered-owners-list').then(
            (c) => c.MandateRegisteredOwnersListComponent,
          ),
      },
      {
        path: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD,
        title: mandateSubtaskMap.registeredOwnersAddForm.caption,
        data: { breadcrumb: false, backlink: '../' },
        providers: [
          { provide: MANDATE_REGISTERED_OWNER_FORM_MODE, useValue: MandateWizardStep.REGISTERED_OWNERS_FORM_ADD },
        ],
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate/mandate-registered-owners-form').then(
            (c) => c.MandateRegisteredOwnersFormComponent,
          ),
      },
      {
        path: `${MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT}/:${MANDATE_REGISTERED_OWNER_PARAM}`,
        title: mandateSubtaskMap.registeredOwnersEditForm.caption,
        data: { breadcrumb: false, backlink: '../../' },
        providers: [
          { provide: MANDATE_REGISTERED_OWNER_FORM_MODE, useValue: MandateWizardStep.REGISTERED_OWNERS_FORM_EDIT },
        ],
        loadComponent: () =>
          import('@requests/common/emp/subtasks/mandate/mandate-registered-owners-form').then(
            (c) => c.MandateRegisteredOwnersFormComponent,
          ),
      },
    ],
  },
];
