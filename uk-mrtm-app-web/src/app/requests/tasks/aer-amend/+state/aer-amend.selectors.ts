import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { AER_PORTS_SUB_TASK, AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_SUBTASK_REVIEW_GROUP_MAP } from '@requests/common/aer/common';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { AerAmendTaskPayload } from '@requests/tasks/aer-amend/aer-amend.types';
import { EmpReviewDecisionDto, EmpReviewDecisionUnion, EmpVariationReviewDecisionDto } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, AerAmendTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as AerAmendTaskPayload,
);

const selectReviewAttachments: StateSelector<RequestTaskState, AerAmendTaskPayload['reviewAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<RequestTaskState, { [key: string]: EmpReviewDecisionUnion }> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.reviewGroupDecisions as { [key: string]: EmpReviewDecisionUnion },
  );

const selectStatusForSubtask = (
  subtask: string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    selectPayload,
    (payload) => (payload?.aerSectionsCompleted[subtask] ?? defaultStatus) as TaskItemStatus,
  );

const selectReviewDecisionsForAmends: StateSelector<
  RequestTaskState,
  Array<ReviewAmendDecisionDTO>
> = createAggregateSelector(
  selectReviewAttachments,
  requestTaskQuery.selectTasksDownloadUrl,
  selectReviewGroupDecisions,
  (attachments, downloadUrl, reviewGroupDecisions) => {
    const result: Array<{
      subtask: string;
      decision: EmpReviewDecisionDto | EmpVariationReviewDecisionDto;
    }> = [];
    const sections = [
      REPORTING_OBLIGATION_SUB_TASK,
      OPERATOR_DETAILS_SUB_TASK,
      MONITORING_PLAN_CHANGES_SUB_TASK,
      EMISSIONS_SUB_TASK,
      AER_VOYAGES_SUB_TASK,
      AER_PORTS_SUB_TASK,
      AER_AGGREGATED_DATA_SUB_TASK,
      AER_REDUCTION_CLAIM_SUB_TASK,
      ADDITIONAL_DOCUMENTS_SUB_TASK,
      AER_TOTAL_EMISSIONS_SUB_TASK,
    ];

    for (const section of sections) {
      const group = AER_SUBTASK_REVIEW_GROUP_MAP[section];
      const reviewGroupDecision = reviewGroupDecisions?.[group];
      if (reviewGroupDecision?.type !== 'OPERATOR_AMENDS_NEEDED') {
        continue;
      }

      result.push({
        subtask: section,
        decision: {
          type: reviewGroupDecision.type,
          details: {
            notes: reviewGroupDecision.details.notes,
            requiredChanges: reviewGroupDecision.details.requiredChanges.map((requiredChange) => ({
              reason: requiredChange.reason,
              files: requiredChange?.files?.map((file) => ({
                downloadUrl: `${downloadUrl}${file}`,
                fileName: attachments[file],
              })),
            })),
          },
        },
      });
    }

    return result;
  },
);

const selectSubtasksNeedAmends: StateSelector<RequestTaskState, Array<string>> = createDescendingSelector(
  selectReviewDecisionsForAmends,
  (reviewDecisions) => {
    return reviewDecisions.map((reviewDecision) => reviewDecision.subtask);
  },
);

const selectShouldSubmitToRegulator: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  aerCommonQuery.selectReportingRequired,
  selectPayload,
  (reportingRequired, payload) => reportingRequired === false || payload?.verificationPerformed === true,
);

export const aerAmendQuery = {
  selectPayload,
  selectReviewDecisionsForAmends,
  selectStatusForSubtask,
  selectSubtasksNeedAmends,
  selectShouldSubmitToRegulator,
};
