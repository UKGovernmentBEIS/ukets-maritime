import { MrtmRequestTaskActionPayloadType, MrtmRequestTaskType } from '@shared/types';

export const requestForInformationTaskMap: Record<
  MrtmRequestTaskType,
  {
    requestTaskType: MrtmRequestTaskType;
    requestTaskPayloadType: MrtmRequestTaskActionPayloadType;
  }
> = {
  EMP_ISSUANCE_APPLICATION_REVIEW: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_APPLICATION_REVIEW: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  EMP_NOTIFICATION_APPLICATION_REVIEW: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  EMP_ISSUANCE_RFI_RESPONSE_SUBMIT: {
    requestTaskType: 'RFI_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RFI_RESPONSE_SUBMIT_PAYLOAD',
  },
  EMP_NOTIFICATION_RFI_RESPONSE_SUBMIT: {
    requestTaskType: 'RFI_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RFI_RESPONSE_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_RFI_RESPONSE_SUBMIT: {
    requestTaskType: 'RFI_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RFI_RESPONSE_SUBMIT_PAYLOAD',
  },
  EMP_ISSUANCE_WAIT_FOR_AMENDS: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_WAIT_FOR_AMENDS: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  VIR_APPLICATION_REVIEW: {
    requestTaskType: 'RFI_SUBMIT',
    requestTaskPayloadType: 'RFI_SUBMIT_PAYLOAD',
  },
  VIR_RFI_RESPONSE_SUBMIT: {
    requestTaskType: 'RFI_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RFI_RESPONSE_SUBMIT_PAYLOAD',
  },
};
