import { FileInfoDTO } from '@mrtm/api';

import { createAggregateSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common/timeline';
import { EmpBatchReissueTaskPayload } from '@requests/timeline/emp-batch-reissue/emp-batch-reissue.types';
import { AttachedFile, EmpBatchVariationDetailsDTO } from '@shared/types';

const transformFileInfoToAttachedFile = (fileInfo: FileInfoDTO, downloadUrl: string): AttachedFile | undefined =>
  fileInfo?.uuid && fileInfo?.name
    ? {
        fileName: fileInfo?.name,
        downloadUrl: `${downloadUrl}document/${fileInfo?.uuid}`,
      }
    : undefined;

const selectSummaryDetails: StateSelector<RequestActionState, EmpBatchVariationDetailsDTO> = createAggregateSelector(
  requestActionQuery.selectAction,
  timelineCommonQuery.selectPayload<EmpBatchReissueTaskPayload>(),
  timelineCommonQuery.selectDownloadUrl,
  (action, payload, downloadUrl) => {
    return {
      id: action?.requestId,
      createdBy: action?.submitter,
      summary: payload?.summary,
      signatory: payload?.signatoryName,
      createdDate: action?.creationDate,
      report: transformFileInfoToAttachedFile(payload?.report, downloadUrl),
      emitters: payload?.numberOfAccounts,
      documents: [
        transformFileInfoToAttachedFile(payload?.officialNotice, downloadUrl),
        transformFileInfoToAttachedFile(payload?.document, downloadUrl),
      ].filter(Boolean),
    } as EmpBatchVariationDetailsDTO;
  },
);

export const empBatchReissueQuery = {
  selectSummaryDetails,
};
