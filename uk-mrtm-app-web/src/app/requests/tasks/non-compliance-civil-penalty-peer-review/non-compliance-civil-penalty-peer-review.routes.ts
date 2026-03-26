import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX,
  nonComplianceCivilPenaltyMap,
} from '@requests/common/non-compliance';
import { canActivatePeerReviewDecision } from '@requests/tasks/non-compliance-civil-penalty-peer-review/non-compliance-civil-penalty-peer-review.guard';
import {
  peerReviewDecisionProviders,
  provideNonComplianceCivilPenaltyPeerReviewPayloadMutators,
  provideNonComplianceCivilPenaltyPeerReviewStepFlowManagers,
  provideNonComplianceCivilPenaltyPeerReviewTaskServices,
} from '@requests/tasks/non-compliance-civil-penalty-peer-review/non-compliance-civil-penalty-peer-review.providers';

export const NON_COMPLIANCE_CIVIL_PENALTY_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideNonComplianceCivilPenaltyPeerReviewPayloadMutators(),
      provideNonComplianceCivilPenaltyPeerReviewTaskServices(),
      provideNonComplianceCivilPenaltyPeerReviewStepFlowManagers(),
    ],
    children: [
      {
        path: NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX,
        title: nonComplianceCivilPenaltyMap.caption,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/non-compliance-civil-penalty-peer-review/subtasks/upload/non-compliance-civil-penalty-upload-summary-review').then(
            (c) => c.NonComplianceCivilPenaltyUploadSummaryReviewComponent,
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
