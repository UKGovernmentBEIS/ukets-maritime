import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
  PEER_REVIEW_DECISION_TEXT_MAP,
  PeerReviewDecisionFlowManager,
  PeerReviewDecisionTextMap,
} from '@requests/common/subtasks/peer-review-decision';
import { PEER_REVIEW_DECISION_SUB_TASK } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { nonComplianceNoticeOfIntentPeerReviewQuery } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/+state';
import { NonComplianceNoticeOfIntentPeerReviewDecisionPayloadMutator } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/payload-mutators';
import {
  NonComplianceNoticeOfIntentPeerReviewApiService,
  NonComplianceNoticeOfIntentPeerReviewService,
} from '@requests/tasks/non-compliance-notice-of-intent-peer-review/services';

export const provideNonComplianceNoticeOfIntentPeerReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: PAYLOAD_MUTATORS,
      multi: true,
      useClass: NonComplianceNoticeOfIntentPeerReviewDecisionPayloadMutator,
    },
  ]);

export const provideNonComplianceNoticeOfIntentPeerReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceNoticeOfIntentPeerReviewApiService },
    { provide: TaskService, useClass: NonComplianceNoticeOfIntentPeerReviewService },
  ]);

export function provideNonComplianceNoticeOfIntentPeerReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: PeerReviewDecisionFlowManager },
  ]);
}

const nonComplianceNoticeOfIntentPeerReviewMap: PeerReviewDecisionTextMap = {
  caption: 'Review notice of intent',
  decision: 'Peer review decision',
  notes: 'Supporting notes',
  success: 'Notice of intent decision returned to regulator',
};

export const peerReviewDecisionProviders: Provider[] = [
  {
    provide: PEER_REVIEW_DECISION_SELECTOR,
    useValue: nonComplianceNoticeOfIntentPeerReviewQuery.selectPeerReviewDecision,
  },
  {
    provide: PEER_REVIEW_DECISION_STATUS_SELECTOR,
    useValue: nonComplianceNoticeOfIntentCommonQuery.selectStatusForSubtask(PEER_REVIEW_DECISION_SUB_TASK),
  },
  {
    provide: PEER_REVIEW_DECISION_TEXT_MAP,
    useValue: nonComplianceNoticeOfIntentPeerReviewMap,
  },
];
