import { InjectionToken } from '@angular/core';

import { PeerReviewDecision } from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';

export const PEER_REVIEW_DECISION_SELECTOR: InjectionToken<StateSelector<RequestTaskState, PeerReviewDecision>> =
  new InjectionToken<StateSelector<RequestTaskState, PeerReviewDecision>>('Peer review decision selector');

export const PEER_REVIEW_DECISION_STATUS_SELECTOR: InjectionToken<StateSelector<RequestTaskState, TaskItemStatus>> =
  new InjectionToken<StateSelector<RequestTaskState, TaskItemStatus>>('Peer review decision status selector');

export const PEER_REVIEW_DECISION_TEXT_MAP: InjectionToken<PeerReviewDecisionTextMap> =
  new InjectionToken<PeerReviewDecisionTextMap>('Peer review decision text map', {
    factory: () => ({
      caption: 'Peer review response',
      decision: 'Peer review decision',
      notes: 'Supporting notes',
      success: 'Returned to regulator',
    }),
  });

export interface PeerReviewDecisionTextMap {
  caption: string;
  decision: string;
  notes: string;
  success: string;
}
