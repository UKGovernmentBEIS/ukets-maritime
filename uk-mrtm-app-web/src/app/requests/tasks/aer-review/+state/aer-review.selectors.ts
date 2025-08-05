import { isNil } from 'lodash-es';

import { AerDataReviewDecision, AerSaveReviewGroupDecisionRequestTaskActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_SUBTASK_REVIEW_GROUP_MAP } from '@requests/common/aer/common';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import { AerReviewDecisionDto } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, AerReviewTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as AerReviewTaskPayload,
);

const selectStatusForSubtask = (
  subtask: keyof (AerReviewTaskPayload['verificationReport'] & AerReviewTaskPayload['aer']) | string,
  defaultStatus?: TaskItemStatus,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    aerCommonQuery.selectAerSectionsCompleted,
    (completed) => (completed?.[subtask] ?? defaultStatus) as TaskItemStatus,
  );

const selectReviewAttachments: StateSelector<RequestTaskState, AerReviewTaskPayload['reviewAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<
  RequestTaskState,
  Record<string, AerDataReviewDecision>
> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reviewGroupDecisions as Record<string, AerDataReviewDecision>,
);

const selectReviewGroupDecision = (
  group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'],
): StateSelector<RequestTaskState, AerDataReviewDecision> =>
  createDescendingSelector(selectReviewGroupDecisions, (payload) => payload?.[group] as AerDataReviewDecision);

const selectSubtaskHasDecision = (
  group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'],
): StateSelector<RequestTaskState, boolean> =>
  createDescendingSelector(selectReviewGroupDecision(group), (groupDecision) => !isNil(groupDecision?.type));

const selectCanReturnForAmends: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  requestTaskQuery.selectAllowedRequestTaskActions,
  aerCommonQuery.selectAerSectionsCompleted,
  selectReviewGroupDecisions,
  (allowedRequestTaskActions, completed, groupDecisions) => {
    if (!allowedRequestTaskActions.includes('AER_REVIEW_RETURN_FOR_AMENDS')) {
      return false;
    }

    const groupMap = Array.from(Object.entries(AER_SUBTASK_REVIEW_GROUP_MAP));
    for (const [key, decision] of Object.entries(groupDecisions)) {
      const subtask = groupMap.find(([, groupName]) => groupName === key)?.[0];
      if (decision?.type === 'OPERATOR_AMENDS_NEEDED' && completed[subtask] === TaskItemStatus.OPERATOR_AMENDS_NEEDED) {
        return true;
      }
    }

    return false;
  },
);

const selectCanCompleteReport: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  createAggregateSelector(
    requestTaskQuery.selectAllowedRequestTaskActions,
    aerCommonQuery.selectHasReportingObligation,
    selectCanReturnForAmends,
    (allowedRequestTaskActions, hasReportingObligation, canReturnForAmends) => ({
      allowedRequestTaskActions,
      hasReportingObligation,
      canReturnForAmends,
    }),
  ),
  selectPayload,
  ({ allowedRequestTaskActions, hasReportingObligation, canReturnForAmends }, payload) => {
    const { aerSectionsCompleted, reviewGroupDecisions, aer } = payload;
    const hasPorts = !!aer?.portEmissions?.ports?.length;
    const hasVoyages = !!aer?.voyageEmissions?.voyages?.length;

    if (!allowedRequestTaskActions.includes('AER_COMPLETE_REVIEW') || canReturnForAmends) {
      return false;
    }

    if (
      !hasReportingObligation &&
      aerSectionsCompleted[REPORTING_OBLIGATION_SUB_TASK] === TaskItemStatus.ACCEPTED &&
      (reviewGroupDecisions[AER_SUBTASK_REVIEW_GROUP_MAP[REPORTING_OBLIGATION_SUB_TASK]] as AerDataReviewDecision)
        ?.type === 'ACCEPTED'
    ) {
      return true;
    }

    for (const [section, group] of Object.entries(AER_SUBTASK_REVIEW_GROUP_MAP)) {
      if (
        (!hasPorts && section === AER_PORTS_SUB_TASK) ||
        (!hasVoyages && section === AER_VOYAGES_SUB_TASK) ||
        section === REPORTING_OBLIGATION_SUB_TASK
      ) {
        continue;
      }

      if (
        aerSectionsCompleted[section] !== TaskItemStatus.ACCEPTED &&
        (reviewGroupDecisions[group] as AerDataReviewDecision)?.type !== 'ACCEPTED'
      ) {
        return false;
      }
    }

    return true;
  },
);

const selectDecisionNeededAmends = createAggregateSelector(
  createAggregateSelector(
    selectReviewAttachments,
    requestTaskQuery.selectTasksDownloadUrl,
    aerCommonQuery.selectAerSectionsCompleted,
    (attachments, downloadUrl, completed) => ({
      attachments,
      downloadUrl,
      completed,
    }),
  ),
  selectReviewGroupDecisions,
  ({ attachments, downloadUrl, completed }, groupDecisions) => {
    const result: Array<{
      subtask: string;
      decision: AerReviewDecisionDto;
    }> = [];

    for (const [sectionKey, groupKey] of Object.entries(AER_SUBTASK_REVIEW_GROUP_MAP)) {
      const subtask = groupDecisions?.[groupKey] as AerReviewDecisionDto;

      if (
        !subtask ||
        subtask?.type !== 'OPERATOR_AMENDS_NEEDED' ||
        completed[sectionKey] !== TaskItemStatus.OPERATOR_AMENDS_NEEDED
      ) {
        continue;
      }

      result.push({
        subtask: sectionKey,
        decision: {
          ...subtask,
          details: {
            ...subtask?.details,
            requiredChanges: subtask?.details?.requiredChanges?.map((change) => ({
              ...change,
              files: change?.files?.map((file) => ({
                fileName: attachments[file as any],
                downloadUrl: `${downloadUrl}/${file}`,
              })),
            })),
          },
        },
      });
    }

    return result;
  },
);

const selectSummaryReviewGroupDecision = (group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group']) =>
  createAggregateSelector(
    requestTaskQuery.selectTasksDownloadUrl,
    selectReviewAttachments,
    selectReviewGroupDecision(group),
    (downloadUrl, attachments, groupDecision) => ({
      ...groupDecision,
      details: {
        ...groupDecision?.details,
        requiredChanges: (groupDecision as AerReviewDecisionDto)?.details?.requiredChanges?.map((change) => ({
          ...change,
          files: change?.files?.map((file) => ({
            fileName: attachments[file as any],
            downloadUrl: `${downloadUrl}/${file}`,
          })),
        })),
      },
    }),
  );

export const aerReviewQuery = {
  selectPayload,
  selectStatusForSubtask,
  selectReviewAttachments,
  selectReviewGroupDecision,
  selectSubtaskHasDecision,
  selectCanCompleteReport,
  selectCanReturnForAmends,
  selectDecisionNeededAmends,
  selectSummaryReviewGroupDecision,
};
