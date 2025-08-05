import { inject } from '@angular/core';

import { UncorrectedItem, VerifierComment, VirVerificationData } from '@mrtm/api';

import { TaskItem, TaskSection } from '@netz/common/model';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { VirSubmitTaskItemDetailsComponent } from '@requests/common/vir/components';
import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir/subtasks/respond-to-recommendation';
import { virSubmitQuery } from '@requests/tasks/vir-submit/+state';
import {
  SEND_REPORT_SUB_TASK,
  SEND_REPORT_SUB_TASK_PATH,
} from '@requests/tasks/vir-submit/subtasks/send-report/send-report.helpers';
import { VIR_SUBMIT_PREFIX } from '@requests/tasks/vir-submit/vir-submit.helpers';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const getTaskItem = (
  subtask: keyof VirVerificationData,
  verificationDataItem: UncorrectedItem | VerifierComment,
): TaskItem => {
  const store = inject(RequestTaskStore);

  return {
    name: subtask,
    linkText: 'Respond to recommendation',
    link: `${VIR_SUBMIT_PREFIX}/${RESPOND_TO_RECOMMENDATION_SUBTASK}/${verificationDataItem.reference}`,
    postContentComponent: VirSubmitTaskItemDetailsComponent,
    status: store.select(virSubmitQuery.selectStatusForVerifierRecommendationData(verificationDataItem.reference))(),
    data: {
      verificationDataItem,
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

export const virSubmitTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(virCommonQuery.selectYear)();
  const verificationData = store.select(virCommonQuery.selectVerificationData)();
  const allSubtasksCompleted = store.select(virSubmitQuery.selectAllSubtasksCompleted)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    sections: [
      getSectionsByVerificationData('uncorrectedNonConformities', verificationData?.uncorrectedNonConformities),
      getSectionsByVerificationData('recommendedImprovements', verificationData?.recommendedImprovements),
      getSectionsByVerificationData('priorYearIssues', verificationData?.priorYearIssues),
      {
        title: virSubtaskList.sendReport.title,
        tasks: [
          {
            name: SEND_REPORT_SUB_TASK,
            linkText: 'Send report to regulator',
            link: allSubtasksCompleted ? `${VIR_SUBMIT_PREFIX}/${SEND_REPORT_SUB_TASK_PATH}` : undefined,
            status: allSubtasksCompleted ? TaskItemStatus.NOT_STARTED : TaskItemStatus.CANNOT_START_YET,
          },
        ],
      },
    ].flat(),
  };
};
