import { InjectionToken } from '@angular/core';

import { RequestDetailsDTO, RequestTaskDTO } from '@mrtm/api';

export type RelatedActionPath =
  | string[]
  | ((params: {
      taskId: RequestTaskDTO['id'] | RequestDetailsDTO['id'];
      requestTaskType?: RequestTaskDTO['type'];
    }) => string[]);

export type RelatedActionsMap = Record<string, { text: string; path: RelatedActionPath }>;

export const TASK_RELATED_ACTIONS_MAP = new InjectionToken<RelatedActionsMap>('Task related actions map');
