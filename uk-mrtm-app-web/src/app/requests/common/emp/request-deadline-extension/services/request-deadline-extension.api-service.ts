import { inject, Service } from '@angular/core';

import { Observable } from 'rxjs';

import { RdePayload, RequestTaskActionPayload, TasksService } from '@mrtm/api';

import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { EmpRdeTaskPayload } from '@requests/common/emp/request-deadline-extension/request-deadline-extension.types';
import { requestDeadlineExtensionSubmitTaskMap } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-task.map';

export const RDE_SAVE_ACTION = 'RDE_SAVE';
export const RDE_SAVE_PAYLOAD_TYPE = 'RDE_SAVE_PAYLOAD';

@Service()
export class RequestDeadlineExtensionApiService {
  private readonly taskStore = inject(RequestTaskStore);
  private readonly tasksService = inject(TasksService);
  private readonly businessErrorService: BusinessErrorService = inject(BusinessErrorService);
  private readonly pendingRequestService = inject(PendingRequestService);

  /**
   * Persists the RDE details on the task (RDE_SAVE) so that the backend can generate the document preview
   * of the notification step from the saved extension date and deadline.
   */
  public save(rdePayload: RdePayload): Observable<unknown> {
    const payload: EmpRdeTaskPayload = { rdePayload, payloadType: RDE_SAVE_PAYLOAD_TYPE };

    return this.processAction(RDE_SAVE_ACTION, payload);
  }

  public submit(payload: any): Observable<unknown> {
    const taskType = this.taskStore.select(requestTaskQuery.selectRequestTaskType)();
    const rdeTaskMap = requestDeadlineExtensionSubmitTaskMap[taskType];

    return this.processAction(rdeTaskMap?.requestTaskType, {
      ...payload,
      payloadType: rdeTaskMap?.requestTaskPayloadType,
    });
  }

  private processAction(
    requestTaskActionType: string,
    requestTaskActionPayload: RequestTaskActionPayload,
  ): Observable<unknown> {
    const requestTaskId = this.taskStore.select(requestTaskQuery.selectRequestTaskId)();

    return this.tasksService
      .processRequestTaskAction({ requestTaskId, requestTaskActionType, requestTaskActionPayload })
      .pipe(
        this.pendingRequestService.trackRequest(),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      );
  }
}
