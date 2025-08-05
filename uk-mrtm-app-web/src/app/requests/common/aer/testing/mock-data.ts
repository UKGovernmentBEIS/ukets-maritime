import { produce } from 'immer';

import { AdditionalDocuments, RequestInfoDTO } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile } from '@shared/types';

export const mockAttachedFiles: AttachedFile[] = [
  { downloadUrl: 'url1', fileName: 'FileName1' },
  { downloadUrl: 'url2', fileName: 'FileName2' },
];

export const mockAerAdditionalDocuments: AdditionalDocuments = {
  exist: true,
  documents: ['11111111-1111-4111-a111-111111111111'],
};

export const mockAerApplicationSubmitRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MAR00001-2025',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'AER_APPLICATION_SUBMIT',
      payload: {
        payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
      } as AerSubmitTaskPayload,
    },
  },
};

export const mockAerStateBuild = (
  data?: Partial<Record<keyof AerSubmitTaskPayload['aer'], any>>,
  taskStatus?: Partial<Record<keyof AerSubmitTaskPayload['aer'], TaskItemStatus>>,
  attachments?: AerSubmitTaskPayload['aerAttachments'],
): RequestTaskState => {
  return {
    ...mockAerApplicationSubmitRequestTask,
    requestTaskItem: produce(mockAerApplicationSubmitRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as AerSubmitTaskPayload;

      payload.aer = { ...payload.aer, ...data };
      payload.aerSectionsCompleted = { ...payload.aerSectionsCompleted, ...taskStatus };
      payload.aerAttachments = { ...payload.aerAttachments, ...attachments };
    }),
  };
};
