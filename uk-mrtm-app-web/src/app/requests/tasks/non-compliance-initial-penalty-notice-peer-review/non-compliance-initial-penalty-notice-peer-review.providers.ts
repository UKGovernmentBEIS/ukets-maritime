import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
  PEER_REVIEW_DECISION_TEXT_MAP,
  PeerReviewDecisionFlowManager,
  PeerReviewDecisionTextMap,
} from '@requests/common/subtasks/peer-review-decision';
import { PEER_REVIEW_DECISION_SUB_TASK } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { nonComplianceInitialPenaltyNoticePeerReviewQuery } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/+state';
import { NonComplianceInitialPenaltyNoticePeerReviewDecisionPayloadMutator } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/payload-mutators';
import {
  NonComplianceInitialPenaltyNoticePeerReviewApiService,
  NonComplianceInitialPenaltyNoticePeerReviewService,
} from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/services';

export const provideNonComplianceInitialPenaltyNoticePeerReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: PAYLOAD_MUTATORS,
      multi: true,
      useClass: NonComplianceInitialPenaltyNoticePeerReviewDecisionPayloadMutator,
    },
  ]);

export const provideNonComplianceInitialPenaltyNoticePeerReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceInitialPenaltyNoticePeerReviewApiService },
    { provide: TaskService, useClass: NonComplianceInitialPenaltyNoticePeerReviewService },
  ]);

export function provideNonComplianceInitialPenaltyNoticePeerReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: PeerReviewDecisionFlowManager },
  ]);
}

const nonComplianceInitialPenaltyNoticePeerReviewMap: PeerReviewDecisionTextMap = {
  caption: 'Review initial penalty notice',
  decision: 'Peer review decision',
  notes: 'Supporting notes',
  success: 'Initial penalty notice decision returned to regulator',
};

export const peerReviewDecisionProviders: Provider[] = [
  {
    provide: PEER_REVIEW_DECISION_SELECTOR,
    useValue: nonComplianceInitialPenaltyNoticePeerReviewQuery.selectPeerReviewDecision,
  },
  {
    provide: PEER_REVIEW_DECISION_STATUS_SELECTOR,
    useValue: nonComplianceCommonQuery.selectStatusForSubtask(PEER_REVIEW_DECISION_SUB_TASK),
  },
  {
    provide: PEER_REVIEW_DECISION_TEXT_MAP,
    useValue: nonComplianceInitialPenaltyNoticePeerReviewMap,
  },
];
