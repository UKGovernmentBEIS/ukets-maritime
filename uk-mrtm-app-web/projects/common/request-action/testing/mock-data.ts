import { produce } from 'immer';

import { RequestActionPayload } from '@mrtm/api';

import { RequestActionState } from '@netz/common/store';

export const mockRequestAction: RequestActionState = {
  action: {
    id: 72,
    type: 'EMP_ISSUANCE_APPLICATION_SUBMITTED',
    payload: {},
    requestId: 'MAMP00001',
    requestType: 'EMP_ISSUANCE',
    requestAccountId: 1,
    competentAuthority: 'ENGLAND',
    submitter: 'Operator1 England',
    creationDate: '2024-10-22T10:17:50.044135Z',
  },
};

export const mockRequestActionStateBuild = (payload?: RequestActionPayload): RequestActionState => {
  return produce(mockRequestAction, (state) => {
    state.action.payload = payload;
  });
};
