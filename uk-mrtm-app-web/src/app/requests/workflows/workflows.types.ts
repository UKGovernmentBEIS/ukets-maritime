import { ItemDTO, RequestActionDTO, RequestDetailsDTO } from '@mrtm/api';

import { MrtmRequestType } from '@shared/types';

export interface WorkflowState {
  details?: RequestDetailsDTO;
  actions?: Array<RequestActionDTO>;
  tasks?: Array<ItemDTO>;
  aerRelatedTasks?: Array<MrtmRequestType>;
}
