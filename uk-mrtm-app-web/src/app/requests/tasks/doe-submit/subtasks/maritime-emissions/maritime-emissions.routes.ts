import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { maritimeEmissionsMap } from '@requests/common/doe';
import {
  canActivateMaritimeEmissionsStep,
  canActivateMaritimeEmissionsSummary,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions.guard';
import { MaritimeEmissionsWizardStep } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions.helper';

export const MARITIME_EMISSIONS_ROUTES: Routes = [
  {
    path: '',
    title: maritimeEmissionsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateMaritimeEmissionsSummary],
    loadComponent: () =>
      import('@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions-summary').then(
        (c) => c.MaritimeEmissionsSummaryComponent,
      ),
  },
  {
    path: MaritimeEmissionsWizardStep.DETERMINATION_REASON,
    canActivate: [canActivateMaritimeEmissionsStep],
    title: maritimeEmissionsMap.determinationReason.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MaritimeEmissionsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/doe-submit/subtasks/maritime-emissions/determination-reason').then(
        (m) => m.DeterminationReasonComponent,
      ),
  },
  {
    path: MaritimeEmissionsWizardStep.TOTAL_MARITIME_EMISSIONS,
    canActivate: [canActivateMaritimeEmissionsStep],
    title: maritimeEmissionsMap.totalMaritimeEmissions.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MaritimeEmissionsWizardStep.SUMMARY, MaritimeEmissionsWizardStep.DETERMINATION_REASON),
    },
    loadComponent: () =>
      import('@requests/tasks/doe-submit/subtasks/maritime-emissions/total-maritime-emissions').then(
        (m) => m.TotalMaritimeEmissionsComponent,
      ),
  },
  {
    path: MaritimeEmissionsWizardStep.CHARGE_OPERATOR,
    canActivate: [canActivateMaritimeEmissionsStep],
    title: maritimeEmissionsMap.chargeOperator.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        MaritimeEmissionsWizardStep.SUMMARY,
        MaritimeEmissionsWizardStep.TOTAL_MARITIME_EMISSIONS,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/doe-submit/subtasks/maritime-emissions/charge-operator').then(
        (m) => m.ChargeOperatorComponent,
      ),
  },
  {
    path: MaritimeEmissionsWizardStep.FEE_DETAILS,
    canActivate: [canActivateMaritimeEmissionsStep],
    title: maritimeEmissionsMap.feeDetails.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MaritimeEmissionsWizardStep.SUMMARY, MaritimeEmissionsWizardStep.CHARGE_OPERATOR),
    },
    loadComponent: () =>
      import('@requests/tasks/doe-submit/subtasks/maritime-emissions/fee-details').then((m) => m.FeeDetailsComponent),
  },
];
