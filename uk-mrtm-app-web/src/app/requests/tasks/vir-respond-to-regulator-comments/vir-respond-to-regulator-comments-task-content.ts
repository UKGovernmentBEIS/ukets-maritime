import { inject } from '@angular/core';

import { UncorrectedItem, VerifierComment, VirVerificationData } from '@mrtm/api';

import { TaskItem, TaskSection } from '@netz/common/model';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir/subtasks/respond-to-regulator';
import { virRespondToRegulatorCommentsQuery } from '@requests/tasks/vir-respond-to-regulator-comments/+state';
import { VirRespondToRegulatorCommentsTaskItemDetailsComponent } from '@requests/tasks/vir-respond-to-regulator-comments/components';
import {
  SEND_REPORT_SUB_TASK,
  SEND_REPORT_SUB_TASK_PATH,
} from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report/send-report.helpers';
import { VIR_RESPOND_TO_REGULATOR_COMMENTS_PREFIX } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.helpers';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const getTaskItem = (
  subtask: keyof VirVerificationData,
  verificationDataItem: UncorrectedItem | VerifierComment,
): TaskItem => {
  const store = inject(RequestTaskStore);

  return {
    name: subtask,
    linkText: 'Respond to the regulator',
    link: `${VIR_RESPOND_TO_REGULATOR_COMMENTS_PREFIX}/${RESPOND_TO_REGULATOR_SUBTASK}/${verificationDataItem.reference}`,
    postContentComponent: VirRespondToRegulatorCommentsTaskItemDetailsComponent,
    status: store.select(
      virRespondToRegulatorCommentsQuery.selectStatusForOperatorImprovementResponseData(verificationDataItem.reference),
    )(),
    data: {
      regulatorImprovements: store.select(
        virRespondToRegulatorCommentsQuery.selectRegulatorImprovementResponseData(verificationDataItem.reference),
      )(),
    },
  };
};

const getSectionsByVerificationData = (
  section: keyof VirVerificationData,
  item: Record<string, UncorrectedItem | VerifierComment>,
): Array<TaskSection> => {
  const store = inject(RequestTaskStore);
  const needsCommentKeys = Object.keys(
    store.select(virRespondToRegulatorCommentsQuery.selectPayload)()?.regulatorImprovementResponses ?? {},
  );

  return Object.keys(item ?? {})
    .map((key) => {
      if (!needsCommentKeys.includes(key)) {
        return undefined;
      }

      const taskItem = getTaskItem(section, item[key]);

      return [
        {
          title: `${key}: ${virSubtaskList?.[section]?.title}`,
          tasks: [taskItem],
        },
        {
          title: 'Send response',
          tasks: [
            {
              name: SEND_REPORT_SUB_TASK,
              linkText: 'Send response to regulator',
              link:
                taskItem.status === TaskItemStatus.COMPLETED
                  ? `${VIR_RESPOND_TO_REGULATOR_COMMENTS_PREFIX}/${SEND_REPORT_SUB_TASK_PATH}/${key}`
                  : undefined,
              status:
                taskItem.status === TaskItemStatus.COMPLETED
                  ? TaskItemStatus.NOT_STARTED
                  : TaskItemStatus.CANNOT_START_YET,
            },
          ],
        },
      ];
    })
    .flat()
    .filter(Boolean);
};

export const virRespondToRegulatorCommentsTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(virCommonQuery.selectYear)();
  const verificationData = store.select(virCommonQuery.selectVerificationData)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    sections: [
      getSectionsByVerificationData('uncorrectedNonConformities', verificationData?.uncorrectedNonConformities),
      getSectionsByVerificationData('recommendedImprovements', verificationData?.recommendedImprovements),
      getSectionsByVerificationData('priorYearIssues', verificationData?.priorYearIssues),
    ].flat(),
  };
};
