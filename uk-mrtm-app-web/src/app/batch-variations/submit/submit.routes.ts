import { Routes } from '@angular/router';

import { canActivateStep } from '@batch-variations/submit/step.guard';
import { SubmitWizardSteps } from '@batch-variations/submit/submit.helpers';
import { submitBacklinkResolver } from '@batch-variations/submit/submit-backlink.resolver';
import { PendingRequestGuard } from '@core/guards';

export const SUBMIT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [canActivateStep(SubmitWizardSteps.SUMMARY)],
    canDeactivate: [PendingRequestGuard],
    data: { backlink: '../', breadcrumb: false },
    loadComponent: () => import('@batch-variations/submit/summary').then((c) => c.SummaryComponent),
  },
  {
    path: SubmitWizardSteps.EMP_LOG,
    data: { breadcrumb: false },
    canActivate: [canActivateStep(SubmitWizardSteps.EMP_LOG)],
    resolve: {
      backlink: submitBacklinkResolver(SubmitWizardSteps.SUMMARY, '../'),
    },
    loadComponent: () => import('@batch-variations/submit/emp-log').then((c) => c.EmpLogComponent),
  },
  {
    path: SubmitWizardSteps.SIGNATURE,
    data: { breadcrumb: false },
    canActivate: [canActivateStep(SubmitWizardSteps.SIGNATURE)],
    resolve: {
      backlink: submitBacklinkResolver(SubmitWizardSteps.SUMMARY, SubmitWizardSteps.EMP_LOG),
    },
    loadComponent: () => import('@batch-variations/submit/signature').then((c) => c.SignatureComponent),
  },
  {
    path: 'success',
    canActivate: [canActivateStep(SubmitWizardSteps.SUMMARY)],
    data: { breadcrumb: true, backlink: false },
    loadComponent: () => import('@batch-variations/submit/success').then((c) => c.SuccessComponent),
  },
];
