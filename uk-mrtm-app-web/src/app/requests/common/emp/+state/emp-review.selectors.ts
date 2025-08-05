import { isNil } from 'lodash-es';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { EmpReviewTaskPayload } from '@requests/common/emp/emp.types';
import { ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';
import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations/abbreviations.helper';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities/control-activities.helpers';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps/data-gaps.helper';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources/emission-sources.helper';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas.helper';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures/management-procedures.helper';
import { OVERALL_DECISION_SUB_TASK } from '@requests/common/emp/subtasks/overall-decision/overall-decision.helpers';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils/subtask-review-group.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents/additional-documents.helper';
import { EmpReviewDecisionDto, EmpReviewDecisionUnion, EmpVariationReviewDecisionDto } from '@shared/types';

const allTasks = [
  ABBREVIATIONS_SUB_TASK,
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  CONTROL_ACTIVITIES_SUB_TASK,
  DATA_GAPS_SUB_TASK,
  EMISSION_SOURCES_SUB_TASK,
  EMISSIONS_SUB_TASK,
  GREENHOUSE_GAS_SUB_TASK,
  MANAGEMENT_PROCEDURES_SUB_TASK,
  OPERATOR_DETAILS_SUB_TASK,
];

const selectReviewGroupDecisions: StateSelector<RequestTaskState, { [key: string]: EmpReviewDecisionUnion }> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpReviewTaskPayload>(),
    (payload) => payload?.reviewGroupDecisions as { [key: string]: EmpReviewDecisionUnion },
  );

const selectReviewDecisionStatus = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    selectReviewGroupDecisions,
    (decisions) => (decisions?.[subtaskReviewGroupMap[subtask]]?.type ?? TaskItemStatus.UNDECIDED) as TaskItemStatus,
  );

const selectSubtaskHasDecision = (subtask: keyof EmissionsMonitoringPlan): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(selectReviewGroupDecisions, (reviewGroupDecisions) => {
    const group = subtaskReviewGroupMap[subtask];
    const reviewGroupDecision = reviewGroupDecisions?.[group];
    return !isNil(reviewGroupDecision?.type);
  });
};

const selectDetermination: StateSelector<RequestTaskState, EmpReviewTaskPayload['determination']> =
  createDescendingSelector(empCommonQuery.selectPayload<EmpReviewTaskPayload>(), (payload) => payload?.determination);

const selectIsSubtaskCompleted = (subtask: keyof EmissionsMonitoringPlan): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(selectStatusForSubtask(subtask), (status) =>
    [TaskItemStatus.OPERATOR_AMENDS_NEEDED, TaskItemStatus.ACCEPTED].includes(status),
  );
};

const selectStatusForOverallDecision: StateSelector<RequestTaskState, TaskItemStatus> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectDetermination,
  (completed, determination) => {
    const status = completed?.[OVERALL_DECISION_SUB_TASK] ?? (determination?.type as TaskItemStatus);

    return status === TaskItemStatus.APPROVED
      ? TaskItemStatus.APPROVED
      : status === TaskItemStatus.DEEMED_WITHDRAWN
        ? TaskItemStatus.DEEMED_WITHDRAWN
        : TaskItemStatus.UNDECIDED;
  },
);

const selectIsOverallDecisionCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForOverallDecision,
  (decisionStatus) => [TaskItemStatus.APPROVED, TaskItemStatus.DEEMED_WITHDRAWN].includes(decisionStatus),
);

const selectReviewAttachments: StateSelector<RequestTaskState, EmpReviewTaskPayload['reviewAttachments']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpReviewTaskPayload>(),
    (payload) => payload?.reviewAttachments,
  );

const selectIsEmpReviewSectionCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  (completed) => {
    return allTasks.every((task) =>
      [TaskItemStatus.OPERATOR_AMENDS_NEEDED, TaskItemStatus.ACCEPTED].includes(completed?.[task] as TaskItemStatus),
    );
  },
);

const selectAreAllSectionsAccepted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectReviewGroupDecisions,
  (completed, reviewGroups) =>
    allTasks.every((task) => {
      const status = completed?.[task] ?? reviewGroups?.[subtaskReviewGroupMap[task]]?.type;
      return (status as TaskItemStatus) === TaskItemStatus.ACCEPTED;
    }),
);

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createAggregateSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    selectReviewDecisionStatus(subtask),
    (completed, reviewDecision) => {
      const status = (completed?.[subtask] ?? reviewDecision) as TaskItemStatus;

      if ([TaskItemStatus.ACCEPTED, TaskItemStatus.OPERATOR_AMENDS_NEEDED].includes(status)) {
        return status;
      }

      return TaskItemStatus.UNDECIDED;
    },
  );
};

const selectEmpReviewDecisionDTO = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, EmpReviewDecisionDto> => {
  return createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectReviewAttachments,
    selectReviewGroupDecisions,
    (downloadUrl, followUpAttachments, reviewGroupDecisions) => {
      const group = subtaskReviewGroupMap[subtask];
      const reviewGroupDecision = reviewGroupDecisions?.[group];
      return {
        type: reviewGroupDecision?.type,
        details: {
          requiredChanges: reviewGroupDecision?.details?.requiredChanges?.map((change) => ({
            reason: change?.reason,
            files:
              change?.files?.map((id) => ({
                downloadUrl: downloadUrl + `${id}`,
                fileName: followUpAttachments[id],
              })) ?? [],
          })),
          notes: reviewGroupDecision?.details?.notes,
        },
      };
    },
  );
};

const selectEmpReviewDecisionForAmendsDTO: StateSelector<
  RequestTaskState,
  Array<ReviewAmendDecisionDTO>
> = createAggregateSelector(
  createAggregateSelector(
    selectReviewAttachments,
    empCommonQuery.selectTasksDownloadUrl,
    (attachments, downloadUrl) => ({
      attachments,
      downloadUrl,
    }),
  ),
  selectReviewGroupDecisions,
  ({ attachments, downloadUrl }, decisions) => {
    const sections: Array<keyof EmissionsMonitoringPlan> = [
      'operatorDetails',
      'emissions',
      'sources',
      'greenhouseGas',
      'dataGaps',
      'managementProcedures',
      'controlActivities',
      'abbreviations',
      'additionalDocuments',
    ];

    const result: Array<{
      subtask: keyof EmissionsMonitoringPlan;
      decision: EmpReviewDecisionDto | EmpVariationReviewDecisionDto;
    }> = [];
    for (const section of sections) {
      const group = subtaskReviewGroupMap[section];
      const reviewGroupDecision = decisions?.[group];

      if (reviewGroupDecision?.type !== 'OPERATOR_AMENDS_NEEDED') {
        continue;
      }

      result.push({
        subtask: section as keyof EmissionsMonitoringPlan,
        decision: {
          type: reviewGroupDecision?.type,
          details: {
            requiredChanges: reviewGroupDecision?.details?.requiredChanges?.map((change) => ({
              reason: change?.reason,
              files:
                change?.files?.map((id) => ({
                  downloadUrl: downloadUrl + `${id}`,
                  fileName: attachments[id],
                })) ?? [],
            })),
            notes: reviewGroupDecision?.details?.notes,
          },
        },
      });
    }

    return result;
  },
);

const selectSubtaskToCompletedMap: StateSelector<RequestTaskState, { [subtask: string]: boolean }> =
  createAggregateSelector(
    allTasks.map((subtask) => selectIsSubtaskCompleted(subtask as keyof EmissionsMonitoringPlan)),
    (...completedResults) => {
      const subtaskToCompletedMap = {};
      allTasks.forEach((subtask, index) => (subtaskToCompletedMap[subtask] = completedResults[index]));
      return subtaskToCompletedMap;
    },
  );

const selectAnySubtaskNeedsAmend: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  selectReviewGroupDecisions,
  selectSubtaskToCompletedMap,
  (decisions, subtaskToCompletedMap) => {
    for (const subtask of allTasks) {
      if (
        (subtaskToCompletedMap?.[subtask] && decisions?.[subtaskReviewGroupMap[subtask]]?.type) ===
        TaskItemStatus.OPERATOR_AMENDS_NEEDED
      ) {
        return true;
      }
    }

    return false;
  },
);

export const empReviewQuery = {
  selectReviewGroupDecisions,
  selectSubtaskHasDecision,
  selectDetermination,
  selectIsSubtaskCompleted,
  selectIsOverallDecisionCompleted,
  selectIsEmpReviewSectionCompleted,
  selectAreAllSectionsAccepted,
  selectReviewAttachments,
  selectStatusForSubtask,
  selectStatusForOverallDecision,
  selectEmpReviewDecisionDTO,
  selectEmpReviewDecisionForAmendsDTO,
  selectReviewDecisionStatus,
  selectAnySubtaskNeedsAmend,
};
