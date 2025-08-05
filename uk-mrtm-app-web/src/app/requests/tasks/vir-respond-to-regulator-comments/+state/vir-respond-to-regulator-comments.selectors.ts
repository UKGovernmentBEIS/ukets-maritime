import { OperatorImprovementFollowUpResponse, RegulatorImprovementResponse } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK, RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { VirRespondToRegulatorCommentsTaskPayload } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.types';

const selectPayload: StateSelector<RequestTaskState, VirRespondToRegulatorCommentsTaskPayload> =
  createDescendingSelector(requestTaskQuery.selectRequestTaskPayload, (payload) => payload);

const selectVirRespondToRegulatorCommentsSectionsCompleted: StateSelector<RequestTaskState, { [key: string]: string }> =
  createDescendingSelector(selectPayload, (payload) => payload?.virRespondToRegulatorCommentsSectionsCompleted);

const selectAllSubtasksCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  virCommonQuery.selectVirVerifierRecommendationData,
  virCommonQuery.selectSectionsCompleted,
  (payload, completed) => {
    for (const key of Object.keys(payload)) {
      if (completed?.[`${RESPOND_TO_RECOMMENDATION_SUBTASK}-${key.toUpperCase()}`] !== TaskItemStatus.COMPLETED) {
        return false;
      }
    }

    return true;
  },
);

const selectStatusForOperatorImprovementResponseData = (
  key: string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createAggregateSelector(
    virCommonQuery.selectSectionsCompleted,
    selectVirRespondToRegulatorCommentsSectionsCompleted,
    (sectionsCompleted, respondToRegulatorCommentsSectionsCompleted) =>
      (sectionsCompleted?.[`${RESPOND_TO_REGULATOR_SUBTASK}-${key.toUpperCase()}`] ??
        respondToRegulatorCommentsSectionsCompleted?.[`${RESPOND_TO_REGULATOR_SUBTASK}-${key.toUpperCase()}`] ??
        defaultStatus) as TaskItemStatus,
  );

const selectRegulatorImprovementResponseData = (
  key: string,
): StateSelector<RequestTaskState, RegulatorImprovementResponse> =>
  createDescendingSelector(selectPayload, (payload) => payload?.regulatorImprovementResponses?.[key.toUpperCase()]);

const selectRegulatorResponseData = (key: string): StateSelector<RequestTaskState, RegulatorImprovementResponse> =>
  createDescendingSelector(selectPayload, (payload) => payload?.regulatorImprovementResponses?.[key.toUpperCase()]);

const selectOperatorImprovementResponseData = (
  key: string,
): StateSelector<RequestTaskState, OperatorImprovementFollowUpResponse> =>
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.operatorImprovementFollowUpResponses?.[key.toUpperCase()],
  );

export const virRespondToRegulatorCommentsQuery = {
  selectPayload,
  selectVirRespondToRegulatorCommentsSectionsCompleted,
  selectAllSubtasksCompleted,
  selectStatusForOperatorImprovementResponseData,
  selectRegulatorImprovementResponseData,
  selectRegulatorResponseData,
  selectOperatorImprovementResponseData,
};
