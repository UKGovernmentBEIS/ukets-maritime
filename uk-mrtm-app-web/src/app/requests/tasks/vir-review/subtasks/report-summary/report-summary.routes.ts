import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { ReportSummaryComponent } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary';
import { canActivateVirReviewReportSummary } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.guard';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';
import { ReportSummaryFormComponent } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary-form';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';

export const REVIEW_REPORT_SUMMARY_ROUTES: Routes = [
  {
    path: '',
    title: 'Check your answers',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateVirReviewReportSummary],
    component: ReportSummaryComponent,
  },
  {
    path: VirReviewReportSummaryWizardStep.REPORT,
    title: 'Create report summary',
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(VirRespondToRecommendationWizardStep.SUMMARY, '../../'),
    },
    component: ReportSummaryFormComponent,
  },
];
