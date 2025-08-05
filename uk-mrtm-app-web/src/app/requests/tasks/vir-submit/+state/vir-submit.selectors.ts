import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';

const selectPayload: StateSelector<RequestTaskState, VirSubmitTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

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

const selectStatusForVerifierRecommendationData = (
  key: string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    virCommonQuery.selectSectionsCompleted,
    (payload) =>
      (payload?.[`${RESPOND_TO_RECOMMENDATION_SUBTASK}-${key.toUpperCase()}`] ?? defaultStatus) as TaskItemStatus,
  );

export const virSubmitQuery = {
  selectPayload,
  selectAllSubtasksCompleted,
  selectStatusForVerifierRecommendationData,
};
