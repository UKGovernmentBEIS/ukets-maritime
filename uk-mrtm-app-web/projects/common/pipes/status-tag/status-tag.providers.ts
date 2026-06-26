import { InjectionToken } from '@angular/core';

import { TagColor } from '@netz/govuk-components';

export type TaskStatusTag = { text: string; color: TagColor; style: 'none' | 'fill' | 'tinted' };
export type TaskStatusTagMap = Record<string, TaskStatusTag>;

export const TASK_STATUS_TAG_MAP = new InjectionToken<TaskStatusTagMap>('Task status tag map');
