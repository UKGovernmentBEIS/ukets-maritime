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
import { nonComplianceCivilPenaltyPeerReviewQuery } from '@requests/tasks/non-compliance-civil-penalty-peer-review/+state';
import { NonComplianceCivilPenaltyPeerReviewDecisionPayloadMutator } from '@requests/tasks/non-compliance-civil-penalty-peer-review/payload-mutators';
import {
  NonComplianceCivilPenaltyPeerReviewApiService,
  NonComplianceCivilPenaltyPeerReviewService,
} from '@requests/tasks/non-compliance-civil-penalty-peer-review/services';

export const provideNonComplianceCivilPenaltyPeerReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: PAYLOAD_MUTATORS,
      multi: true,
      useClass: NonComplianceCivilPenaltyPeerReviewDecisionPayloadMutator,
    },
  ]);

export const provideNonComplianceCivilPenaltyPeerReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceCivilPenaltyPeerReviewApiService },
    { provide: TaskService, useClass: NonComplianceCivilPenaltyPeerReviewService },
  ]);

export function provideNonComplianceCivilPenaltyPeerReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: PeerReviewDecisionFlowManager },
  ]);
}

const nonComplianceCivilPenaltyPeerReviewMap: PeerReviewDecisionTextMap = {
  caption: 'Review civil penalty notice',
  decision: 'Peer review decision',
  notes: 'Supporting notes',
  success: 'Civil penalty notice decision returned to regulator',
};

export const peerReviewDecisionProviders: Provider[] = [
  {
    provide: PEER_REVIEW_DECISION_SELECTOR,
    useValue: nonComplianceCivilPenaltyPeerReviewQuery.selectPeerReviewDecision,
  },
  {
    provide: PEER_REVIEW_DECISION_STATUS_SELECTOR,
    useValue: nonComplianceCommonQuery.selectStatusForSubtask(PEER_REVIEW_DECISION_SUB_TASK),
  },
  {
    provide: PEER_REVIEW_DECISION_TEXT_MAP,
    useValue: nonComplianceCivilPenaltyPeerReviewMap,
  },
];
