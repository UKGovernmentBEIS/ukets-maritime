import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { MANDATE_ROUTES, mandateSubtaskMap, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { canActivateMandateDecision } from '@requests/common/emp/subtasks/mandate/mandate.guard';
import { canActivateMandateSummary } from '@requests/tasks/emp-review/subtasks/mandate/mandate.guard';

export const MANDATE_REVIEW_ROUTES: Routes = [
  ...MANDATE_ROUTES.filter((route) => route.path !== ''),
  {
    path: '',
    title: mandateSubtaskMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateMandateSummary],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/mandate/mandate-summary').then((c) => c.MandateSummaryComponent),
  },
  {
    path: MandateWizardStep.DECISION,
    title: mandateSubtaskMap.decision.title,
    canActivate: [canActivateMandateDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MandateWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-review/subtasks/mandate/mandate-decision').then((c) => c.MandateDecisionComponent),
  },
];
