import { RegulatorImprovementResponse } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_OPERATOR_SUBTASK } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir/subtasks/report-summary';
import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';

const selectPayload: StateSelector<RequestTaskState, VirReviewTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectRegulatorResponseData = (key: string): StateSelector<RequestTaskState, RegulatorImprovementResponse> =>
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.regulatorReviewResponse?.regulatorImprovementResponses?.[key.toUpperCase()],
  );

const selectStatusForVerifierRecommendationData = (
  key: string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    virCommonQuery.selectSectionsCompleted,
    (payload) => (payload?.[`${RESPOND_TO_OPERATOR_SUBTASK}-${key.toUpperCase()}`] ?? defaultStatus) as TaskItemStatus,
  );

const selectStatusForReportSummary = createDescendingSelector(
  virCommonQuery.selectSectionsCompleted,
  (payload) => payload?.[REVIEW_REPORT_SUMMARY_SUBTASK] ?? TaskItemStatus.NOT_STARTED,
);

const selectAllSubtasksCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  virCommonQuery.selectVirVerifierRecommendationData,
  virCommonQuery.selectSectionsCompleted,
  selectStatusForReportSummary,
  (payload, completed, summaryCompleted) => {
    for (const key of Object.keys(payload)) {
      if (completed?.[`${RESPOND_TO_OPERATOR_SUBTASK}-${key.toUpperCase()}`] !== TaskItemStatus.COMPLETED) {
        return false;
      }
    }

    return summaryCompleted === TaskItemStatus.COMPLETED;
  },
);

export const virReviewQuery = {
  selectPayload,
  selectRegulatorResponseData,
  selectStatusForVerifierRecommendationData,
  selectStatusForReportSummary,
  selectAllSubtasksCompleted,
};
