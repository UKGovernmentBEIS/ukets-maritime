import { MrtmRequestTaskActionPayloadType, MrtmRequestTaskType } from '@shared/types';

export const requestDeadlineExtensionSubmitTaskMap: Record<
  MrtmRequestTaskType,
  {
    requestTaskType: MrtmRequestTaskType;
    requestTaskPayloadType: MrtmRequestTaskActionPayloadType;
  }
> = {
  EMP_ISSUANCE_APPLICATION_REVIEW: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_APPLICATION_REVIEW: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
  EMP_ISSUANCE_WAIT_FOR_RDE_RESPONSE: {
    requestTaskType: 'RDE_FORCE_DECISION',
    requestTaskPayloadType: 'RDE_FORCE_DECISION_PAYLOAD',
  },
  EMP_VARIATION_WAIT_FOR_RDE_RESPONSE: {
    requestTaskType: 'RDE_FORCE_DECISION',
    requestTaskPayloadType: 'RDE_FORCE_DECISION_PAYLOAD',
  },
  EMP_ISSUANCE_RDE_RESPONSE_SUBMIT: {
    requestTaskType: 'RDE_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RDE_RESPONSE_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_RDE_RESPONSE_SUBMIT: {
    requestTaskType: 'RDE_RESPONSE_SUBMIT',
    requestTaskPayloadType: 'RDE_RESPONSE_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_WAIT_FOR_PEER_REVIEW: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
  EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
  EMP_ISSUANCE_WAIT_FOR_AMENDS: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
  EMP_VARIATION_WAIT_FOR_AMENDS: {
    requestTaskType: 'RDE_SUBMIT',
    requestTaskPayloadType: 'RDE_SUBMIT_PAYLOAD',
  },
};
