import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { RequestTaskPayload, TasksService } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

export abstract class TaskApiService<T extends RequestTaskPayload> {
  protected readonly store = inject(RequestTaskStore);
  protected readonly service = inject(TasksService);

  abstract save(payload: T): Observable<T>;

  abstract submit(): Observable<void>;
}
