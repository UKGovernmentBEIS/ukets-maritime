import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX } from '@requests/common/non-compliance';
import { canActivatePeerReviewDecision } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/non-compliance-notice-of-intent-peer-review.guard';
import {
  peerReviewDecisionProviders,
  provideNonComplianceNoticeOfIntentPeerReviewPayloadMutators,
  provideNonComplianceNoticeOfIntentPeerReviewStepFlowManagers,
  provideNonComplianceNoticeOfIntentPeerReviewTaskServices,
} from '@requests/tasks/non-compliance-notice-of-intent-peer-review/non-compliance-notice-of-intent-peer-review.providers';

export const NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideNonComplianceNoticeOfIntentPeerReviewPayloadMutators(),
      provideNonComplianceNoticeOfIntentPeerReviewTaskServices(),
      provideNonComplianceNoticeOfIntentPeerReviewStepFlowManagers(),
    ],
    children: [
      {
        path: NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import(
            '@requests/tasks/non-compliance-notice-of-intent-peer-review/subtasks/upload/non-compliance-notice-of-intent-upload-summary-review'
          ).then((c) => c.NonComplianceNoticeOfIntentUploadSummaryReviewComponent),
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
