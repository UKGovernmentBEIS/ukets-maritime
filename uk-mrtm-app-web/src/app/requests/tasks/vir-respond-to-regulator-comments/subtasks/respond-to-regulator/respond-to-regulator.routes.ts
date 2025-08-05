import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { virSubtaskList } from '@requests/common/vir';
import { canActivateVirRespondToRegulatorSummary } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator.guard';
import { VirRespondToRegulatorWizardStep } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator.helpers';

export const RESPOND_TO_REGULATOR_ROUTES: Routes = [
  {
    path: ':key',
    children: [
      {
        path: '',
        title: 'Check your answers',
        data: { breadcrumb: false, backlink: '../../../' },
        canActivate: [canActivateVirRespondToRegulatorSummary],
        loadComponent: () =>
          import(
            '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator-summary'
          ).then((c) => c.RespondToRegulatorSummaryComponent),
      },
      {
        path: VirRespondToRegulatorWizardStep.FORM,
        title: virSubtaskList.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(VirRespondToRegulatorWizardStep.SUMMARY, '../../../'),
        },
        loadComponent: () =>
          import(
            '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator-form'
          ).then((c) => c.RespondToRegulatorFormComponent),
      },
    ],
  },
];
