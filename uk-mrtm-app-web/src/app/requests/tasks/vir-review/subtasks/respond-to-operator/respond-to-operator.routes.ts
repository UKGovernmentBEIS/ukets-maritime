import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { canActivateVirRespondToOperatorSummary } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.guard';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';

export const RESPOND_TO_OPERATOR_ROUTES: Routes = [
  {
    path: ':key',
    children: [
      {
        path: '',
        title: 'Check your answers',
        data: { breadcrumb: false, backlink: '../../../' },
        canActivate: [canActivateVirRespondToOperatorSummary],
        loadComponent: () =>
          import('@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator-summary').then(
            (c) => c.RespondToOperatorSummaryComponent,
          ),
      },
      {
        path: VirRespondToOperatorWizardStep.RESPOND_TO,
        title: (activatedRoute: ActivatedRouteSnapshot) => `Respond to ${activatedRoute.params.key}`,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(VirRespondToRecommendationWizardStep.SUMMARY, '../../../'),
        },
        loadComponent: () =>
          import('@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator-form').then(
            (c) => c.RespondToOperatorFormComponent,
          ),
      },
    ],
  },
];
