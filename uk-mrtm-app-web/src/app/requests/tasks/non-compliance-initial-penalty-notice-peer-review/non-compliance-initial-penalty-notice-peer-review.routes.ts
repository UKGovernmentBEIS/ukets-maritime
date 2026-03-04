import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX } from '@requests/common/non-compliance';
import { canActivatePeerReviewDecision } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/non-compliance-initial-penalty-notice-peer-review.guard';
import {
  peerReviewDecisionProviders,
  provideNonComplianceInitialPenaltyNoticePeerReviewPayloadMutators,
  provideNonComplianceInitialPenaltyNoticePeerReviewStepFlowManagers,
  provideNonComplianceInitialPenaltyNoticePeerReviewTaskServices,
} from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/non-compliance-initial-penalty-notice-peer-review.providers';

export const NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideNonComplianceInitialPenaltyNoticePeerReviewPayloadMutators(),
      provideNonComplianceInitialPenaltyNoticePeerReviewTaskServices(),
      provideNonComplianceInitialPenaltyNoticePeerReviewStepFlowManagers(),
    ],
    children: [
      {
        path: NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/non-compliance-initial-penalty-notice-peer-review/subtasks/upload/non-compliance-initial-penalty-notice-upload-summary-review').then(
            (c) => c.NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent,
          ),
      },
      {
        path: 'review-decision',
        providers: [peerReviewDecisionProviders],
        canActivate: [canActivatePeerReviewDecision],
        loadChildren: () =>
          import('@requests/common/subtasks/peer-review-decision').then((r) => r.PEER_REVIEW_DECISION_ROUTES),
      },
    ],
  },
];
