import { produce } from 'immer';

import { RequestTaskPayload } from '@mrtm/api';

import { RequestTaskState } from '@netz/common/store';

export const mockRequestTask: RequestTaskState = {
  requestTaskItem: {
    allowedRequestTaskActions: [],
    requestInfo: {
      resourceType: 'ACCOUNT',
      resources: {
        ACCOUNT: '1',
        CA: 'ENGLAND',
      },
    },
    requestTask: {
      assignable: true,
      assigneeFullName: 'John Doe',
      assigneeUserId: 'f2ee3282-6e27-42a3-9217-464c03fd3d38',
      id: 2,
    },
  },
  relatedTasks: [],
  timeline: [],
  taskReassignedTo: null,
  isEditable: true,
};

export const mockRequestTaskStateBuild = (payload?: RequestTaskPayload): RequestTaskState => {
  return produce(mockRequestTask, (state) => {
    if (payload) {
      state.requestTaskItem.requestTask.payload = payload;
    }
  });
};
