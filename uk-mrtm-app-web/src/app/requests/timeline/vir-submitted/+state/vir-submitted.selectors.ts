import {
  OperatorImprovementResponse,
  VirApplicationSubmittedRequestActionPayload,
  VirVerificationData,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import {
  VirVerifierRecommendationData,
  VirVerifierRecommendationDataItem,
} from '@requests/tasks/vir-submit/vir-submit.types';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, VirApplicationSubmittedRequestActionPayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (payload) => payload as VirApplicationSubmittedRequestActionPayload,
  );

const selectReportingYear: StateSelector<
  RequestActionState,
  VirApplicationSubmittedRequestActionPayload['reportingYear']
> = createDescendingSelector(selectPayload, (payload) => payload?.reportingYear);

const selectVirAttachments: StateSelector<RequestActionState, Record<string, string>> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.virAttachments,
);

const selectVerificationData: StateSelector<RequestActionState, VirVerificationData> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.verificationData,
);

const selectVirVerifierRecommendationData: StateSelector<RequestActionState, VirVerifierRecommendationData> =
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
): StateSelector<RequestActionState, VirVerifierRecommendationDataItem> =>
  createDescendingSelector(selectVirVerifierRecommendationData, (payload) => payload?.[key?.toUpperCase()]);

const selectOperatorResponseData = (key: string): StateSelector<RequestActionState, OperatorImprovementResponse> =>
  createDescendingSelector(selectPayload, (payload) => payload?.operatorImprovementResponses?.[key.toUpperCase()]);

const selectOperatorResponseSummaryData = (
  key: string,
): StateSelector<RequestActionState, Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] }> =>
  createAggregateSelector(
    selectOperatorResponseData(key),
    timelineCommonQuery.selectDownloadUrl,
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

export const virSubmittedQuery = {
  selectPayload,
  selectReportingYear,
  selectVerificationData,
  selectVirVerifierRecommendationData,
  selectVirVerifierRecommendationDataByKey,
  selectOperatorResponseSummaryData,
};
