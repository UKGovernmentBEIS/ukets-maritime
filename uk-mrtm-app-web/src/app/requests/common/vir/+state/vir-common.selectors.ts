import { OperatorImprovementResponse, VirVerificationData } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { VirCommonTaskPayload } from '@requests/common/vir/vir.types';
import {
  VirSubmitTaskPayload,
  VirVerifierRecommendationData,
  VirVerifierRecommendationDataItem,
} from '@requests/tasks/vir-submit/vir-submit.types';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, VirCommonTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectYear: StateSelector<RequestTaskState, string> = createDescendingSelector(
  requestTaskQuery.selectRequestMetadata,
  (metadata: any) => metadata?.year,
);

const selectSectionsCompleted: StateSelector<
  RequestTaskState,
  Record<string, TaskItemStatus>
> = createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted as Record<string, TaskItemStatus>);

const selectVirAttachments: StateSelector<RequestTaskState, VirSubmitTaskPayload['virAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.virAttachments);

const selectVerificationData: StateSelector<RequestTaskState, VirVerificationData> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.verificationData,
);

const selectVirVerifierRecommendationData: StateSelector<RequestTaskState, VirVerifierRecommendationData> =
  createDescendingSelector(selectVerificationData, (payload) =>
    Object.keys(payload ?? {})
      .map((key) => {
        return Object.keys(payload?.[key]).map((itemKey) => {
          return {
            [itemKey]: {
              ...payload?.[key]?.[itemKey],
              verificationDataKey: key,
            },
          };
        });
      })
      .flat()
      .reduce((obj, item) => ({ ...obj, ...item }), {}),
  );

const selectVirVerifierRecommendationDataByKey = (
  key: string,
): StateSelector<RequestTaskState, VirVerifierRecommendationDataItem> =>
  createDescendingSelector(selectVirVerifierRecommendationData, (payload) => payload?.[key?.toUpperCase()]);

const selectOperatorResponseData = (key: string): StateSelector<RequestTaskState, OperatorImprovementResponse> =>
  createDescendingSelector(selectPayload, (payload) => payload?.operatorImprovementResponses?.[key.toUpperCase()]);

const selectOperatorResponseSummaryData = (
  key: string,
): StateSelector<RequestTaskState, Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] }> =>
  createAggregateSelector(
    selectOperatorResponseData(key),
    requestTaskQuery.selectTasksDownloadUrl,
    selectVirAttachments,
    (payload, downloadUrl, attachments) => {
      const { files, ...rest } = payload ?? {};

      return {
        ...rest,
        files:
          files?.map((id) => ({
            downloadUrl: downloadUrl + id,
            fileName: attachments?.[id],
          })) ?? [],
      } as Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] };
    },
  );

export const virCommonQuery = {
  selectPayload,
  selectYear,
  selectSectionsCompleted,
  selectVirAttachments,
  selectVerificationData,
  selectVirVerifierRecommendationData,
  selectVirVerifierRecommendationDataByKey,
  selectOperatorResponseData,
  selectOperatorResponseSummaryData,
};
