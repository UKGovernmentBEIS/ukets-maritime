import { inject } from '@angular/core';

import { UncorrectedItem, VerifierComment, VirVerificationData } from '@mrtm/api';

import { TaskItem, TaskSection } from '@netz/common/model';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { virSubtaskList } from '@requests/common/vir';
import { VirSubmitTaskItemDetailsComponent } from '@requests/common/vir/components';
import { virSubmittedQuery } from '@requests/timeline/vir-submitted/+state';
import { VIR_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/vir-submitted/vir-submitted.constants';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const getTaskItem = (
  subtask: keyof VirVerificationData,
  verificationDataItem: UncorrectedItem | VerifierComment,
  routePrefix: string,
): TaskItem => {
  return {
    name: subtask,
    linkText: 'Respond to recommendation',
    link: `${routePrefix}/${verificationDataItem.reference}`,
    status: undefined,
    postContentComponent: VirSubmitTaskItemDetailsComponent,
    data: {
      verificationDataItem,
    },
  };
};

const getSectionsByVerificationData = (
  section: keyof VirVerificationData,
  item: Record<string, UncorrectedItem | VerifierComment>,
  routePrefix: string,
): Array<TaskSection> =>
  Object.keys(item ?? {}).map((key) => ({
    title: `${key}: ${virSubtaskList?.[section]?.title}`,
    tasks: [getTaskItem(section, item[key], routePrefix)],
  }));

export const virSubmittedTaskContent =
  (routePrefix: string = VIR_SUBMITTED_ROUTE_PREFIX): RequestTaskPageContentFactory =>
  () => {
    const store = inject(RequestActionStore);
    const actionType = store.select(requestActionQuery.selectActionType)();
    const year = store.select(virSubmittedQuery.selectReportingYear)();
    const verificationData = store.select(virSubmittedQuery.selectVerificationData)();

    return {
      header: taskActionTypeToTitleTransformer(actionType, year),
      sections: [
        ...getSectionsByVerificationData(
          'uncorrectedNonConformities',
          verificationData?.uncorrectedNonConformities,
          routePrefix,
        ),
        ...getSectionsByVerificationData(
          'recommendedImprovements',
          verificationData?.recommendedImprovements,
          routePrefix,
        ),
        ...getSectionsByVerificationData('priorYearIssues', verificationData?.priorYearIssues, routePrefix),
      ],
    };
  };
