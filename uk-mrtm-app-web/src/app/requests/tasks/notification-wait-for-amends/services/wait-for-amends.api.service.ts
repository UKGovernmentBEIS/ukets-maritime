import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  EmpNotificationFollowUpExtendDateRequestTaskActionPayload,
  RequestActionsService,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { WaitForAmendsTaskPayload } from '@requests/tasks/notification-wait-for-amends/wait-for-amends.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class WaitForAmendsApiService extends TaskApiService<WaitForAmendsTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly requestActionsService = inject(RequestActionsService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'EMP_NOTIFICATION':
      default:
        return {
          actionType: 'EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE',
          actionPayloadType: 'EMP_NOTIFICATION_FOLLOW_UP_EXTEND_DATE_PAYLOAD',
        };
    }
  }

  save(payload: WaitForAmendsTaskPayload): Observable<WaitForAmendsTaskPayload> {
    return this.service
      .processRequestTaskAction(
        this.createSaveAction({
          payloadType: payload.payloadType,
          dueDate: (payload.reviewDecision.details['dueDate'] as Date).toISOString(),
        }),
      )
      .pipe(
        map(() => payload),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
        this.pendingRequestService.trackRequest(),
      );
  }

  private createSaveAction(
    payload: EmpNotificationFollowUpExtendDateRequestTaskActionPayload,
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        dueDate: payload.dueDate,
      },
    } as RequestTaskActionProcessDTO;
  }

  public updateTimeline(requestTaskId: string) {
    return this.requestActionsService.getRequestActionsByRequestId(requestTaskId);
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
