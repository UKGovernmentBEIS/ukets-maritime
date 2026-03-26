import { Routes } from '@angular/router';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import {
  canActivateOperatorDetailsStep,
  canActivateOperatorDetailsSummary,
} from '@requests/common/emp/subtasks/operator-details';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const OPERATOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: identifyMaritimeOperatorMap.title,
    canActivate: [canActivateOperatorDetailsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details/operator-details-summary').then(
        (c) => c.OperatorDetailsSummaryComponent,
      ),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
    title: identifyMaritimeOperatorMap.operatorDetails.title,
    canActivate: [canActivateOperatorDetailsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OperatorDetailsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.OperatorDetailsStepComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES,
    title: identifyMaritimeOperatorMap.undertakenActivities.title,
    canActivate: [canActivateOperatorDetailsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details/undertaken-activities/undertaken-activities.component').then(
        (c) => c.UndertakenActivitiesComponent,
      ),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION,
    title: identifyMaritimeOperatorMap.legalStatusOfOrganisation.title,
    canActivate: [canActivateOperatorDetailsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES,
      ),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.LegalStatusOfOrganisationComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS,
    title: identifyMaritimeOperatorMap.organisationDetails.title,
    canActivate: [canActivateOperatorDetailsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION,
      ),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.OrganisationDetailsComponent),
  },
];
