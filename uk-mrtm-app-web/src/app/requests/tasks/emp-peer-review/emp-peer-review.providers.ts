import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { empPeerReviewQuery } from '@requests/common';
import { PeerReviewDecisionPayloadMutator } from '@requests/common/emp/payload-mutators';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
  PeerReviewDecisionFlowManager,
} from '@requests/common/subtasks/peer-review-decision';
import { PEER_REVIEW_DECISION_SUB_TASK } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { EmpPeerReviewApiService, EmpPeerReviewService } from '@requests/tasks/emp-peer-review/services';

export function provideEmpPeerReviewPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: PeerReviewDecisionPayloadMutator },
  ]);
}

export function provideEmpPeerReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpPeerReviewService },
    { provide: TaskApiService, useClass: EmpPeerReviewApiService },
  ]);
}

export function provideEmpPeerReviewSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}

export function provideEmpPeerReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: PeerReviewDecisionFlowManager },
  ]);
}

export const peerReviewDecisionProviders: Provider[] = [
  { provide: PEER_REVIEW_DECISION_SELECTOR, useValue: empPeerReviewQuery.selectDecision },
  {
    provide: PEER_REVIEW_DECISION_STATUS_SELECTOR,
    useValue: empPeerReviewQuery.selectPeerReviewStatus(PEER_REVIEW_DECISION_SUB_TASK),
  },
];
