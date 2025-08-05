import { RequestTaskActionPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

export type SaveActionTypes = {
  actionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  actionPayloadType: RequestTaskActionPayload['payloadType'];
};
