import { Routes } from '@angular/router';

import { reportingObligationMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  canActivateReportingObligationDetailsForm,
  canActivateReportingObligationSummary,
} from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.guard';
import { ReportingObligationWizardStep } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { backlinkResolver } from '@requests/common/task-navigation';

export const AER_REPORTING_OBLIGATION_ROUTES: Routes = [
  {
    path: '',
    title: reportingObligationMap.title,
    canActivate: [canActivateReportingObligationSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/reporting-obligation/reporting-obligation-summary').then(
        (c) => c.ReportingObligationSummaryComponent,
      ),
  },
  {
    path: ReportingObligationWizardStep.FORM,
    title: reportingObligationMap.heading.title,
    canActivate: [canActivateReportingObligationDetailsForm],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ReportingObligationWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/reporting-obligation/reporting-obligation-form').then(
        (c) => c.ReportingObligationFormComponent,
      ),
  },
];
