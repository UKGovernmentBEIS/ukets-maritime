import {
  AdditionalDocuments,
  EmissionsMonitoringPlan,
  EmissionsMonitoringPlanContainer,
  EmpAbbreviations,
  EmpControlActivities,
  EmpDataGaps,
  EmpEmissions,
  EmpEmissionSources,
  EmpManagementProcedures,
  EmpMandate,
  EmpMonitoringGreenhouseGas,
  EmpOperatorDetails,
} from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { empReviewQuery } from '@requests/common/emp/+state/emp-review.selectors';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EMP_SUBTASKS } from '@requests/common/emp/emp-subtasks.constant';
import { ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';
import { OVERALL_DECISION_SUB_TASK } from '@requests/common/emp/subtasks/overall-decision';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  AttachedFile,
  EmpVariationReviewDecisionDto,
  EmpVariationReviewDecisionUnion,
  ReviewDecisionUnion,
  ShipEmissionTableListItem,
} from '@shared/types';
import { isNil } from '@shared/utils';

const allowedStatuses: TaskItemStatus[] = [
  TaskItemStatus.APPROVED,
  TaskItemStatus.ACCEPTED,
  TaskItemStatus.REJECTED,
  TaskItemStatus.OPERATOR_AMENDS_NEEDED,
  TaskItemStatus.DEEMED_WITHDRAWN,
];

const selectReviewGroupDecisions: StateSelector<RequestTaskState, { [key: string]: EmpVariationReviewDecisionUnion }> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
    (payload) => payload?.reviewGroupDecisions as { [key: string]: EmpVariationReviewDecisionUnion },
  );

const selectSubtaskHasDecision = (subtask: keyof EmissionsMonitoringPlan): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(selectReviewGroupDecisions, (reviewGroupDecisions) => {
    const reviewDecisionStatus = reviewGroupDecisions?.[subtaskReviewGroupMap[subtask]]?.type;
    return !isNil(reviewDecisionStatus);
  });
};

const selectIsSubtaskCompleted = (subtask: keyof EmissionsMonitoringPlan): StateSelector<RequestTaskState, boolean> =>
  createDescendingSelector(selectStatusForSubtask(subtask), (subtaskStatus) => {
    return allowedStatuses.includes(subtaskStatus);
  });

const selectEmpVariationDetailsReviewDecision: StateSelector<
  RequestTaskState,
  EmpVariationReviewTaskPayload['empVariationDetailsReviewDecision']
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
  (payload) => payload?.empVariationDetailsReviewDecision,
);

const selectStatusForEmpVariationReviewDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> =
  createAggregateSelector(
    empCommonQuery.selectIsEmpSectionCompleted,
    empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
    (completed, taskPayload) => {
      const { empVariationDetailsReviewCompleted, empVariationDetailsReviewDecision } = taskPayload ?? {};
      const status = (completed[VARIATION_DETAILS_SUB_TASK] ??
        empVariationDetailsReviewCompleted ??
        empVariationDetailsReviewDecision?.type) as TaskItemStatus;

      if (allowedStatuses.includes(status)) {
        return status;
      }

      return TaskItemStatus.UNDECIDED;
    },
  );

const selectIsVariationReviewDetailsSubtaskCompleted: StateSelector<RequestTaskState, boolean> =
  createDescendingSelector(selectStatusForEmpVariationReviewDetailsSubtask, (completed) =>
    allowedStatuses.includes(completed),
  );

const selectIsEmpSectionsReviewed = createDescendingSelector(selectReviewGroupDecisions, (decisions) => {
  return EMP_SUBTASKS.every((task) =>
    allowedStatuses.includes(decisions?.[subtaskReviewGroupMap[task]]?.type as TaskItemStatus),
  );
});

const selectAreAllSectionsWithStatus = (status: TaskItemStatus): StateSelector<RequestTaskState, boolean> =>
  createAggregateSelector(
    selectReviewGroupDecisions,
    selectStatusForEmpVariationReviewDetailsSubtask,
    (reviewDecisions, variationDetailsStatus) => {
      if (variationDetailsStatus !== status) {
        return false;
      }

      return EMP_SUBTASKS.every(
        (task) => (reviewDecisions?.[subtaskReviewGroupMap[task]]?.type as TaskItemStatus) === status,
      );
    },
  );

const selectAtLeastOneSectionWithStatus = (status: TaskItemStatus): StateSelector<RequestTaskState, boolean> =>
  createAggregateSelector(
    selectReviewGroupDecisions,
    selectStatusForEmpVariationReviewDetailsSubtask,
    (reviewDecisions, variationDetailsStatus) => {
      if (variationDetailsStatus === status) {
        return true;
      }

      return EMP_SUBTASKS.some(
        (task) => (reviewDecisions?.[subtaskReviewGroupMap[task]]?.type as TaskItemStatus) === status,
      );
    },
  );

const selectDetermination = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
  (payload) => payload?.determination,
);

const selectStatusForEmpReviewOverallDecision: StateSelector<RequestTaskState, TaskItemStatus> =
  createAggregateSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    selectDetermination,
    selectIsEmpSectionsReviewed,
    (completed, determination, allReviewed) => {
      const overallDecisionStatus = (completed?.[OVERALL_DECISION_SUB_TASK] ?? determination?.type) as TaskItemStatus;

      if (allowedStatuses.includes(overallDecisionStatus as TaskItemStatus)) {
        return overallDecisionStatus as TaskItemStatus;
      }

      if (allReviewed) {
        return TaskItemStatus.UNDECIDED;
      }

      return TaskItemStatus.CANNOT_START_YET;
    },
  );

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createAggregateSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    empReviewQuery.selectReviewDecisionStatus(subtask),
    (completed, reviewDecision) => {
      const status = (completed?.[subtask] ?? reviewDecision) as TaskItemStatus;

      if (allowedStatuses.includes(status) || status === TaskItemStatus.NEEDS_REVIEW) {
        return status;
      }

      return TaskItemStatus.UNDECIDED;
    },
  );
};

const selectIsOverallDecisionCompleted: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectStatusForEmpReviewOverallDecision,
  (completed) =>
    [TaskItemStatus.APPROVED, TaskItemStatus.DEEMED_WITHDRAWN, TaskItemStatus.REJECTED].includes(completed),
);

const selectReviewAttachments: StateSelector<RequestTaskState, EmpVariationReviewTaskPayload['reviewAttachments']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
    (payload) => payload?.reviewAttachments,
  );

const selectEmpVariationDetails: StateSelector<RequestTaskState, EmpVariationReviewTaskPayload['empVariationDetails']> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
    (payload) => payload?.empVariationDetails,
  );

const selectEmpReviewDecisionDTO = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, EmpVariationReviewDecisionDto> => {
  return createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectReviewAttachments,
    selectReviewGroupDecisions,
    (downloadUrl, reviewAttachments, reviewGroupDecisions) => {
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
                fileName: reviewAttachments[id],
              })) ?? [],
          })),
          variationScheduleItems: reviewGroupDecision?.details?.variationScheduleItems,
          notes: reviewGroupDecision?.details?.notes,
        },
      };
    },
  );
};

const selectEmpVariationDetailsReviewDecisionDTO: StateSelector<RequestTaskState, EmpVariationReviewDecisionDto> =
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectReviewAttachments,
    selectEmpVariationDetailsReviewDecision,
    (downloadUrl, reviewAttachments, reviewGroupDecisions) => {
      const reviewDecision = reviewGroupDecisions as EmpVariationReviewDecisionUnion;
      return {
        type: reviewDecision?.type,
        details: {
          requiredChanges: reviewDecision?.details?.requiredChanges?.map((change) => ({
            reason: change?.reason,
            files:
              change?.files?.map((id) => ({
                downloadUrl: downloadUrl + `${id}`,
                fileName: reviewAttachments[id],
              })) ?? [],
          })),
          variationScheduleItems: reviewDecision?.details?.variationScheduleItems,
          notes: reviewDecision?.details?.notes,
        },
      };
    },
  );

const selectOverallDecisionCanBeActivated: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  selectIsEmpSectionsReviewed,
  selectIsVariationReviewDetailsSubtaskCompleted,
  (sections, variations) => sections && variations,
);

const selectSubtaskToCompletedMap: StateSelector<RequestTaskState, { [subtask: string]: boolean }> =
  createAggregateSelector(
    EMP_SUBTASKS.map((subtask) => selectIsSubtaskCompleted(subtask as keyof EmissionsMonitoringPlan)),
    (...completedResults) => {
      const subtaskToCompletedMap = {};
      EMP_SUBTASKS.forEach((subtask, index) => (subtaskToCompletedMap[subtask] = completedResults[index]));
      return subtaskToCompletedMap;
    },
  );

const selectAnySubtaskNeedsAmend: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  selectReviewGroupDecisions,
  selectStatusForEmpVariationReviewDetailsSubtask,
  selectSubtaskToCompletedMap,
  (decisions, variationDetailsStatus, subtaskToCompletedMap) => {
    if (variationDetailsStatus === TaskItemStatus.OPERATOR_AMENDS_NEEDED) {
      return true;
    }

    for (const subtask of EMP_SUBTASKS) {
      if (
        subtaskToCompletedMap?.[subtask] &&
        decisions?.[subtaskReviewGroupMap[subtask]]?.type === TaskItemStatus.OPERATOR_AMENDS_NEEDED
      ) {
        return true;
      }
    }

    return false;
  },
);

const selectOriginalEmissionsMonitoringPlan: StateSelector<RequestTaskState, EmissionsMonitoringPlan> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
    (payload) => payload?.originalEmpContainer?.emissionsMonitoringPlan,
  );

const selectOriginalEmpAttachments: StateSelector<
  RequestTaskState,
  EmissionsMonitoringPlanContainer['empAttachments']
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>(),
  (payload) => payload?.originalEmpContainer?.empAttachments,
);

const selectOriginalAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectOriginalEmpAttachments,
    (downloadUrl, payload) => {
      return (
        files?.map((id) => ({
          downloadUrl: downloadUrl + `${id}`,
          fileName: payload?.[id],
        })) ?? []
      );
    },
  );

const selectOriginalOperatorDetails: StateSelector<RequestTaskState, EmpOperatorDetails> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.operatorDetails,
);

const selectOriginalEmissions: StateSelector<RequestTaskState, EmpEmissions> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.emissions,
);

const selectOriginalListOfShips: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =
  createDescendingSelector(selectOriginalEmissions, (emissions) =>
    emissions?.ships?.map((x) => ({
      uniqueIdentifier: x.uniqueIdentifier,
      ...x.details,
      status: TaskItemStatus.COMPLETED,
    })),
  );

const selectOriginalEmissionSources: StateSelector<RequestTaskState, EmpEmissionSources> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.sources,
);

const selectOriginalGreenhouseGas: StateSelector<RequestTaskState, EmpMonitoringGreenhouseGas> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.greenhouseGas);

const selectOriginalDataGaps: StateSelector<RequestTaskState, EmpDataGaps> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.dataGaps,
);

const selectOriginalMandate: StateSelector<RequestTaskState, EmpMandate> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.mandate,
);

const selectOriginalManagementProcedures: StateSelector<RequestTaskState, EmpManagementProcedures> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.managementProcedures);

const selectOriginalControlActivities: StateSelector<RequestTaskState, EmpControlActivities> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.controlActivities,
);

const selectOriginalAbbreviations: StateSelector<RequestTaskState, EmpAbbreviations> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.abbreviations,
);

const selectOriginalAdditionalDocuments: StateSelector<RequestTaskState, AdditionalDocuments> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.additionalDocuments);

const selectEmpReviewDecisionForAmendsDTO: StateSelector<
  RequestTaskState,
  Array<ReviewAmendDecisionDTO>
> = createAggregateSelector(
  empReviewQuery.selectEmpReviewDecisionForAmendsDTO,
  createAggregateSelector(
    selectReviewAttachments,
    empCommonQuery.selectTasksDownloadUrl,
    (attachments, downloadUrl) => ({ attachments, downloadUrl }),
  ),
  selectEmpVariationDetailsReviewDecision,
  (groups, { attachments, downloadUrl }, reviewDetails: ReviewDecisionUnion) => {
    if (reviewDetails?.type !== TaskItemStatus.OPERATOR_AMENDS_NEEDED) {
      return groups;
    }
    const variationReviewGroup: ReviewAmendDecisionDTO = {
      subtask: VARIATION_DETAILS_SUB_TASK,
      decision: {
        type: reviewDetails.type,
        details: {
          requiredChanges: reviewDetails.details?.requiredChanges?.map((decision) => ({
            reason: decision?.reason,
            files:
              decision?.files?.map((id) => ({
                downloadUrl: downloadUrl + `${id}`,
                fileName: attachments[id],
              })) ?? [],
          })),
        },
      },
    };
    return [variationReviewGroup, ...groups];
  },
);

export const empVariationReviewQuery = {
  selectIsEmpSectionsReviewed,
  selectStatusForSubtask,
  selectStatusForEmpVariationReviewDetailsSubtask,
  selectStatusForEmpReviewOverallDecision,
  selectEmpVariationDetailsReviewDecision,
  selectEmpVariationDetails,
  selectReviewGroupDecisions,
  selectReviewAttachments,
  selectSubtaskHasDecision,
  selectIsSubtaskCompleted,
  selectEmpReviewDecisionDTO,
  selectEmpVariationDetailsReviewDecisionDTO,
  selectIsVariationReviewDetailsSubtaskCompleted,
  selectDetermination,
  selectIsOverallDecisionCompleted,
  selectAreAllSectionsWithStatus,
  selectAtLeastOneSectionWithStatus,
  selectOverallDecisionCanBeActivated,
  selectAnySubtaskNeedsAmend,
  selectOriginalOperatorDetails,
  selectOriginalListOfShips,
  selectOriginalEmissionSources,
  selectOriginalGreenhouseGas,
  selectOriginalDataGaps,
  selectOriginalMandate,
  selectOriginalManagementProcedures,
  selectOriginalControlActivities,
  selectOriginalAbbreviations,
  selectOriginalAdditionalDocuments,
  selectOriginalAttachedFiles,
  selectEmpReviewDecisionForAmendsDTO,
};
