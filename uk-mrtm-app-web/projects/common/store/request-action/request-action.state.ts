import { RequestActionDTO } from '@mrtm/api';

export interface RequestActionState {
  action: RequestActionDTO;
}

export const initialRequestActionState: RequestActionState = {
  action: null,
};
