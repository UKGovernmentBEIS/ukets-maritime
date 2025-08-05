import { Routes } from '@angular/router';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import {
  canActivateOperatorDetailsDecision,
  canActivateOperatorDetailsStep,
} from '@requests/common/emp/subtasks/operator-details';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { canActivateOperatorDetailsSummary } from '@requests/tasks/emp-variation-review/subtasks/operator-details';

export const OPERATOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: identifyMaritimeOperatorMap.title,
    canActivate: [canActivateOperatorDetailsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details').then((c) => c.OperatorDetailsSummaryComponent),
  },
  {
    path: OperatorDetailsWizardStep.DECISION,
    title: identifyMaritimeOperatorMap.decision.title,
    canActivate: [canActivateOperatorDetailsDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OperatorDetailsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/operator-details').then(
        (c) => c.OperatorDetailsVariationReviewDecisionComponent,
      ),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
    title: identifyMaritimeOperatorMap.operatorDetails.title,
    canActivate: [canActivateOperatorDetailsStep(OperatorDetailsWizardStep.DECISION)],
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
    canActivate: [canActivateOperatorDetailsStep(OperatorDetailsWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details').then((c) => c.UndertakenActivitiesComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_DECLARATION_DOCUMENTS,
    title: identifyMaritimeOperatorMap.declarationDocuments.title,
    canActivate: [canActivateOperatorDetailsStep(OperatorDetailsWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details').then((c) => c.DeclarationDocumentsComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION,
    title: identifyMaritimeOperatorMap.legalStatusOfOrganisation.title,
    canActivate: [canActivateOperatorDetailsStep(OperatorDetailsWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_DECLARATION_DOCUMENTS,
      ),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.LegalStatusOfOrganisationComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS,
    title: identifyMaritimeOperatorMap.organisationDetails.title,
    canActivate: [canActivateOperatorDetailsStep(OperatorDetailsWizardStep.DECISION)],
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
