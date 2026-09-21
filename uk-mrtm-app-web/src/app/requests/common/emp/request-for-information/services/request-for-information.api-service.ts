import { inject, Service } from '@angular/core';

import { Observable } from 'rxjs';

import { RequestTaskActionPayload, RfiSubmitPayload, TasksService } from '@mrtm/api';

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

import { EmpRfiTaskPayload } from '@requests/common/emp/request-for-information/request-for-information.types';
import { requestForInformationTaskMap } from '@requests/common/emp/request-for-information/request-for-information-task.map';

export const RFI_SAVE_ACTION = 'RFI_SAVE';
export const RFI_SAVE_PAYLOAD_TYPE = 'RFI_SAVE_PAYLOAD';

@Service()
export class RequestForInformationApiService {
  private readonly taskStore = inject(RequestTaskStore);
  private readonly tasksService = inject(TasksService);
  private readonly businessErrorService: BusinessErrorService = inject(BusinessErrorService);
  private readonly pendingRequestService = inject(PendingRequestService);

  /**
   * Persists the RFI details on the task (RFI_SAVE) so that the backend can generate the document preview
   * of the notification step from the saved questions, files and deadline.
   */
  public save(rfiSubmitPayload: RfiSubmitPayload): Observable<unknown> {
    const payload: EmpRfiTaskPayload = { rfiSubmitPayload, payloadType: RFI_SAVE_PAYLOAD_TYPE };

    return this.processAction(RFI_SAVE_ACTION, payload);
  }

  public submit(payload: any): Observable<unknown> {
    const taskType = this.taskStore.select(requestTaskQuery.selectRequestTaskType)();
    const rfiTaskMap = requestForInformationTaskMap[taskType];
    delete payload?.rfiAttachments;

    return this.processAction(rfiTaskMap?.requestTaskType, {
      ...payload,
      payloadType: rfiTaskMap?.requestTaskPayloadType,
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
