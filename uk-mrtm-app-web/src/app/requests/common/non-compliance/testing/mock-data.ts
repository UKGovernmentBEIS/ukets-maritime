import { produce } from 'immer';

import {
  NonComplianceCivilPenaltyRequestTaskPayload,
  NonComplianceFinalDetermination,
  NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  NonComplianceNoticeOfIntentRequestTaskPayload,
  RequestInfoDTO,
} from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { NonComplianceCivilPenaltyUpload } from '@requests/common/non-compliance/non-compliance-civil-penalty/non-compliance-civil-penalty.types';
import {
  NonComplianceDetails,
  NonComplianceDetailsSummary,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance/non-compliance-details/non-compliance-details.types';
import { NonComplianceFinalDeterminationTaskPayload } from '@requests/common/non-compliance/non-compliance-final-determination/non-compliance-final-determination.types';
import { NonComplianceInitialPenaltyNoticeUpload } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/non-compliance-initial-penalty-notice.types';
import { AttachedFile } from '@shared/types';

export const mockNonComplianceDetails: NonComplianceDetails = {
  availableRequests: [
    { id: 'MAMP00010', type: 'EMP_ISSUANCE' },
    { id: 'MAR00010-2025', type: 'AER' },
    { id: 'MAR00010-2024', type: 'AER' },
    { id: 'MAV00010-1', type: 'EMP_VARIATION' },
    { id: 'MAN00010-1', type: 'EMP_NOTIFICATION' },
    { id: 'MAV00010-2', type: 'EMP_VARIATION' },
    { id: 'MAV00010-3', type: 'EMP_VARIATION' },
  ],
  reason: 'FAILURE_TO_MONITOR_EMISSIONS',
  selectedRequests: ['MAMP00010', 'MAV00010-2', 'MAN00010-1', 'MAR00010-2024'],
  civilPenalty: true,
  noticeOfIntent: true,
  initialPenalty: true,
  nonComplianceDate: '2025-05-03',
  complianceDate: '2025-07-03',
  comments: 'Lorem ipsum',
};

export const mockNonComplianceDetailsSummary: NonComplianceDetailsSummary = {
  reason: 'FAILURE_TO_MONITOR_EMISSIONS',
  civilPenalty: true,
  noticeOfIntent: true,
  initialPenalty: true,
  nonComplianceDate: '2025-05-03',
  complianceDate: '2025-07-03',
  comments: 'Lorem ipsum',
  selectedRequestsMapped: [
    { id: 'MAMP00010', type: 'EMP_ISSUANCE' },
    { id: 'MAV00010-2', type: 'EMP_VARIATION' },
    { id: 'MAN00010-1', type: 'EMP_NOTIFICATION' },
    { id: 'MAR00010-2024', type: 'AER' },
  ],
};

export const mockNonComplianceSubmitRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MANC00010-1',
      type: 'NON_COMPLIANCE',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'NON_COMPLIANCE_APPLICATION_SUBMIT',
      payload: {
        payloadType: 'NON_COMPLIANCE_SAVE_APPLICATION_PAYLOAD',
        ...mockNonComplianceDetails,
        nonComplianceAttachments: {},
        sectionsCompleted: { details: 'IN_PROGRESS' },
      } as NonComplianceSubmitTaskPayload,
    },
  },
};

export const mockNonComplianceInitialPenaltyNoticeUpload: NonComplianceInitialPenaltyNoticeUpload = {
  initialPenaltyNotice: '66b0ddb3-dc64-4ea3-8a68-0afa59128e99',
  comments: 'GG',
  nonComplianceAttachments: {
    '66b0ddb3-dc64-4ea3-8a68-0afa59128e99': 'just-a-filename.jpg',
  },
};

export const mockNonComplianceCivilPenaltyUpload: NonComplianceCivilPenaltyUpload = {
  civilPenalty: '66b0ddb3-dc64-4ea3-8a68-0afa59128e99',
  penaltyAmount: '50.01',
  dueDate: '2026-06-21',
  comments: 'GG',
  nonComplianceAttachments: {
    '66b0ddb3-dc64-4ea3-8a68-0afa59128e99': 'just-a-filename.jpg',
  },
};

export const mockNonComplianceFiles: AttachedFile[] = [
  {
    downloadUrl: 'download/66b0ddb3-dc64-4ea3-8a68-0afa59128e99',
    fileName: 'just-a-filename.jpg',
  },
];

export const mockNonComplianceFinalDetermination: NonComplianceFinalDetermination = {
  complianceRestored: 'YES',
  complianceRestoredDate: '2026-06-20',
  reissuePenalty: false,
  operatorPaid: true,
  operatorPaidDate: '2026-06-21',
  comments: 'GG',
};

export const mockNonComplianceInitialPenaltyNoticeRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MANC00010-1',
      type: 'NON_COMPLIANCE',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE',
      payload: {
        payloadType: 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PAYLOAD',
        ...mockNonComplianceInitialPenaltyNoticeUpload,
        sendEmailNotification: true,
        issueNoticeOfIntent: true,
        sectionsCompleted: {
          upload: 'COMPLETED',
        },
      } as NonComplianceInitialPenaltyNoticeRequestTaskPayload,
    },
  },
};

export const mockNonComplianceNoticeOfIntentRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MANC00010-1',
      type: 'NON_COMPLIANCE',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'NON_COMPLIANCE_NOTICE_OF_INTENT',
      payload: {
        payloadType: 'NON_COMPLIANCE_NOTICE_OF_INTENT_PAYLOAD',
        noticeOfIntent: '66b0ddb3-dc64-4ea3-8a68-0afa59128e99',
        comments: 'GG',
        nonComplianceAttachments: {
          '66b0ddb3-dc64-4ea3-8a68-0afa59128e99': 'just-a-filename.jpg',
        },
        sendEmailNotification: true,
        issueNoticeOfIntent: true,
        sectionsCompleted: {
          upload: 'COMPLETED',
        },
      } as NonComplianceNoticeOfIntentRequestTaskPayload,
    },
  },
};

export const mockNonComplianceCivilPenaltyRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MANC00010-1',
      type: 'NON_COMPLIANCE',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'NON_COMPLIANCE_CIVIL_PENALTY',
      payload: {
        payloadType: 'NON_COMPLIANCE_CIVIL_PENALTY_PAYLOAD',
        ...mockNonComplianceCivilPenaltyUpload,
        sendEmailNotification: true,
        sectionsCompleted: {
          upload: 'COMPLETED',
        },
      } as NonComplianceCivilPenaltyRequestTaskPayload,
    },
  },
};

export const mockNonComplianceFinalDeterminationRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestInfo: {
      accountId: 1,
      competentAuthority: 'ENGLAND',
      id: 'MANC00010-1',
      type: 'NON_COMPLIANCE',
    } as RequestInfoDTO,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'NON_COMPLIANCE_FINAL_DETERMINATION',
      payload: {
        payloadType: 'NON_COMPLIANCE_FINAL_DETERMINATION_PAYLOAD',
        ...mockNonComplianceFinalDetermination,
        sendEmailNotification: true,
        sectionsCompleted: {
          upload: 'COMPLETED',
        },
      } as NonComplianceFinalDeterminationTaskPayload,
    },
  },
};

export const mockNonComplianceStateBuild = (
  data?: Partial<Record<keyof NonComplianceSubmitTaskPayload, any>>,
  taskStatus?: Partial<Record<string, TaskItemStatus>>,
  attachments?: NonComplianceSubmitTaskPayload['nonComplianceAttachments'],
): RequestTaskState => {
  return {
    ...mockNonComplianceSubmitRequestTask,
    requestTaskItem: produce(mockNonComplianceSubmitRequestTask.requestTaskItem, (requestTaskItem) => {
      let payload = requestTaskItem.requestTask.payload as NonComplianceSubmitTaskPayload;
      payload = { ...payload, ...data };
      payload.sectionsCompleted = { ...payload.sectionsCompleted, ...taskStatus };
      payload.nonComplianceAttachments = { ...payload.nonComplianceAttachments, ...attachments };
    }),
  };
};
