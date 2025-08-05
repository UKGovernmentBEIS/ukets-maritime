import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { doeCommonQuery } from '@requests/common/doe';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
  PeerReviewDecisionFlowManager,
} from '@requests/common/subtasks/peer-review-decision';
import { PEER_REVIEW_DECISION_SUB_TASK } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { doePeerReviewQuery } from '@requests/tasks/doe-peer-review/+state';
import { DoePeerReviewDecisionPayloadMutator } from '@requests/tasks/doe-peer-review/payload-mutators';
import { DoePeerReviewApiService, DoePeerReviewService } from '@requests/tasks/doe-peer-review/services';

export const provideDoePeerReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: DoePeerReviewDecisionPayloadMutator }]);

export const provideDoePeerReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: DoePeerReviewApiService },
    { provide: TaskService, useClass: DoePeerReviewService },
  ]);

export function provideDoePeerReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: PeerReviewDecisionFlowManager },
  ]);
}

export const peerReviewDecisionProviders: Provider[] = [
  { provide: PEER_REVIEW_DECISION_SELECTOR, useValue: doePeerReviewQuery.selectPeerReviewDecision },
  {
    provide: PEER_REVIEW_DECISION_STATUS_SELECTOR,
    useValue: doeCommonQuery.selectStatusForSubtask(PEER_REVIEW_DECISION_SUB_TASK),
  },
];
