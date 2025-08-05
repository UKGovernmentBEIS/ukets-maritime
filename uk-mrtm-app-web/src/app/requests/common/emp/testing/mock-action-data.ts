import { produce } from 'immer';

import { EmpIssuanceApplicationSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionState } from '@netz/common/store';

export const mockSubmittedStateBuild = (
  data?: Partial<Record<keyof EmpIssuanceApplicationSubmittedRequestActionPayload['emissionsMonitoringPlan'], any>>,
  attachments?: EmpIssuanceApplicationSubmittedRequestActionPayload['empAttachments'],
): RequestActionState => {
  return {
    action: {
      ...mockRequestAction,
      payload: produce(mockRequestAction.action.payload, (requestTaskItem) => {
        const payload = requestTaskItem as EmpIssuanceApplicationSubmittedRequestActionPayload;

        payload.emissionsMonitoringPlan = { ...payload.emissionsMonitoringPlan, ...data };
        payload.empAttachments = { ...payload.empAttachments, ...attachments };
      }),
    },
  };
};
