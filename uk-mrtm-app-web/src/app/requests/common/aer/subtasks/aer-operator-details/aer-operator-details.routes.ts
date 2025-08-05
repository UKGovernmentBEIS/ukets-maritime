import { Routes } from '@angular/router';

import {
  canActivateAerOperatorDetailsStep,
  canActivateAerOperatorDetailsSummary,
} from '@requests/common/aer/subtasks/aer-operator-details';
import { operatorDetailsMap, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { backlinkResolver } from '@requests/common/task-navigation';

export const AER_OPERATOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: operatorDetailsMap.title,
    canActivate: [canActivateAerOperatorDetailsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-operator-details').then((c) => c.AerOperatorDetailsSummaryComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
    title: operatorDetailsMap.operatorDetails.title,
    canActivate: [canActivateAerOperatorDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OperatorDetailsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.OperatorDetailsStepComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION,
    title: operatorDetailsMap.legalStatusOfOrganisation.title,
    canActivate: [canActivateAerOperatorDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        OperatorDetailsWizardStep.SUMMARY,
        OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM,
      ),
    },
    loadComponent: () =>
      import('@requests/common/components/operator-details').then((c) => c.LegalStatusOfOrganisationComponent),
  },
  {
    path: OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS,
    title: operatorDetailsMap.organisationDetails.title,
    canActivate: [canActivateAerOperatorDetailsStep],
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
