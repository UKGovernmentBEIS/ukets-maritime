import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RequestTaskActionProcessDTO } from '@mrtm/api';

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

import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class FollowUpAmendApiService extends TaskApiService<FollowUpAmendTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'EMP_NOTIFICATION':
      default:
        return {
          actionType: 'EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND',
          actionPayloadType: 'EMP_NOTIFICATION_FOLLOW_UP_SAVE_APPLICATION_AMEND_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'EMP_NOTIFICATION':
      default:
        return {
          actionType: 'EMP_NOTIFICATION_FOLLOW_UP_SUBMIT_APPLICATION_AMEND',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  save(payload: FollowUpAmendTaskPayload): Observable<FollowUpAmendTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
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

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(payload: FollowUpAmendTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        response: payload.followUpResponse,
        files: payload.followUpFiles,
        sectionsCompleted: payload.sectionsCompleted,
      },
    } as RequestTaskActionProcessDTO;
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.submitActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
      },
    } as RequestTaskActionProcessDTO;
  }
}
