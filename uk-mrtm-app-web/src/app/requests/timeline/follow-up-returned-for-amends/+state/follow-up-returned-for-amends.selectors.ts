import {
  EmpNotificationFollowupRequiredChangesDecisionDetails,
  EmpNotificationFollowUpReturnedForAmendsRequestActionPayload,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { FollowUpReviewDecisionDTO } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpNotificationFollowUpReturnedForAmendsRequestActionPayload> =
  timelineCommonQuery.selectPayload<EmpNotificationFollowUpReturnedForAmendsRequestActionPayload>();

const selectDecision: StateSelector<RequestActionState, EmpNotificationFollowupRequiredChangesDecisionDetails> =
  createDescendingSelector(selectPayload, (payload) => payload.decisionDetails);

const selectAttachments: StateSelector<RequestActionState, { [key: string]: string }> = createDescendingSelector(
  selectPayload,
  (payload) => payload.amendAttachments,
);

const selectFollowUpReturnedAmends: StateSelector<
  RequestActionState,
  Omit<FollowUpReviewDecisionDTO, 'type'>
> = createAggregateSelector(
  timelineCommonQuery.selectDownloadUrl,
  selectAttachments,
  selectDecision,
  (downloadUrl, attachments, decision) => ({
    requiredChanges: decision?.requiredChanges?.map((change) => ({
      reason: change?.reason,
      files: timelineUtils.getAttachedFiles(change?.files, attachments, downloadUrl),
    })),
    dueDate: decision?.dueDate,
    notes: decision?.notes,
  }),
);

export const followUpReturnedForAmendsQuery = {
  selectPayload,
  selectFollowUpReturnedAmends,
};
