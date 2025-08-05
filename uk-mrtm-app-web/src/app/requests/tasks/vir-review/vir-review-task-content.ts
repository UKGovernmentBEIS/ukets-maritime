import { inject } from '@angular/core';

import { UncorrectedItem, VerifierComment, VirVerificationData } from '@mrtm/api';

import { TaskItem, TaskSection } from '@netz/common/model';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_OPERATOR_SUBTASK, REVIEW_REPORT_SUMMARY_SUBTASK, virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import { VirReviewTaskItemDetailsComponent } from '@requests/tasks/vir-review/components';
import { VIR_REVIEW_PREFIX } from '@requests/tasks/vir-review/vir-review.helpers';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const getTaskItem = (
  subtask: keyof VirVerificationData,
  verificationDataItem: UncorrectedItem | VerifierComment,
): TaskItem => {
  const store = inject(RequestTaskStore);

  return {
    name: subtask,
    linkText: 'Respond to operator',
    link: `${VIR_REVIEW_PREFIX}/${RESPOND_TO_OPERATOR_SUBTASK}/${verificationDataItem.reference}`,
    postContentComponent: VirReviewTaskItemDetailsComponent,
    status: store.select(virReviewQuery.selectStatusForVerifierRecommendationData(verificationDataItem.reference))(),
    data: {
      operatorResponse: store.select(virCommonQuery.selectOperatorResponseData(verificationDataItem.reference))(),
    },
  };
};

const getSectionsByVerificationData = (
  section: keyof VirVerificationData,
  item: Record<string, UncorrectedItem | VerifierComment>,
): Array<TaskSection> =>
  Object.keys(item ?? {}).map((key) => ({
    title: `${key}: ${virSubtaskList?.[section]?.title}`,
    tasks: [getTaskItem(section, item[key])],
  }));

export const virReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(virCommonQuery.selectYear)();
  const verificationData = store.select(virCommonQuery.selectVerificationData)();
  const allSubtasksCompleted = store.select(virReviewQuery.selectAllSubtasksCompleted)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    sections: [
      getSectionsByVerificationData('uncorrectedNonConformities', verificationData?.uncorrectedNonConformities),
      getSectionsByVerificationData('recommendedImprovements', verificationData?.recommendedImprovements),
      getSectionsByVerificationData('priorYearIssues', verificationData?.priorYearIssues),
      {
        title: 'Create report summary',
        tasks: [
          {
            name: REVIEW_REPORT_SUMMARY_SUBTASK,
            linkText: 'Create summary',
            link: `${VIR_REVIEW_PREFIX}/${REVIEW_REPORT_SUMMARY_SUBTASK}`,
            status: store.select(virReviewQuery.selectStatusForReportSummary)(),
          },
        ],
      },
      {
        title: virSubtaskList.sendReport.title,
        tasks: [
          {
            name: 'submit-report',
            linkText: 'Send report to operator',
            link: allSubtasksCompleted ? `${VIR_REVIEW_PREFIX}/send-report` : undefined,
            status: allSubtasksCompleted ? TaskItemStatus.NOT_STARTED : TaskItemStatus.CANNOT_START_YET,
          },
        ],
      },
    ].flat(),
  };
};
